import { CognitionIntegrationOrchestratorService } from "../../integration/services/cognition-integration-orchestrator-service";

import { RepositoryEvolutionMemoryService } from "../../memory/services/repository-evolution-memory-service";

import { AutonomousEngineeringLearningService } from "../../learning/services/autonomous-engineering-learning-service";

export interface RuntimeTelemetrySnapshot {
  snapshotId: string;

  capturedAt: number;

  globalSystemStability: number;

  cognitionSynchronizationScore: number;

  repositoryMemoryHealth: number;

  adaptiveLearningHealth: number;

  executionConfidenceScore: number;

  rollbackRiskLevel: number;

  activeCognitionDomains: string[];

  diagnostics: string[];
}

export interface RuntimeTelemetryAlert {
  alertId: string;

  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  category:
    | "COGNITION_STABILITY"
    | "ROLLBACK_RISK"
    | "MEMORY_HEALTH"
    | "LEARNING_DEGRADATION"
    | "EXECUTION_CONFIDENCE";

  message: string;

  recommendedActions: string[];

  generatedAt: number;
}

export interface RuntimeTelemetryState {
  totalSnapshots: number;

  activeAlerts: number;

  telemetryHistory: RuntimeTelemetrySnapshot[];

  alerts: RuntimeTelemetryAlert[];
}

export class RuntimeCognitionTelemetryService {
  private readonly telemetryState: RuntimeTelemetryState = {
    totalSnapshots: 0,

    activeAlerts: 0,

    telemetryHistory: [],

    alerts: [],
  };

  constructor(
    private readonly integrationOrchestrator: CognitionIntegrationOrchestratorService,

    private readonly memoryService: RepositoryEvolutionMemoryService,

    private readonly learningService: AutonomousEngineeringLearningService,
  ) {}

  /**
   * Capture runtime telemetry snapshot.
   */
  public captureTelemetry(): RuntimeTelemetrySnapshot {
    const diagnostics: string[] = [];

    diagnostics.push("Capturing runtime cognition telemetry.");

    /**
     * Integration telemetry.
     */
    const integrationState =
      this.integrationOrchestrator.synchronizeIntegrations();

    diagnostics.push(
      `Integration stability score: ${integrationState.globalSystemStability}`,
    );

    /**
     * Memory telemetry.
     */
    const memoryState = this.memoryService.getMemoryState();

    const repositoryMemoryHealth = Math.min(100, memoryState.totalMemories * 5);

    diagnostics.push(
      `Repository memory health estimated at ${repositoryMemoryHealth}.`,
    );

    /**
     * Learning telemetry.
     */
    const learningState = this.learningService.getLearningState();

    const adaptiveLearningHealth = Math.min(
      100,
      learningState.learningCyclesCompleted * 10,
    );

    diagnostics.push(
      `Adaptive learning health estimated at ${adaptiveLearningHealth}.`,
    );

    /**
     * Execution confidence.
     */
    const executionConfidenceScore = Math.floor(
      (integrationState.globalSystemStability +
        repositoryMemoryHealth +
        adaptiveLearningHealth) /
        3,
    );

    diagnostics.push(
      `Execution confidence score estimated at ${executionConfidenceScore}.`,
    );

    /**
     * Rollback risk analysis.
     */
    const rollbackRiskLevel = Math.max(0, 100 - executionConfidenceScore);

    diagnostics.push(`Rollback risk level estimated at ${rollbackRiskLevel}.`);

    /**
     * Build telemetry snapshot.
     */
    const snapshot: RuntimeTelemetrySnapshot = {
      snapshotId: `telemetry-${Date.now()}`,

      capturedAt: Date.now(),

      globalSystemStability: integrationState.globalSystemStability,

      cognitionSynchronizationScore: integrationState.globalSystemStability,

      repositoryMemoryHealth,

      adaptiveLearningHealth,

      executionConfidenceScore,

      rollbackRiskLevel,

      activeCognitionDomains: integrationState.activeIntegrations,

      diagnostics,
    };

    this.telemetryState.telemetryHistory.push(snapshot);

    this.telemetryState.totalSnapshots += 1;

    /**
     * Alert generation.
     */
    this.generateAlerts(snapshot);

    return snapshot;
  }

  /**
   * Generate telemetry alerts.
   */
  private generateAlerts(snapshot: RuntimeTelemetrySnapshot): void {
    /**
     * Stability alert.
     */
    if (snapshot.globalSystemStability < 50) {
      this.registerAlert({
        alertId: `stability-alert-${Date.now()}`,

        severity: "HIGH",

        category: "COGNITION_STABILITY",

        message: "Global cognition stability degraded.",

        recommendedActions: [
          "Trigger cognition resynchronization.",

          "Reduce semantic mutation concurrency.",

          "Increase rollback checkpoint frequency.",
        ],

        generatedAt: Date.now(),
      });
    }

    /**
     * Rollback risk alert.
     */
    if (snapshot.rollbackRiskLevel > 60) {
      this.registerAlert({
        alertId: `rollback-alert-${Date.now()}`,

        severity: "CRITICAL",

        category: "ROLLBACK_RISK",

        message: "Rollback risk threshold exceeded.",

        recommendedActions: [
          "Enable strict governance enforcement.",

          "Reduce semantic propagation depth.",

          "Pause high-risk autonomous execution.",
        ],

        generatedAt: Date.now(),
      });
    }

    /**
     * Learning degradation alert.
     */
    if (snapshot.adaptiveLearningHealth < 30) {
      this.registerAlert({
        alertId: `learning-alert-${Date.now()}`,

        severity: "MEDIUM",

        category: "LEARNING_DEGRADATION",

        message: "Adaptive learning efficiency degraded.",

        recommendedActions: [
          "Increase repository memory analysis.",

          "Trigger additional learning cycles.",

          "Strengthen execution outcome analysis.",
        ],

        generatedAt: Date.now(),
      });
    }
  }

  /**
   * Register telemetry alert.
   */
  private registerAlert(alert: RuntimeTelemetryAlert): void {
    this.telemetryState.alerts.push(alert);

    this.telemetryState.activeAlerts = this.telemetryState.alerts.length;
  }

  /**
   * Retrieve telemetry history.
   */
  public getTelemetryHistory(): RuntimeTelemetrySnapshot[] {
    return this.telemetryState.telemetryHistory;
  }

  /**
   * Retrieve active alerts.
   */
  public getAlerts(): RuntimeTelemetryAlert[] {
    return this.telemetryState.alerts;
  }

  /**
   * Generate runtime telemetry report.
   */
  public generateTelemetryReport(snapshot: RuntimeTelemetrySnapshot): string {
    return [
      "=== Runtime Cognition Telemetry Report ===",

      "",

      `Snapshot ID: ${snapshot.snapshotId}`,

      `Global Stability: ${snapshot.globalSystemStability}`,

      `Execution Confidence: ${snapshot.executionConfidenceScore}`,

      `Rollback Risk: ${snapshot.rollbackRiskLevel}`,

      "",

      "Cognition Domains:",

      ...snapshot.activeCognitionDomains.map((domain) => `- ${domain}`),

      "",

      "Diagnostics:",

      ...snapshot.diagnostics.map((diagnostic) => `- ${diagnostic}`),

      "",

      "Active Alerts:",

      ...this.telemetryState.alerts.map(
        (alert) => `- [${alert.severity}] ${alert.message}`,
      ),
    ].join("\n");
  }
}
