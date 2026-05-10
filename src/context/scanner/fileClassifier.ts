import { ProjectDomainMap } from "../types/projectContext";

export interface FileClassification {
  filePath: string;
  domain: string | null;
  confidence: number;
}

export function classifyFile(
  filePath: string,
  domainMap: ProjectDomainMap
): FileClassification {

  const normalizedPath = filePath.toLowerCase();

  let bestDomain: string | null = null;

  let highestScore = 0;

  for (const [domainName, metadata] of Object.entries(domainMap)) {

    let score = 0;

    // Strong path matching
    for (const expectedPath of metadata.expectedPaths) {

      const normalizedExpectedPath =
        expectedPath.toLowerCase();

      if (
        normalizedPath.includes(normalizedExpectedPath)
      ) {
        score += 20;
      }
    }

    // Keyword matching
    for (const keyword of metadata.keywords) {

      if (
        normalizedPath.includes(
          keyword.toLowerCase()
        )
      ) {
        score += 5;
      }
    }

    // Exact folder/domain name bonus
    if (
      normalizedPath.includes(domainName.toLowerCase())
    ) {
      score += 30;
    }

    // Track best domain
    if (score > highestScore) {

      highestScore = score;

      bestDomain = domainName;
    }
  }

  return {
    filePath,
    domain: bestDomain,
    confidence: highestScore
  };
}