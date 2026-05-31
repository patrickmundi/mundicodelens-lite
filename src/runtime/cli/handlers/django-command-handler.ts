import { runDjangoCognitionCommand } from "../commands/django-cognition-command";

import { runDashboardTopologyCommand } from "../commands/dashboard-topology-command";

import { DjangoEndpointCognitionCommand } from "../../cognition/domain/django-endpoint-cognition-command";

import { DjangoRestFrameworkCognitionCommand } from "../../cognition/domain/django-rest-framework-cognition-command";

export class DjangoCommandHandler {
  async runDjangoCognition(rootPath: string): Promise<void> {
    await runDjangoCognitionCommand({
      rootPath,
    });
  }

  async runDashboardInference(rootPath: string): Promise<void> {
    await runDashboardTopologyCommand({
      rootPath,
    });
  }

  runEndpointDiscovery(rootPath: string): void {
    const endpointCognition = new DjangoEndpointCognitionCommand();

    endpointCognition.execute(rootPath);
  }

  runDrfCognition(rootPath: string): void {
    const drfCognition = new DjangoRestFrameworkCognitionCommand();

    drfCognition.execute(rootPath);
  }
}
