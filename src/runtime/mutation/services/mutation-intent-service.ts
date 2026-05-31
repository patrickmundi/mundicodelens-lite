export type MutationIntentType =
  | "add-logging"
  | "add-telemetry"
  | "add-validation"
  | "add-try-catch"
  | "add-metrics"
  | "add-tracing"
  | "unknown";

export interface MutationIntentAnalysis {
  originalIntent: string;

  normalizedIntent: string;

  type: MutationIntentType;

  confidence: number;

  reasoning: string[];
}

export class MutationIntentService {
  /**
   * Analyzes engineering intent.
   */
  public analyzeIntent(intent: string): MutationIntentAnalysis {
    const normalizedIntent = intent.trim().toLowerCase();

    const reasoning: string[] = [];

    /**
     * Logging intent.
     */
    if (
      normalizedIntent.includes("logging") ||
      normalizedIntent.includes("log")
    ) {
      reasoning.push("Detected logging intent keywords.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-logging",

        confidence: 0.95,

        reasoning,
      };
    }

    /**
     * Telemetry intent.
     */
    if (normalizedIntent.includes("telemetry")) {
      reasoning.push("Detected telemetry intent keyword.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-telemetry",

        confidence: 0.92,

        reasoning,
      };
    }

    /**
     * Validation intent.
     */
    if (
      normalizedIntent.includes("validation") ||
      normalizedIntent.includes("validate")
    ) {
      reasoning.push("Detected validation intent keywords.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-validation",

        confidence: 0.9,

        reasoning,
      };
    }

    /**
     * Try/catch intent.
     */
    if (
      normalizedIntent.includes("try/catch") ||
      normalizedIntent.includes("error handling")
    ) {
      reasoning.push("Detected error-handling intent keywords.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-try-catch",

        confidence: 0.88,

        reasoning,
      };
    }

    /**
     * Metrics intent.
     */
    if (normalizedIntent.includes("metrics")) {
      reasoning.push("Detected metrics intent keyword.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-metrics",

        confidence: 0.9,

        reasoning,
      };
    }

    /**
     * Tracing intent.
     */
    if (
      normalizedIntent.includes("tracing") ||
      normalizedIntent.includes("trace")
    ) {
      reasoning.push("Detected tracing intent keywords.");

      return {
        originalIntent: intent,

        normalizedIntent,

        type: "add-tracing",

        confidence: 0.9,

        reasoning,
      };
    }

    /**
     * Unknown intent fallback.
     */
    reasoning.push("No known engineering intent detected.");

    return {
      originalIntent: intent,

      normalizedIntent,

      type: "unknown",

      confidence: 0.2,

      reasoning,
    };
  }
}
