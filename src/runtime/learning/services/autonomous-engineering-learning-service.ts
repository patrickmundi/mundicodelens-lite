import {
  RepositoryEvolutionMemoryService,
  RepositoryEvolutionMemoryRecord,
} from "../../memory/services/repository-evolution-memory-service";

export interface EngineeringLearningInsight {
  insightId: string;

  insightType:
    | "FAILURE_AVOIDANCE"
    | "SUCCESS_REINFORCEMENT"
    | "ROLLBACK_OPTIMIZATION"
    | "RISK_REDUCTION"
    | "EXECUTION_OPTIMIZATION";

  confidenceScore: number;

  description: string;

  recommendedActions: string[];

  affectedRegions: string[];
}

export interface AdaptiveEngineeringStrategy {
  strategyId: string;

  generatedAt: number;

  optimizationTargets: string[];

  riskAdjustments: string[];

  executionRefinements: string[];

  rollbackRecommendations: string[];

  confidenceAdjustments: string[];
}

export interface AutonomousLearningState {
  totalInsightsGenerated: number;

  totalStrategiesGenerated: number;

  learningCyclesCompleted: number;

  learnedInsights: EngineeringLearningInsight[];

  adaptiveStrategies: AdaptiveEngineeringStrategy[];
}

export class AutonomousEngineeringLearningService {
  private readonly learningState: AutonomousLearningState = {
    totalInsightsGenerated: 0,

    totalStrategiesGenerated: 0,

    learningCyclesCompleted: 0,

    learnedInsights: [],

    adaptiveStrategies: [],
  };

  constructor(
    private readonly memoryService: RepositoryEvolutionMemoryService,
  ) {}

  /**
   * Execute autonomous learning cycle.
   */
  public executeLearningCycle(): AdaptiveEngineeringStrategy {
    const history = this.memoryService.getEvolutionHistory();

    const insights = this.generateInsights(history);

    const strategy = this.buildAdaptiveStrategy(insights);

    this.learningState.learnedInsights.push(...insights);

    this.learningState.adaptiveStrategies.push(strategy);

    this.learningState.totalInsightsGenerated += insights.length;

    this.learningState.totalStrategiesGenerated += 1;

    this.learningState.learningCyclesCompleted += 1;

    return strategy;
  }

  /**
   * Generate engineering learning insights.
   */
  private generateInsights(
    history: RepositoryEvolutionMemoryRecord[],
  ): EngineeringLearningInsight[] {
    const insights: EngineeringLearningInsight[] = [];

    for (const memory of history) {
      /**
       * Failure learning.
       */
      if (memory.executionOutcome === "FAILED") {
        insights.push({
          insightId: `failure-insight-${Date.now()}`,

          insightType: "FAILURE_AVOIDANCE",

          confidenceScore: 85,

          description: `Repeated failure patterns detected in '${memory.repositoryRegion}'.`,

          recommendedActions: [
            "Increase rollback protection.",

            "Reduce semantic execution priority.",

            "Require governance escalation.",
          ],

          affectedRegions: [memory.repositoryRegion],
        });
      }

      /**
       * Success reinforcement.
       */
      if (memory.executionOutcome === "SUCCESS") {
        insights.push({
          insightId: `success-insight-${Date.now()}`,

          insightType: "SUCCESS_REINFORCEMENT",

          confidenceScore: 92,

          description: `Stable execution behavior detected in '${memory.repositoryRegion}'.`,

          recommendedActions: [
            "Increase execution confidence.",

            "Prioritize similar semantic execution paths.",
          ],

          affectedRegions: [memory.repositoryRegion],
        });
      }

      /**
       * Rollback optimization.
       */
      if (memory.rollbackTriggered) {
        insights.push({
          insightId: `rollback-insight-${Date.now()}`,

          insightType: "ROLLBACK_OPTIMIZATION",

          confidenceScore: 88,

          description: `Rollback-sensitive mutations detected in '${memory.repositoryRegion}'.`,

          recommendedActions: [
            "Strengthen rollback checkpointing.",

            "Reduce mutation propagation depth.",
          ],

          affectedRegions: [memory.repositoryRegion],
        });
      }
    }

    return insights;
  }

  /**
   * Build adaptive engineering strategy.
   */
  private buildAdaptiveStrategy(
    insights: EngineeringLearningInsight[],
  ): AdaptiveEngineeringStrategy {
    const optimizationTargets: string[] = [];

    const riskAdjustments: string[] = [];

    const executionRefinements: string[] = [];

    const rollbackRecommendations: string[] = [];

    const confidenceAdjustments: string[] = [];

    for (const insight of insights) {
      switch (insight.insightType) {
        case "FAILURE_AVOIDANCE":
          riskAdjustments.push(insight.description);

          rollbackRecommendations.push(...insight.recommendedActions);

          break;

        case "SUCCESS_REINFORCEMENT":
          executionRefinements.push(insight.description);

          confidenceAdjustments.push(...insight.recommendedActions);

          break;

        case "ROLLBACK_OPTIMIZATION":
          rollbackRecommendations.push(insight.description);

          break;

        case "RISK_REDUCTION":
          riskAdjustments.push(insight.description);

          break;

        case "EXECUTION_OPTIMIZATION":
          optimizationTargets.push(insight.description);

          break;
      }
    }

    return {
      strategyId: `adaptive-strategy-${Date.now()}`,

      generatedAt: Date.now(),

      optimizationTargets,

      riskAdjustments,

      executionRefinements,

      rollbackRecommendations,

      confidenceAdjustments,
    };
  }

  /**
   * Retrieve learning state.
   */
  public getLearningState(): AutonomousLearningState {
    return this.learningState;
  }

  /**
   * Generate autonomous learning report.
   */
  public generateLearningReport(): string {
    return [
      "=== Autonomous Engineering Learning Report ===",

      "",

      `Learning Cycles Completed: ${this.learningState.learningCyclesCompleted}`,

      `Insights Generated: ${this.learningState.totalInsightsGenerated}`,

      `Strategies Generated: ${this.learningState.totalStrategiesGenerated}`,

      "",

      "Learned Insights:",

      ...this.learningState.learnedInsights.map(
        (insight) => `- ${insight.insightType}: ${insight.description}`,
      ),

      "",

      "Adaptive Strategies:",

      ...this.learningState.adaptiveStrategies.map(
        (strategy) => `- ${strategy.strategyId}`,
      ),
    ].join("\n");
  }
}
