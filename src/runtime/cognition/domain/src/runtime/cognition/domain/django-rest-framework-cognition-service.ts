import * as fs from "fs";
import * as path from "path";

export interface DRFEndpoint {
  route: string;
  viewSet: string;
  filePath: string;
}

export interface DjangoRestFrameworkCognitionResult {
  success: boolean;
  endpoints: DRFEndpoint[];
  diagnostics: string[];
}

export class DjangoRestFrameworkCognitionService {
  analyze(repositoryRoot: string): DjangoRestFrameworkCognitionResult {
    const diagnostics: string[] = [];

    const endpoints: DRFEndpoint[] = [];

    diagnostics.push("Starting Django REST Framework cognition.");

    this.scanDirectory(repositoryRoot, endpoints, diagnostics);

    diagnostics.push(`Discovered ${endpoints.length} DRF endpoint(s).`);

    diagnostics.push("Django REST Framework cognition completed successfully.");

    return {
      success: true,
      endpoints,
      diagnostics,
    };
  }

  private scanDirectory(
    directory: string,
    endpoints: DRFEndpoint[],
    diagnostics: string[],
  ): void {
    const ignoredDirectories = [
      "venv",
      ".venv",
      "node_modules",
      ".git",
      "__pycache__",
      "migrations",
      "staticfiles",
      "media",
    ];

    const entries = fs.readdirSync(directory, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (ignoredDirectories.includes(entry.name)) {
          continue;
        }

        this.scanDirectory(fullPath, endpoints, diagnostics);

        continue;
      }

      if (!entry.name.endsWith(".py")) {
        continue;
      }

      const content = fs.readFileSync(fullPath, "utf8");

      this.extractRouterRegistrations(
        content,
        fullPath,
        endpoints,
        diagnostics,
      );

      this.extractViewSets(content, fullPath, endpoints, diagnostics);
    }
  }

  private extractRouterRegistrations(
    content: string,
    filePath: string,
    endpoints: DRFEndpoint[],
    diagnostics: string[],
  ): void {
    const routerRegex =
      /router\.register\(\s*["']([^"']+)["']\s*,\s*([A-Za-z0-9_]+)/g;

    let match: RegExpExecArray | null;

    while ((match = routerRegex.exec(content)) !== null) {
      const route = match[1];

      const viewSet = match[2];

      endpoints.push({
        route: `/api/${route}/`,
        viewSet,
        filePath,
      });

      diagnostics.push(`Discovered router endpoint: ${route}`);
    }
  }

  private extractViewSets(
    content: string,
    filePath: string,
    endpoints: DRFEndpoint[],
    diagnostics: string[],
  ): void {
    const viewSetRegex = /class\s+([A-Za-z0-9_]+)\(([^)]*ViewSet[^)]*)\)/g;

    let match: RegExpExecArray | null;

    while ((match = viewSetRegex.exec(content)) !== null) {
      const viewSet = match[1];

      endpoints.push({
        route: "[router-generated]",
        viewSet,
        filePath,
      });

      diagnostics.push(`Discovered ViewSet: ${viewSet}`);
    }
  }
}
