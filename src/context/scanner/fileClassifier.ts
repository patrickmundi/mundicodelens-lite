import { ProjectDomainMap } from "../types/projectContext";

export interface FileClassification {
  filePath: string;

  domain: string | null;

  confidence: number;

  // 🔥 NEW
  relatedDomains?: string[];

  relatedFiles?: string[];
}

export function classifyFile(
  filePath: string,
  domainMap: ProjectDomainMap,
): FileClassification {
  const normalizedPath = filePath.toLowerCase();

  let bestDomain: string | null = null;

  let highestScore = 0;

  // 🔥 NEW
  const relatedDomains: string[] = [];

  // 🔥 NEW
  const relatedFiles: string[] = [];

  for (const [domainName, metadata] of Object.entries(domainMap)) {
    let score = 0;

    // ✅ Strong path matching
    for (const expectedPath of metadata.expectedPaths) {
      const normalizedExpectedPath = expectedPath.toLowerCase();

      if (normalizedPath.includes(normalizedExpectedPath)) {
        score += 20;

        // 🔥 Track relationships
        relatedFiles.push(normalizedExpectedPath);
      }
    }

    // ✅ Keyword matching
    for (const keyword of metadata.keywords) {
      if (normalizedPath.includes(keyword.toLowerCase())) {
        score += 5;
      }
    }

    // ✅ Exact folder/domain bonus
    if (normalizedPath.includes(domainName.toLowerCase())) {
      score += 30;
    }

    // 🔥 Relationship awareness
    if (score >= 15) {
      relatedDomains.push(domainName);
    }

    // ✅ Best domain selection
    if (score > highestScore) {
      highestScore = score;

      bestDomain = domainName;
    }
  }

  return {
    filePath,

    domain: bestDomain,

    confidence: highestScore,

    relatedDomains,

    relatedFiles,
  };
}
