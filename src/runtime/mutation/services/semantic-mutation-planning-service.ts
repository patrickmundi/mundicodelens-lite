import {
  CrossFileSemanticAnalysisService,
  RepositorySemanticTopology,
} from "./cross-file-semantic-analysis-service";

export interface SemanticMutationTarget {
  filePath: string;

  symbolName: string;

  mutationObjective: string;

  estimatedImpact: number;
}

export interface SemanticMutationExecutionStep {
  stepId: string;

  filePath: string;

  symbolName: string;

  executionPriority: number;

  requiresRollbackProtection: boolean;

  dependencies: string[];

  reasoning: string[];
}

export interface SemanticMutationPlan {
  planId: string;

  generatedAt: number;

  executionSteps: SemanticMutationExecutionStep[];

  rollbackCandidates: string[];

  predictedRisks: string[];

  semanticTopologySummary: string[];
}

export class SemanticMutationPlanningService {
  constructor(
    private readonly semanticAnalysisService: CrossFileSemanticAnalysisService,
  ) {}

  /**
   * Generate semantic mutation plan.
   */
  public generateSemanticPlan(
    targets: SemanticMutationTarget[],

    topology: RepositorySemanticTopology,
  ): SemanticMutationPlan {
    const executionSteps: SemanticMutationExecutionStep[] = [];

    const rollbackCandidates: string[] = [];

    const predictedRisks: string[] = [];

    const semanticTopologySummary: string[] = [];

    /**
     * Build execution steps.
     */
    for (const target of targets) {
      const dependencies = topology.dependencyGraph[target.filePath] ?? [];

      const reasoning: string[] = [];

      reasoning.push(`Mutation objective: ${target.mutationObjective}`);

      reasoning.push(`Detected ${dependencies.length} dependencies.`);

      /**
       * Risk prediction.
       */
      if (target.estimatedImpact > 70) {
        predictedRisks.push(
          `High semantic impact predicted for '${target.symbolName}'.`,
        );

        rollbackCandidates.push(target.filePath);

        reasoning.push("Rollback protection required due to high impact.");
      }

      /**
       * Circular dependency detection.
       */
      const circularDependencies =
        this.semanticAnalysisService.detectCircularDependencies(topology);

      if (circularDependencies.length > 0) {
        predictedRisks.push(
          `Circular dependencies detected for '${target.filePath}'.`,
        );

        reasoning.push(
          "Execution priority reduced due to circular dependency risk.",
        );
      }

      /**
       * Build execution step.
       */
      executionSteps.push({
        stepId: `semantic-step-${Date.now()}-${Math.random()}`,

        filePath: target.filePath,

        symbolName: target.symbolName,

        executionPriority: this.calculateExecutionPriority(
          target,
          dependencies.length,
        ),

        requiresRollbackProtection: target.estimatedImpact > 70,

        dependencies,

        reasoning,
      });
    }

    /**
     * Sort by execution priority.
     */
    executionSteps.sort((a, b) => b.executionPriority - a.executionPriority);

    /**
     * Build semantic topology summary.
     */
    semanticTopologySummary.push(
      `Total repository files: ${topology.totalFiles}`,
    );

    semanticTopologySummary.push(
      `Total semantic relationships: ${topology.totalRelationships}`,
    );

    semanticTopologySummary.push(
      `Detected symbols: ${topology.symbols.length}`,
    );

    return {
      planId: `semantic-plan-${Date.now()}`,

      generatedAt: Date.now(),

      executionSteps,

      rollbackCandidates,

      predictedRisks,

      semanticTopologySummary,
    };
  }

  /**
   * Calculate execution priority.
   */
  private calculateExecutionPriority(
    target: SemanticMutationTarget,

    dependencyCount: number,
  ): number {
    let score = 100;

    /**
     * Higher impact lowers priority.
     */
    score -= target.estimatedImpact * 0.4;

    /**
     * Heavy dependencies lower priority.
     */
    score -= dependencyCount * 5;

    /**
     * Normalize.
     */
    return Math.max(1, Math.floor(score));
  }

  /**
   * Detect dangerous semantic mutations.
   */
  public detectDangerousMutations(
    plan: SemanticMutationPlan,
  ): SemanticMutationExecutionStep[] {
    return plan.executionSteps.filter(
      (step) => step.requiresRollbackProtection,
    );
  }

  /**
   * Generate semantic planning report.
   */
  public generatePlanningReport(plan: SemanticMutationPlan): string {
    return [
      "=== Semantic Mutation Planning Report ===",

      "",

      `Plan ID: ${plan.planId}`,

      `Generated At: ${new Date(plan.generatedAt).toISOString()}`,

      "",

      "Execution Steps:",

      ...plan.executionSteps.map(
        (step) => `- ${step.symbolName} (${step.executionPriority})`,
      ),

      "",

      "Rollback Candidates:",

      ...plan.rollbackCandidates.map((candidate) => `- ${candidate}`),

      "",

      "Predicted Risks:",

      ...plan.predictedRisks.map((risk) => `- ${risk}`),

      "",

      "Topology Summary:",

      ...plan.semanticTopologySummary.map((summary) => `- ${summary}`),
    ].join("\n");
  }
}
