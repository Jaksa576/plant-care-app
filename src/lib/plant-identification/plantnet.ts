import type { PlantIdentificationCandidate } from "@/lib/plant-identification/types";
import { normalizeCareProfileName } from "@/lib/care-profiles/normalize";

const PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify";
const PLANTNET_RESULT_LIMIT = 3;

type PlantNetConfig = {
  apiKey: string;
  project: string;
};

type PlantNetIdentifyResult =
  | { data: PlantIdentificationCandidate[]; error: null }
  | { data: null; error: string };

function logPlantNetDiagnostic(
  reason: string,
  details: Record<string, string | number | boolean | null> = {},
) {
  console.error("[plant-identification:plantnet]", {
    reason,
    ...details,
  });
}

function getProviderFailureMessage(status: number) {
  if (status === 401 || status === 403) {
    return "Plant identification provider rejected the server request. Check the Pl@ntNet API key, or keep editing manually.";
  }

  if (status === 413) {
    return "That photo was too large for the identification provider. Try a smaller image or continue manually.";
  }

  if (status === 429) {
    return "Plant identification is temporarily rate-limited. Try again later or continue manually.";
  }

  if (status >= 500) {
    return "Plant identification provider is temporarily unavailable. Your plant details are still editable.";
  }

  return "Plant identification provider failed to process this photo. Your plant details are still editable.";
}

function getConfidenceLabel(score: number): PlantIdentificationCandidate["confidenceLabel"] {
  if (score >= 0.75) {
    return "strong";
  }

  if (score >= 0.45) {
    return "possible";
  }

  return "low";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizePlantNetCandidate(value: unknown): PlantIdentificationCandidate | null {
  if (!isRecord(value)) {
    return null;
  }

  const species = value.species;

  if (!isRecord(species)) {
    return null;
  }

  const scientificName =
    readString(species.scientificNameWithoutAuthor) || readString(species.scientificName);

  if (!scientificName) {
    return null;
  }

  const commonNames = Array.isArray(species.commonNames) ? species.commonNames : [];
  const commonName = commonNames.map(readString).find(Boolean) ?? null;
  const confidenceScore = readNumber(value.score);

  return {
    provider: "plantnet",
    scientificName,
    commonName,
    confidenceScore,
    confidenceLabel: getConfidenceLabel(confidenceScore),
    alternateScientificNames: [],
  };
}

function groupSimilarCandidates(candidates: PlantIdentificationCandidate[]) {
  const groupedCandidates = new Map<string, PlantIdentificationCandidate[]>();
  const ungroupedCandidates: PlantIdentificationCandidate[] = [];

  for (const candidate of candidates) {
    const normalizedCommonName = normalizeCareProfileName(candidate.commonName);

    if (!normalizedCommonName) {
      ungroupedCandidates.push(candidate);
      continue;
    }

    const group = groupedCandidates.get(normalizedCommonName) ?? [];
    group.push(candidate);
    groupedCandidates.set(normalizedCommonName, group);
  }

  const grouped = [...groupedCandidates.values()].map((group) => {
    const [primary, ...alternates] = [...group].sort(
      (candidateA, candidateB) => candidateB.confidenceScore - candidateA.confidenceScore,
    );
    const alternateScientificNames = [
      ...new Set(
        alternates
          .map((candidate) => candidate.scientificName)
          .filter((scientificName) => scientificName !== primary.scientificName),
      ),
    ];

    return {
      ...primary,
      alternateScientificNames,
    };
  });

  return [...grouped, ...ungroupedCandidates]
    .sort((candidateA, candidateB) => candidateB.confidenceScore - candidateA.confidenceScore)
    .slice(0, PLANTNET_RESULT_LIMIT);
}

export async function identifyPlantWithPlantNet(
  config: PlantNetConfig,
  image: Blob,
): Promise<PlantNetIdentifyResult> {
  if (image.size <= 0) {
    logPlantNetDiagnostic("empty-image", {
      project: config.project,
      imageType: image.type || null,
    });

    return {
      data: null,
      error: "That image could not be read. Choose a JPG, PNG, or WebP photo and try again.",
    };
  }

  const endpoint = new URL(`${PLANTNET_BASE_URL}/${encodeURIComponent(config.project)}`);
  endpoint.searchParams.set("api-key", config.apiKey);
  endpoint.searchParams.set("lang", "en");
  endpoint.searchParams.set("nb-results", String(PLANTNET_RESULT_LIMIT));

  const formData = new FormData();
  formData.append("images", image, "plant-photo.jpg");
  formData.append("organs", "auto");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      logPlantNetDiagnostic("provider-non-ok-response", {
        project: config.project,
        status: response.status,
        statusText: response.statusText,
        imageType: image.type || null,
        imageSize: image.size,
      });

      return {
        data: null,
        error: getProviderFailureMessage(response.status),
      };
    }

    const payload: unknown = await response.json();
    const results = isRecord(payload) && Array.isArray(payload.results) ? payload.results : [];
    const candidates = results
      .map(normalizePlantNetCandidate)
      .filter((candidate): candidate is PlantIdentificationCandidate => Boolean(candidate))
      .slice(0, PLANTNET_RESULT_LIMIT * 2);

    return {
      data: groupSimilarCandidates(candidates),
      error: null,
    };
  } catch (error) {
    logPlantNetDiagnostic("provider-request-error", {
      project: config.project,
      imageType: image.type || null,
      imageSize: image.size,
      errorName: error instanceof Error ? error.name : "unknown",
      errorMessage: error instanceof Error ? error.message : "unknown request error",
    });

    return {
      data: null,
      error:
        "Plant identification could not reach the provider right now. Your plant details are still editable.",
    };
  }
}
