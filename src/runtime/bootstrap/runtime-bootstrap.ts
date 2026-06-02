import { RepositoryGraphScannerService } from "../scanning/services/repository-graph-scanner-service";

import { TypeScriptASTTransformationService } from "../mutation/services/typescript-ast-transformation-service";

import { RepositoryMutationTransactionService } from "../transactions/services/repository-mutation-transaction-service";

import { AutonomousRepositoryEvolutionPipelineService } from "../pipelines/services/autonomous-repository-evolution-pipeline-service";

import { AutonomousEvolutionDryRunService } from "../simulation/services/autonomous-evolution-dry-run-service";

import { AutonomousRuntimeCommandCenterService } from "../cli/services/autonomous-runtime-command-center-service";

import { RuntimeCognitionTelemetryService } from "../telemetry/services/runtime-cognition-telemetry-service";

import { CognitionIntegrationOrchestratorService } from "../integration/services/cognition-integration-orchestrator-service";

import { RepositoryCognitionService } from "../reasoning/services/repository-cognition-service";

import { MutationGovernanceCognitionService } from "../governance/services/mutation-governance-cognition-service";

import { RepositoryEvolutionMemoryService } from "../memory/services/repository-evolution-memory-service";

import { AutonomousEngineeringLearningService } from "../learning/services/autonomous-engineering-learning-service";

import { EngineeringIntentCognitionService } from "../intent/services/engineering-intent-cognition-service";

import { UnifiedEngineeringCognitionService } from "../consciousness/services/unified-engineering-cognition-service";

import { SemanticExecutionOrchestratorService } from "../mutation/services/semantic-execution-orchestrator-service";

import { AutonomousEngineeringJudgmentService } from "../reasoning/services/autonomous-engineering-judgment-service";

import { AutonomousExecutionSimulationService } from "../reasoning/services/autonomous-execution-simulation-service";

export interface RuntimeBootstrap {
  commandCenter: AutonomousRuntimeCommandCenterService;

  integrationOrchestrator: CognitionIntegrationOrchestratorService;

  repositoryCognition: RepositoryCognitionService;

  governanceCognition: MutationGovernanceCognitionService;

  memoryCognition: RepositoryEvolutionMemoryService;

  learningCognition: AutonomousEngineeringLearningService;

  unifiedCognition: UnifiedEngineeringCognitionService;
}

export function buildRuntimeBootstrap(): RuntimeBootstrap {
  const repositoryCognition = new RepositoryCognitionService();

  const governanceCognition = new MutationGovernanceCognitionService(
    repositoryCognition,
  );

  const memoryCognition = new RepositoryEvolutionMemoryService();

  const learningCognition = new AutonomousEngineeringLearningService(
    memoryCognition,
  );

  const simulationService = new AutonomousExecutionSimulationService();

  const judgmentCognition = new AutonomousEngineeringJudgmentService(
    simulationService,
  );

  const semanticExecution = new SemanticExecutionOrchestratorService();

  const unifiedCognition = new UnifiedEngineeringCognitionService(
    repositoryCognition,
    governanceCognition,
    judgmentCognition,
    memoryCognition,
    learningCognition,
  );

  const intentCognition = new EngineeringIntentCognitionService(
    unifiedCognition,
  );

  const integrationOrchestrator = new CognitionIntegrationOrchestratorService(
    repositoryCognition,
    governanceCognition,
    memoryCognition,
    learningCognition,
    intentCognition,
    unifiedCognition,
    semanticExecution,
  );

  const repositoryScanner = new RepositoryGraphScannerService();

  const astTransformation = new TypeScriptASTTransformationService();

  const transactionManager = new RepositoryMutationTransactionService();

  const evolutionPipeline = new AutonomousRepositoryEvolutionPipelineService(
    repositoryScanner,
    astTransformation,
    transactionManager,
  );

  const dryRunService = new AutonomousEvolutionDryRunService(
    repositoryScanner,
    astTransformation,
  );
  const telemetry = new RuntimeCognitionTelemetryService(
    integrationOrchestrator,
    memoryCognition,
    learningCognition,
  );

  const commandCenter = new AutonomousRuntimeCommandCenterService(
    repositoryScanner,
    dryRunService,
    evolutionPipeline,
    telemetry,
  );

  return {
    commandCenter,
    integrationOrchestrator,
    repositoryCognition,
    governanceCognition,
    memoryCognition,
    learningCognition,
    unifiedCognition,
  };
}
