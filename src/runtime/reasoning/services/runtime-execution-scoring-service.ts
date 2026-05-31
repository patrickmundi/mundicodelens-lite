export interface RuntimeExecutionMetrics {
  executionTime: number;

  architectureViolations: number;

  rollbackTriggered: boolean;

  success: boolean;

  confidence: number;
}

export interface RuntimeExecutionScore {
  overallScore: number;

  reliabilityScore: number;

  governanceScore: number;

  efficiencyScore: number;

  reasoning: string[];
}

export class RuntimeExecutionScoringService {
  /**
   * Score execution outcome.
   */
  public scoreExecution(
    metrics: RuntimeExecutionMetrics,
  ): RuntimeExecutionScore {
    const reasoning: string[] = [];

    let reliabilityScore = metrics.success ? 100 : 40;

    let governanceScore =
      metrics.architectureViolations === 0
        ? 100
        : Math.max(0, 100 - metrics.architectureViolations * 25);

    let efficiencyScore = Math.max(
      0,
      100 - Math.floor(metrics.executionTime / 100),
    );

    /**
     * Rollback penalty.
     */
    if (metrics.rollbackTriggered) {
      reasoning.push("Rollback execution detected.");

      reliabilityScore -= 25;
    }

    /**
     * Confidence weighting.
     */
    reliabilityScore = Math.floor(reliabilityScore * metrics.confidence);

    /**
     * Governance reasoning.
     */
    if (governanceScore === 100) {
      reasoning.push("Architecture governance maintained.");
    } else {
      reasoning.push("Architecture violations reduced governance score.");
    }

    /**
     * Efficiency reasoning.
     */
    if (efficiencyScore > 80) {
      reasoning.push("Execution efficiency classified as high.");
    }

    if (!metrics.success) {
      reasoning.push("Execution failure impacted runtime score.");
    }

    const overallScore = Math.floor(
      (reliabilityScore + governanceScore + efficiencyScore) / 3,
    );

    return {
      overallScore,

      reliabilityScore,

      governanceScore,

      efficiencyScore,

      reasoning,
    };
  }
}
