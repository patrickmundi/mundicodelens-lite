export interface ProjectContextPayload {
  filePath: string;

  domain: string | null;

  detectedRole?: string;

  description?: string;

  riskLevel?: "low" | "medium" | "high" | "critical";

  dependsOn?: string[];

  aiContextHints?: string[];

  keywords?: string[];

  framework?: string[];

  globalEngineeringRules?: string[];

  projectPatterns?: string[];

  criticalBusinessRules?: string[];
}
