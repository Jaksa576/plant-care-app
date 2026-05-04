export type PlantIdentificationCandidate = {
  provider: "plantnet";
  scientificName: string;
  commonName: string | null;
  confidenceScore: number;
  confidenceLabel: "likely" | "possible" | "not_sure";
};

export type PlantIdentificationStatus = "idle" | "success" | "no-candidates" | "error";
