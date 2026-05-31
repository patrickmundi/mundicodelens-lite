import * as fs from "fs";
import * as path from "path";

export interface DjangoEndpoint {
  route: string;
  sourceFile: string;
}

export interface DjangoEndpointCognitionResult {
  success: boolean;
  endpoints: DjangoEndpoint[];
  diagnostics: string[];
}

export class DjangoEndpointCognitionService {
  analyze(repositoryRoot: string): DjangoEndpointCognitionResult {
    const diagnostics: string[] = [];

    const endpoints: DjangoEndpoint[] = [];

    diagnostics.push("Starting Django endpoint cognition.");

    this.scanDirectory(repositoryRoot, endpoints, diagnostics);

    diagnostics.push(`Discovered ${endpoints.length} endpoint(s).`);

    diagnostics.push("Django endpoint cognition completed successfully.");

    return {
      success: true,
      endpoints,
      diagnostics,
    };
  }

  private scanDirectory(
    directory: string,
    endpoints: DjangoEndpoint[],
    diagnostics: string[],
  ): void {
    if (!fs.existsSync(directory)) {
      return;
    }

    const entries = fs.readdirSync(directory);

    for (const entry of entries) {
      const fullPath = path.join(directory, entry);

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.scanDirectory(fullPath, endpoints, diagnostics);

        continue;
      }

      if (entry !== "urls.py") {
        continue;
      }

      diagnostics.push(`Scanning ${fullPath}`);

      const content = fs.readFileSync(fullPath, "utf8");

      const pathMatches = content.matchAll(/path\(\s*["']([^"']+)["']/g);

      for (const match of pathMatches) {
        const route = match[1];

        endpoints.push({
          route,
          sourceFile: fullPath,
        });

        diagnostics.push(`Discovered endpoint: ${route}`);
      }
    }
  }
}
