export interface ProjectContextPayload {
  filePath: string;
  domain: string | null;

  description?: string;

  riskLevel?: "low" | "medium" | "high" | "critical";

  dependsOn?: string[];

  aiContextHints?: string[];

  keywords?: string[];

  framework?: string[];
}