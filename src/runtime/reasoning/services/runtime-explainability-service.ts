export interface RuntimeExplanation {
  summary: string;

  confidence: number;

  reasoning: string[];

  governanceJustification: string[];

  optimizationNotes: string[];

  rollbackExplanation?: string;
}

export interface RuntimeExplainabilityInput {
  executionType: string;

  success: boolean;

  confidence: number;

  architectureViolations: number;

  rollbackTriggered: boolean;

  optimizationApplied: boolean;

  reasoning: string[];
}

export class RuntimeExplainabilityService {
  /**
   * Generate explainable runtime reasoning.
   */
  public generateExplanation(
    input: RuntimeExplainabilityInput,
  ): RuntimeExplanation {
    const governanceJustification: string[] = [];

    const optimizationNotes: string[] = [];

    /**
     * Governance reasoning.
     */
    if (input.architectureViolations === 0) {
      governanceJustification.push(
        "Architecture governance remained compliant.",
      );
    } else {
      governanceJustification.push(
        "Architecture violations impacted runtime governance confidence.",
      );
    }

    /**
     * Optimization reasoning.
     */
    if (input.optimizationApplied) {
      optimizationNotes.push(
        "Adaptive optimization logic modified runtime execution behavior.",
      );
    }

    /**
     * Rollback reasoning.
     */
    let rollbackExplanation: string | undefined;

    if (input.rollbackTriggered) {
      rollbackExplanation =
        "Rollback protection activated due to execution instability.";
    }

    /**
     * Summary generation.
     */
    const summary = input.success
      ? `Execution '${input.executionType}' completed successfully.`
      : `Execution '${input.executionType}' failed during runtime orchestration.`;

    return {
      summary,

      confidence: input.confidence,

      reasoning: input.reasoning,

      governanceJustification,

      optimizationNotes,

      rollbackExplanation,
    };
  }

  /**
   * Generate confidence classification.
   */
  public classifyConfidence(confidence: number): string {
    if (confidence >= 0.9) {
      return "HIGH";
    }

    if (confidence >= 0.7) {
      return "MODERATE";
    }

    if (confidence >= 0.5) {
      return "LOW";
    }

    return "CRITICAL";
  }

  /**
   * Generate explainability report.
   */
  public generateExplainabilityReport(explanation: RuntimeExplanation): string {
    return [
      "=== Runtime Explainability Report ===",

      `Summary: ${explanation.summary}`,

      `Confidence: ${explanation.confidence}`,

      "",

      "Reasoning:",

      ...explanation.reasoning.map((reason) => `- ${reason}`),

      "",

      "Governance:",

      ...explanation.governanceJustification.map((item) => `- ${item}`),

      "",

      "Optimization:",

      ...explanation.optimizationNotes.map((item) => `- ${item}`),

      "",

      explanation.rollbackExplanation
        ? `Rollback: ${explanation.rollbackExplanation}`
        : "Rollback: Not triggered.",
    ].join("\n");
  }
}
