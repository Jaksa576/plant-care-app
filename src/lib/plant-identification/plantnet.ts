import type { PlantIdentificationCandidate } from "@/lib/plant-identification/types";

const PLANTNET_BASE_URL = "https://my-api.plantnet.org/v2/identify";
const PLANTNET_RESULT_LIMIT = 3;

type PlantNetConfig = {
  apiKey: string;
  project: string;
};

type PlantNetIdentifyResult =
  | { data: PlantIdentificationCandidate[]; error: null }
  | { data: null; error: string };

function getConfidenceLabel(score: number): PlantIdentificationCandidate["confidenceLabel"] {
  if (score >= 0.75) {
    return "likely";
  }

  if (score >= 0.45) {
    return "possible";
  }

  return "not_sure";
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
  };
}

export async function identifyPlantWithPlantNet(
  config: PlantNetConfig,
  image: Blob,
): Promise<PlantNetIdentifyResult> {
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
      return {
        data: null,
        error: "Identification is unavailable right now. Your plant details are still editable.",
      };
    }

    const payload: unknown = await response.json();
    const results = isRecord(payload) && Array.isArray(payload.results) ? payload.results : [];
    const candidates = results
      .map(normalizePlantNetCandidate)
      .filter((candidate): candidate is PlantIdentificationCandidate => Boolean(candidate))
      .slice(0, PLANTNET_RESULT_LIMIT);

    return {
      data: candidates,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Identification is unavailable right now. Your plant details are still editable.",
    };
  }
}
