import {
  AutonomousExecutionService,
  AutonomousExecutionResult,
} from "./autonomous-execution-service";

import {
  RuntimeExecutionScoringService,
  RuntimeExecutionScore,
} from "../../reasoning/services/runtime-execution-scoring-service";

export interface AdaptiveExecutionMetrics {
  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  lastFailureReason?: string;
}

export interface AdaptiveExecutionStrategy {
  retryOnFailure: boolean;

  maxRetries: number;

  enableRollbackRecovery: boolean;

  adaptiveThrottling: boolean;
}

export interface AdaptiveExecutionHistory {
  scores: RuntimeExecutionScore[];

  averageScore: number;

  lastScore?: RuntimeExecutionScore;
}

export class AdaptiveExecutionService {
  private readonly metrics: AdaptiveExecutionMetrics = {
    totalExecutions: 0,

    successfulExecutions: 0,

    failedExecutions: 0,
  };

  private readonly strategy: AdaptiveExecutionStrategy = {
    retryOnFailure: true,

    maxRetries: 3,

    enableRollbackRecovery: true,

    adaptiveThrottling: true,
  };

  private readonly history: AdaptiveExecutionHistory = {
    scores: [],

    averageScore: 0,
  };

  constructor(
    private readonly executionService: AutonomousExecutionService,

    private readonly scoringService: RuntimeExecutionScoringService,
  ) {}

  /**
   * Execute adaptive runtime flow.
   */
  public async executeAdaptiveFlow(): Promise<AutonomousExecutionResult> {
    console.log("[AdaptiveExecution] Starting adaptive execution flow.");

    let attempts = 0;

    while (attempts < this.strategy.maxRetries) {
      attempts += 1;

      this.metrics.totalExecutions += 1;

      console.log(`[AdaptiveExecution] Attempt ${attempts}`);

      const result = await this.executionService.execute();

      /**
       * Successful execution.
       */
      if (result.success) {
        this.metrics.successfulExecutions += 1;

        console.log("[AdaptiveExecution] Execution succeeded.");

        const score = this.scoringService.scoreExecution({
          executionTime: attempts * 100,

          architectureViolations: 0,

          rollbackTriggered: false,

          success: true,

          confidence: 0.95,
        });

        this.recordScore(score);

        console.log("[AdaptiveExecution] Runtime score:", score.overallScore);

        return result;
      }

      /**
       * Failed execution.
       */
      this.metrics.failedExecutions += 1;

      this.metrics.lastFailureReason = result.error;

      console.warn("[AdaptiveExecution] Execution failed.");

      const failureScore = this.scoringService.scoreExecution({
        executionTime: attempts * 100,

        architectureViolations: 0,

        rollbackTriggered: true,

        success: false,

        confidence: 0.4,
      });

      this.recordScore(failureScore);

      /**
       * Runtime self-optimization.
       */
      this.optimizeStrategy();

      if (!this.strategy.retryOnFailure) {
        return result;
      }

      /**
       * Adaptive throttling.
       */
      if (this.strategy.adaptiveThrottling) {
        await this.delay(attempts * 1000);
      }
    }

    return {
      success: false,

      executedPhases: [],

      error: "Adaptive execution retries exhausted.",
    };
  }

  /**
   * Get adaptive metrics.
   */
  public getMetrics(): AdaptiveExecutionMetrics {
    return this.metrics;
  }

  /**
   * Update execution strategy.
   */
  public updateStrategy(strategy: Partial<AdaptiveExecutionStrategy>): void {
    Object.assign(this.strategy, strategy);
  }

  /**
   * Record runtime execution score.
   */
  private recordScore(score: RuntimeExecutionScore): void {
    this.history.scores.push(score);

    this.history.lastScore = score;

    const total = this.history.scores.reduce(
      (accumulator, current) => accumulator + current.overallScore,

      0,
    );

    this.history.averageScore = Math.floor(total / this.history.scores.length);
  }

  /**
   * Self-optimization cognition.
   */
  private optimizeStrategy(): void {
    if (this.history.averageScore < 60) {
      console.warn("[AdaptiveExecution] Runtime instability detected.");

      this.strategy.maxRetries = Math.max(1, this.strategy.maxRetries - 1);

      this.strategy.adaptiveThrottling = true;
    }

    if (this.history.averageScore > 90) {
      console.log("[AdaptiveExecution] Runtime stability classified as high.");

      this.strategy.maxRetries = Math.min(5, this.strategy.maxRetries + 1);
    }
  }

  /**
   * Get adaptive history.
   */
  public getHistory(): AdaptiveExecutionHistory {
    return this.history;
  }

  /**
   * Delay helper.
   */
  private async delay(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
