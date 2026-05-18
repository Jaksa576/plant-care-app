export type PlantIdentificationCandidate = {
  provider: "plantnet";
  scientificName: string;
  commonName: string | null;
  confidenceScore: number;
  confidenceLabel: "strong" | "possible" | "low";
  alternateScientificNames: string[];
};

export type PlantIdentificationStatus = "idle" | "success" | "no-candidates" | "error";
