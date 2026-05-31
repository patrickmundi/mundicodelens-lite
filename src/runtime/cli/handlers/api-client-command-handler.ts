import path from "path";

import { ApiClientInferenceCommand } from "../../cognition/domain/api-client-inference-command";

import { ApiClientGeneratorCommand } from "../../cognition/domain/api-client-generator-command";

import { ApiClientFileWriterCommand } from "../../cognition/domain/api-client-file-writer-command";

export class ApiClientCommandHandler {
  inferApiClients(): void {
    const apiClientInference = new ApiClientInferenceCommand();

    apiClientInference.execute();
  }

  generateApiClients(): void {
    const apiClientGenerator = new ApiClientGeneratorCommand();

    apiClientGenerator.execute();
  }

  writeApiClients(rootPath: string): void {
    const writer = new ApiClientFileWriterCommand();

    writer.execute(path.join(rootPath, "generated-api-clients"));
  }
}
