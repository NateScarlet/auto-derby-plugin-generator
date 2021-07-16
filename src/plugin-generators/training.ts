import type { TrainingType } from "@/constants";

export interface ExpectedScore {
  turn: number;
  type: TrainingType;
  value: number;
}

export interface Input {
  scores: ExpectedScore[];
}

export default function generateTrainingPlugin(input: Input): string {
  return JSON.stringify(input);
}
