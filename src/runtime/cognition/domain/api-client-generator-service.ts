import { ApiClientDefinition } from "./api-client-inference-service";

export interface GeneratedApiClientFile {
  fileName: string;
  content: string;
}

export interface ApiClientGeneratorResult {
  success: boolean;
  files: GeneratedApiClientFile[];
  diagnostics: string[];
}

export class ApiClientGeneratorService {
  generateClients(clients: ApiClientDefinition[]): ApiClientGeneratorResult {
    const diagnostics: string[] = [];

    diagnostics.push("Starting API client generation.");

    const files: GeneratedApiClientFile[] = [];

    files.push({
      fileName: "finance-api.ts",
      content: this.buildFinanceApiClient(clients),
    });

    diagnostics.push(`Generated ${files.length} API client file(s).`);

    diagnostics.push("API client generation completed successfully.");

    return {
      success: true,
      files,
      diagnostics,
    };
  }

  private buildFinanceApiClient(clients: ApiClientDefinition[]): string {
    const methods = clients
      .map(
        (client) => `
  async ${client.clientMethod}() {
    return fetch(
      "${client.endpoint}",
      {
        method: "${client.method}",
      },
    );
  }
`,
      )
      .join("\n");

    return `
export class FinanceApiClient {
${methods}
}

export const financeApi =
  new FinanceApiClient();
`;
  }
}
