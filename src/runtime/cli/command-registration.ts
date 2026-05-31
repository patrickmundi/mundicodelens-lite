import { RuntimeCommandDispatcher } from "./runtime-command-dispatcher";

import { ApiClientCommandHandler } from "./handlers/api-client-command-handler";

import { ComponentCommandHandler } from "./handlers/component-command-handler";

import { DjangoCommandHandler } from "./handlers/django-command-handler";

import { FinanceCommandHandler } from "./handlers/finance-command-handler";

export function registerRuntimeCommands(
  dispatcher: RuntimeCommandDispatcher,
  rootPath: string,
): void {
  const apiClientHandler = new ApiClientCommandHandler();

  const componentHandler = new ComponentCommandHandler();

  const djangoHandler = new DjangoCommandHandler();

  const financeHandler = new FinanceCommandHandler();

  dispatcher.register("runtime:infer-api-clients", {
    execute: () => apiClientHandler.inferApiClients(),
  });

  dispatcher.register("runtime:generate-api-clients", {
    execute: () => apiClientHandler.generateApiClients(),
  });

  dispatcher.register("runtime:write-api-clients", {
    execute: () => apiClientHandler.writeApiClients(rootPath),
  });

  dispatcher.register("runtime:generate-components", {
    execute: () => componentHandler.generateComponents(),
  });

  dispatcher.register("runtime:write-components", {
    execute: () => componentHandler.writeComponents(rootPath),
  });

  dispatcher.register("runtime:django-cognition", {
    execute: () => djangoHandler.runDjangoCognition(rootPath),
  });

  dispatcher.register("runtime:infer-dashboards", {
    execute: () => djangoHandler.runDashboardInference(rootPath),
  });

  dispatcher.register("runtime:django-endpoints", {
    execute: () => djangoHandler.runEndpointDiscovery(rootPath),
  });

  dispatcher.register("runtime:drf-cognition", {
    execute: () => djangoHandler.runDrfCognition(rootPath),
  });

  dispatcher.register("runtime:finance-cognition", {
    execute: () => financeHandler.runFinanceCognition(rootPath),
  });

  dispatcher.register("runtime:reconcile-api-contracts", {
    execute: () => financeHandler.reconcileApiContracts(rootPath),
  });

  dispatcher.register("runtime:semantic-endpoints", {
    execute: () => financeHandler.runSemanticEndpointMatching(rootPath),
  });
}
