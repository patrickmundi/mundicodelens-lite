import * as fs from "fs";

import * as path from "path";

export interface DjangoAppTopology {
  appName: string;

  models: string[];

  views: string[];

  serializers: string[];

  urls: string[];

  adminConfigurations: string[];
}

export interface DjangoRepositoryTopology {
  apps: DjangoAppTopology[];

  totalApps: number;

  totalModels: number;

  totalViews: number;

  totalSerializers: number;

  totalUrls: number;
}

export interface DjangoRepositoryCognitionResult {
  success: boolean;

  topology: DjangoRepositoryTopology;

  diagnostics: string[];

  error?: string;
}

export class DjangoRepositoryCognitionService {
  /**
   * Analyze Django repository structure.
   */
  public analyzeRepository(
    repositoryPath: string,
  ): DjangoRepositoryCognitionResult {
    const diagnostics: string[] = [];

    const apps: DjangoAppTopology[] = [];

    try {
      diagnostics.push(
        `Starting Django repository cognition scan at '${repositoryPath}'.`,
      );

      /**
       * Discover Django apps.
       */
      const entries = fs.readdirSync(repositoryPath, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        /**
         * Ignore infrastructure folders.
         */
        if (
          [
            "venv",
            "node_modules",
            "media",
            "static",
            "__pycache__",
            ".git",
          ].includes(entry.name)
        ) {
          continue;
        }

        const appPath = path.join(repositoryPath, entry.name);

        /**
         * Detect Django app indicators.
         */
        const modelsPath = path.join(appPath, "models.py");

        const viewsPath = path.join(appPath, "views.py");

        const serializersPath = path.join(appPath, "serializers.py");

        const urlsPath = path.join(appPath, "urls.py");

        const adminPath = path.join(appPath, "admin.py");

        const isDjangoApp =
          fs.existsSync(modelsPath) ||
          fs.existsSync(viewsPath) ||
          fs.existsSync(serializersPath) ||
          fs.existsSync(urlsPath);

        if (!isDjangoApp) {
          continue;
        }

        diagnostics.push(`Discovered Django app '${entry.name}'.`);

        const topology: DjangoAppTopology = {
          appName: entry.name,

          models: [],

          views: [],

          serializers: [],

          urls: [],

          adminConfigurations: [],
        };

        /**
         * Analyze models.
         */
        if (fs.existsSync(modelsPath)) {
          const modelsContent = fs.readFileSync(modelsPath, "utf-8");

          const modelMatches =
            modelsContent.match(/class\s+(\w+)\(models\.Model\)/g) ?? [];

          topology.models.push(...modelMatches);

          diagnostics.push(
            `Indexed ${modelMatches.length} models in '${entry.name}'.`,
          );
        }

        /**
         * Analyze views.
         */
        if (fs.existsSync(viewsPath)) {
          const viewsContent = fs.readFileSync(viewsPath, "utf-8");

          const viewMatches =
            viewsContent.match(/class\s+(\w+)|def\s+(\w+)/g) ?? [];

          topology.views.push(...viewMatches);

          diagnostics.push(
            `Indexed ${viewMatches.length} views/functions in '${entry.name}'.`,
          );
        }

        /**
         * Analyze serializers.
         */
        if (fs.existsSync(serializersPath)) {
          const serializerContent = fs.readFileSync(serializersPath, "utf-8");

          const serializerMatches =
            serializerContent.match(/class\s+(\w+Serializer)/g) ?? [];

          topology.serializers.push(...serializerMatches);

          diagnostics.push(
            `Indexed ${serializerMatches.length} serializers in '${entry.name}'.`,
          );
        }

        /**
         * Analyze URLs.
         */
        if (fs.existsSync(urlsPath)) {
          const urlsContent = fs.readFileSync(urlsPath, "utf-8");

          const urlMatches = urlsContent.match(/path\(/g) ?? [];

          topology.urls.push(...urlMatches);

          diagnostics.push(
            `Indexed ${urlMatches.length} URL routes in '${entry.name}'.`,
          );
        }

        /**
         * Analyze admin registrations.
         */
        if (fs.existsSync(adminPath)) {
          const adminContent = fs.readFileSync(adminPath, "utf-8");

          const adminMatches =
            adminContent.match(/admin\.site\.register/g) ?? [];

          topology.adminConfigurations.push(...adminMatches);

          diagnostics.push(
            `Indexed ${adminMatches.length} admin registrations in '${entry.name}'.`,
          );
        }

        apps.push(topology);
      }

      /**
       * Build repository topology.
       */
      const repositoryTopology: DjangoRepositoryTopology = {
        apps,

        totalApps: apps.length,

        totalModels: apps.reduce((total, app) => total + app.models.length, 0),

        totalViews: apps.reduce((total, app) => total + app.views.length, 0),

        totalSerializers: apps.reduce(
          (total, app) => total + app.serializers.length,
          0,
        ),

        totalUrls: apps.reduce((total, app) => total + app.urls.length, 0),
      };

      diagnostics.push("Django repository cognition completed successfully.");

      return {
        success: true,

        topology: repositoryTopology,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        topology: {
          apps: [],

          totalApps: 0,

          totalModels: 0,

          totalViews: 0,

          totalSerializers: 0,

          totalUrls: 0,
        },

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown Django cognition failure.",
      };
    }
  }

  /**
   * Generate cognition report.
   */
  public generateCognitionReport(
    result: DjangoRepositoryCognitionResult,
  ): string {
    return [
      "=== Django Repository Cognition Report ===",

      "",

      `Success: ${result.success}`,

      `Discovered Apps: ${result.topology.totalApps}`,

      `Total Models: ${result.topology.totalModels}`,

      `Total Views: ${result.topology.totalViews}`,

      `Total Serializers: ${result.topology.totalSerializers}`,

      `Total URL Routes: ${result.topology.totalUrls}`,

      "",

      "Discovered Django Apps:",

      ...result.topology.apps.map((app) =>
        [
          `- ${app.appName}`,

          `  Models: ${app.models.length}`,

          `  Views: ${app.views.length}`,

          `  Serializers: ${app.serializers.length}`,

          `  URLs: ${app.urls.length}`,
        ].join("\n"),
      ),

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),
    ].join("\n");
  }
}
