export interface EndpointSemanticMatch {
  endpoint: string;
  contract: string;
  confidence: number;
}

export interface EndpointSemanticMatchingResult {
  success: boolean;
  matches: EndpointSemanticMatch[];
  diagnostics: string[];
}

export class EndpointSemanticMatchingService {
  match(
    contracts: string[],
    endpoints: string[],
  ): EndpointSemanticMatchingResult {
    const diagnostics: string[] = [];

    const matches: EndpointSemanticMatch[] = [];

    diagnostics.push("Starting endpoint semantic matching.");

    for (const contract of contracts) {
      const contractTokens = this.tokenize(contract);

      for (const endpoint of endpoints) {
        const endpointTokens = this.tokenize(endpoint);

        const confidence = this.calculateSimilarity(
          contractTokens,
          endpointTokens,
        );

        if (confidence >= 0.25) {
          matches.push({
            contract,
            endpoint,
            confidence,
          });

          diagnostics.push(
            `Matched ${contract} ↔ ${endpoint} (${confidence.toFixed(2)})`,
          );
        }
      }
    }

    matches.sort((a, b) => b.confidence - a.confidence);

    diagnostics.push(`Generated ${matches.length} semantic match(es).`);

    diagnostics.push("Endpoint semantic matching completed successfully.");

    return {
      success: true,
      matches,
      diagnostics,
    };
  }

  private tokenize(value: string): string[] {
    return this.normalize(value)
      .split(" ")
      .filter(Boolean)
      .map((token) => this.stem(token));
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .replace(/^api\//, "")
      .replace(/^finance\//, "")
      .replace(/<.*?>/g, "")
      .replace(/[-_]/g, " ")
      .replace(/\//g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private stem(token: string): string {
    if (token.length > 3 && token.endsWith("ies")) {
      return token.slice(0, -3) + "y";
    }

    if (token.length > 3 && token.endsWith("s")) {
      return token.slice(0, -1);
    }

    return token;
  }

  private calculateSimilarity(
    leftTokens: string[],
    rightTokens: string[],
  ): number {
    const left = new Set(leftTokens);

    const right = new Set(rightTokens);

    const intersection = [...left].filter((token) => right.has(token));

    const union = new Set([...left, ...right]);

    if (union.size === 0) {
      return 0;
    }

    return intersection.length / union.size;
  }
}
