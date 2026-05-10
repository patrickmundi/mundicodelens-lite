export interface DomainMetadata {
  description: string;
  expectedPaths: string[];
  keywords: string[];
  dependsOn?: string[];
  riskLevel?: "low" | "medium" | "high" | "critical";
  framework?: string[];
  aiContextHints?: string[];
}

export interface ProjectDomainMap {
  [domain: string]: DomainMetadata;
}

export interface FileClassification {
  filePath: string;
  domain: string | null;
  confidence: number;
}