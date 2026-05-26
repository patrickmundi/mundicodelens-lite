import {
  FunctionQuery,
  FunctionMatch,
} from "../../graph/queries/function-query";

export interface RankedFunctionTarget extends FunctionMatch {
  score: number;

  reason: string;
}

export class FunctionTargetingService {
  private readonly functionQuery: FunctionQuery;

  constructor() {
    this.functionQuery = new FunctionQuery();
  }

  /**
   * Finds best mutation-compatible
   * functions within a file.
   */
  public findBestMutationTargets(filePath: string): RankedFunctionTarget[] {
    const functions =
      this.functionQuery.findMutationCompatibleFunctions(filePath);

    const rankedTargets = functions.map((fn) => ({
      ...fn,

      score: this.calculateScore(fn),

      reason: this.generateReason(fn),
    }));

    return rankedTargets.sort((a, b) => b.score - a.score);
  }

  /**
   * Finds likely bootstrap targets.
   */
  public findBootstrapTargets(filePath: string): RankedFunctionTarget[] {
    return this.functionQuery.findBootstrapFunctions(filePath).map((fn) => ({
      ...fn,

      score: 1,

      reason: "Bootstrap function detected.",
    }));
  }

  /**
   * Finds async mutation targets.
   */
  public findAsyncTargets(filePath: string): RankedFunctionTarget[] {
    return this.functionQuery.findAsyncFunctions(filePath).map((fn) => ({
      ...fn,

      score: 0.95,

      reason: "Async function detected.",
    }));
  }

  /**
   * Calculates mutation compatibility.
   */
  private calculateScore(fn: FunctionMatch): number {
    let score = 0.5;

    if (fn.isAsync) {
      score += 0.2;
    }

    if (fn.functionName.toLowerCase().includes("bootstrap")) {
      score += 0.3;
    }

    if (fn.functionName.toLowerCase().includes("run")) {
      score += 0.15;
    }

    return Math.min(score, 1);
  }

  /**
   * Generates compatibility reason.
   */
  private generateReason(fn: FunctionMatch): string {
    const reasons: string[] = [];

    if (fn.isAsync) {
      reasons.push("async");
    }

    if (fn.functionName.toLowerCase().includes("bootstrap")) {
      reasons.push("bootstrap");
    }

    if (fn.functionName.toLowerCase().includes("run")) {
      reasons.push("runtime-entry");
    }

    if (reasons.length === 0) {
      reasons.push("generic-compatible");
    }

    return reasons.join(", ");
  }
}
