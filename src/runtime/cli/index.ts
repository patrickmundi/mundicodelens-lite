import path from "path";

import { runScanCommand } from "./commands/scan-command";

import { runImpactCommand } from "./commands/impact-command";

import { runValidateCommand } from "./commands/validate-command";

import { runWatchCommand } from "./commands/watch-command";

import { runMutationCommand } from "./commands/mutation-command";

import { runSuggestionCommand } from "./commands/suggestion-command";

import { runDjangoCognitionCommand } from "./commands/django-cognition-command";

import { DjangoEndpointCognitionCommand } from "../cognition/domain/django-endpoint-cognition-command";

import { runDashboardTopologyCommand } from "./commands/dashboard-topology-command";

import { FinanceDomainCognitionCommand } from "../cognition/domain/finance-domain-cognition-command";

import { ComponentScaffoldCommand } from "../cognition/domain/component-scaffold-command";

import { ComponentFileWriterCommand } from "../cognition/domain/component-file-writer-command";

import { ComponentScaffoldService } from "../cognition/domain/component-scaffold-service";

import { ApiClientInferenceCommand } from "../cognition/domain/api-client-inference-command";

import { ApiClientGeneratorCommand } from "../cognition/domain/api-client-generator-command";

import { ApiClientFileWriterCommand } from "../cognition/domain/api-client-file-writer-command";

import { RuntimeCommandDispatcher } from "./runtime-command-dispatcher";

import { registerRuntimeCommands } from "./command-registration";

import { showRuntimeHelpMenu } from "./runtime-help-menu";

import { buildRuntimeBootstrap } from "../bootstrap/runtime-bootstrap";

import { AutonomousEngineeringJudgmentService } from "../reasoning/services/autonomous-engineering-judgment-service";

import { AutonomousExecutionSimulationService } from "../reasoning/services/autonomous-execution-simulation-service";

import { ApiContractReconciliationCommand } from "../cognition/domain/api-contract-reconciliation-command";

import { RepositoryGraphScannerService } from "../scanning/services/repository-graph-scanner-service";

import { TypeScriptASTTransformationService } from "../mutation/services/typescript-ast-transformation-service";

import { RepositoryMutationTransactionService } from "../transactions/services/repository-mutation-transaction-service";

import { AutonomousRepositoryEvolutionPipelineService } from "../pipelines/services/autonomous-repository-evolution-pipeline-service";

import { AutonomousEvolutionDryRunService } from "../simulation/services/autonomous-evolution-dry-run-service";

import { AutonomousRuntimeCommandCenterService } from "./services/autonomous-runtime-command-center-service";

import { RuntimeCognitionTelemetryService } from "../telemetry/services/runtime-cognition-telemetry-service";

import { CognitionIntegrationOrchestratorService } from "../integration/services/cognition-integration-orchestrator-service";

import { RepositoryCognitionService } from "../reasoning/services/repository-cognition-service";

import { MutationGovernanceCognitionService } from "../governance/services/mutation-governance-cognition-service";

import { RepositoryEvolutionMemoryService } from "../memory/services/repository-evolution-memory-service";

import { AutonomousEngineeringLearningService } from "../learning/services/autonomous-engineering-learning-service";

import { EngineeringIntentCognitionService } from "../intent/services/engineering-intent-cognition-service";

import { UnifiedEngineeringCognitionService } from "../consciousness/services/unified-engineering-cognition-service";

import { EndpointSemanticMatchingCommand } from "../cognition/domain/endpoint-semantic-matching-command";

import { SemanticExecutionOrchestratorService } from "../mutation/services/semantic-execution-orchestrator-service";

async function bootstrapCLI(): Promise<void> {
  const args = process.argv.slice(2);

  const command = args[0];

  const commandArgs = args.slice(1);

  const rootPath = path.resolve(process.cwd());

  let tsConfigFilePath: string | undefined;

  const resolvedTsConfig = path.resolve(process.cwd(), "tsconfig.json");

  const resolvedJsConfig = path.resolve(process.cwd(), "jsconfig.json");

  /**
   * Adaptive repository cognition.
   */
  if (require("fs").existsSync(resolvedTsConfig)) {
    tsConfigFilePath = resolvedTsConfig;

    console.log("[MundiCodeLens CLI] TypeScript project detected.\n");
  } else if (require("fs").existsSync(resolvedJsConfig)) {
    tsConfigFilePath = resolvedJsConfig;

    console.log(
      "[MundiCodeLens CLI] JavaScript project detected via jsconfig.json.\n",
    );
  } else {
    console.log(
      "[MundiCodeLens CLI] No tsconfig.json or jsconfig.json detected.\n",
    );
  }

  console.log("\n[MundiCodeLens CLI] Bootstrapping runtime CLI...\n");

  /**
   * Core cognition services.
   */

  // const repositoryCognition = new RepositoryCognitionService();

  // const governanceCognition = new MutationGovernanceCognitionService(
  //   repositoryCognition,
  // );

  // const memoryCognition = new RepositoryEvolutionMemoryService();

  // const learningCognition = new AutonomousEngineeringLearningService(
  //   memoryCognition,
  // );

  // const intentCognition = new EngineeringIntentCognitionService();

  // const simulationService = new AutonomousExecutionSimulationService();

  // const judgmentCognition = new AutonomousEngineeringJudgmentService(
  //   simulationService,
  // );

  // const semanticExecution = new SemanticExecutionOrchestratorService();

  // const unifiedCognition = new UnifiedEngineeringCognitionService(
  //   repositoryCognition,
  //   governanceCognition,
  //   judgmentCognition,
  //   memoryCognition,
  //   learningCognition,
  // );

  // /*
  //  * Integration orchestration.
  //  */
  // const integrationOrchestrator = new CognitionIntegrationOrchestratorService(
  //   repositoryCognition,
  //   governanceCognition,
  //   memoryCognition,
  //   learningCognition,
  //   intentCognition,
  //   unifiedCognition,
  //   semanticExecution,
  // );

  // /**
  //  * Runtime infrastructure.
  //  */
  // const repositoryScanner = new RepositoryGraphScannerService();

  // const astTransformation = new TypeScriptASTTransformationService();

  // const transactionManager = new RepositoryMutationTransactionService();

  // const evolutionPipeline = new AutonomousRepositoryEvolutionPipelineService();

  // const dryRunService = new AutonomousEvolutionDryRunService();

  // const telemetry = new RuntimeCognitionTelemetryService();

  // /**
  //  * Runtime command center.
  //  */
  // const commandCenter = new AutonomousRuntimeCommandCenterService(
  //   repositoryScanner,
  //   astTransformation,
  //   transactionManager,
  //   evolutionPipeline,
  //   dryRunService,
  //   telemetry,
  //   integrationOrchestrator,
  // );

  const runtime = buildRuntimeBootstrap();

  const commandCenter = runtime.commandCenter;

  switch (command) {
    case "scan":
      await runScanCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "impact":
      await runImpactCommand({
        rootPath,
        tsConfigFilePath,
        target: commandArgs[0],
      });

      break;

    case "validate":
      await runValidateCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "watch":
      await runWatchCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "mutate":
      await runMutationCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "runtime:scan":
      console.log(
        commandCenter.executeCommand({
          command: "SCAN_REPOSITORY",
          repositoryPath: rootPath,
        }),
      );

      break;

    case "runtime:dry-run":
      console.log(
        commandCenter.executeCommand({
          command: "DRY_RUN",
          repositoryPath: rootPath,
        }),
      );

      break;

    case "runtime:suggest":
      await runSuggestionCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "runtime:django-cognition":
      {
        const dispatcher = new RuntimeCommandDispatcher();

        registerRuntimeCommands(dispatcher, rootPath);

        await dispatcher.dispatch(command);

        break;
      }

      break;

    case "runtime:semantic-endpoints": {
      const semanticMatcher = new EndpointSemanticMatchingCommand();

      semanticMatcher.execute(rootPath);

      break;
    }

    case "runtime:django-endpoints":
      {
        const dispatcher = new RuntimeCommandDispatcher();

        registerRuntimeCommands(dispatcher, rootPath);

        await dispatcher.dispatch(command);

        break;
      }

      break;

    case "runtime:infer-dashboards":
      {
        const dispatcher = new RuntimeCommandDispatcher();

        registerRuntimeCommands(dispatcher, rootPath);

        await dispatcher.dispatch(command);

        break;
      }

      break;

    case "runtime:finance-cognition": {
      const dispatcher = new RuntimeCommandDispatcher();

      registerRuntimeCommands(dispatcher, rootPath);

      await dispatcher.dispatch(command);

      break;
    }

    case "runtime:infer-api-clients":
    case "runtime:generate-api-clients":
    case "runtime:write-api-clients": {
      const dispatcher = new RuntimeCommandDispatcher();

      registerRuntimeCommands(dispatcher, rootPath);

      await dispatcher.dispatch(command);

      break;
    }

    case "runtime:generate-components":
    case "runtime:write-components": {
      const dispatcher = new RuntimeCommandDispatcher();

      registerRuntimeCommands(dispatcher, rootPath);

      await dispatcher.dispatch(command);

      break;
    }

    case "runtime:reconcile-api-contracts": {
      const reconciliation = new ApiContractReconciliationCommand();

      reconciliation.execute(rootPath);

      break;
    }

    default:
      showRuntimeHelpMenu();

      process.exit(1);
  }
}

console.log("[AST Mutation] Semantic runtime active.");

bootstrapCLI().catch((error) => {
  console.error("\n[MundiCodeLens CLI] Runtime CLI failed:", error);

  process.exit(1);
});
