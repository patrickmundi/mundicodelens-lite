import { FinanceDomainCognitionCommand } from "../../cognition/domain/finance-domain-cognition-command";

import { ApiClientInferenceCommand } from "../../cognition/domain/api-client-inference-command";

import { ApiClientGeneratorCommand } from "../../cognition/domain/api-client-generator-command";

import { ApiClientFileWriterCommand } from "../../cognition/domain/api-client-file-writer-command";

import { ApiContractReconciliationCommand } from "../../cognition/domain/api-contract-reconciliation-command";

import { EndpointSemanticMatchingCommand } from "../../cognition/domain/endpoint-semantic-matching-command";

export class FinanceCommandHandler {
  runFinanceCognition(rootPath: string): void {
    const command = new FinanceDomainCognitionCommand();

    command.execute(rootPath);
  }

  inferApiClients(): void {
    const command = new ApiClientInferenceCommand();

    command.execute();
  }

  generateApiClients(): void {
    const command = new ApiClientGeneratorCommand();

    command.execute();
  }

  writeApiClients(rootPath: string): void {
    const command = new ApiClientFileWriterCommand();

    command.execute(rootPath);
  }

  reconcileApiContracts(rootPath: string): void {
    const command = new ApiContractReconciliationCommand();

    command.execute(rootPath);
  }

  runSemanticEndpointMatching(rootPath: string): void {
    const command = new EndpointSemanticMatchingCommand();

    command.execute(rootPath);
  }
}
