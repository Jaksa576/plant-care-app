const COMBINING_MARKS_PATTERN = /[\u0300-\u036f]/g;
const NON_WORD_PATTERN = /[^a-z0-9]+/g;
const HYBRID_MARKER_PATTERN = /(^|\s)[x×](?=\s)/gi;

export function normalizeCareProfileName(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/×/g, " x ")
    .replace(COMBINING_MARKS_PATTERN, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(NON_WORD_PATTERN, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getNormalizedGenus(scientificName: string | null | undefined) {
  const normalizedName = normalizeCareProfileName(scientificName);

  return normalizedName.split(" ").find(Boolean) ?? "";
}

function normalizeScientificHybridMarkers(scientificName: string | null | undefined) {
  return normalizeCareProfileName(scientificName).replace(HYBRID_MARKER_PATTERN, " ").trim().replace(/\s+/g, " ");
}

function getNormalizedBinomial(scientificName: string | null | undefined) {
  const parts = normalizeScientificHybridMarkers(scientificName).split(" ").filter(Boolean);

  if (parts.length < 2) {
    return "";
  }

  return `${parts[0]} ${parts[1]}`;
}

export function getScientificNameCandidates(scientificName: string | null | undefined) {
  const candidates = [
    normalizeCareProfileName(scientificName),
    normalizeScientificHybridMarkers(scientificName),
    getNormalizedBinomial(scientificName),
  ];

  return candidates.filter((candidate, index) => candidate && candidates.indexOf(candidate) === index);
}
