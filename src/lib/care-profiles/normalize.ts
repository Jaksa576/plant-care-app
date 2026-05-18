const COMBINING_MARKS_PATTERN = /[\u0300-\u036f]/g;
const NON_WORD_PATTERN = /[^a-z0-9]+/g;

export function normalizeCareProfileName(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKD")
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
