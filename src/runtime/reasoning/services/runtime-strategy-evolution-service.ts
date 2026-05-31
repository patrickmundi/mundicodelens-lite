import {
  RuntimeMemoryPersistenceService,
  RuntimeMemoryRecord,
} from "./runtime-memory-persistence-service";

export interface RuntimeStrategyProfile {
  strategyId: string;

  confidence: number;

  successRate: number;

  stabilityScore: number;

  usageCount: number;

  lastUpdated: number;
}

export interface RuntimeEvolutionDecision {
  recommendedStrategy: string;

  suppressedStrategies: string[];

  reasoning: string[];

  confidence: number;
}

export class RuntimeStrategyEvolutionService {
  private readonly strategyProfiles: Map<string, RuntimeStrategyProfile> =
    new Map();

  constructor(
    private readonly memoryService: RuntimeMemoryPersistenceService,
  ) {}

  /**
   * Learn from runtime execution history.
   */
  public evolveStrategies(): void {
    const memory = this.memoryService.getMemory();

    for (const record of memory) {
      this.processRecord(record);
    }

    console.log("[StrategyEvolution] Runtime strategy evolution completed.");
  }

  /**
   * Generate evolved execution decision.
   */
  public generateDecision(): RuntimeEvolutionDecision {
    const reasoning: string[] = [];

    const suppressedStrategies: string[] = [];

    let recommendedStrategy = "default-runtime-strategy";

    let highestConfidence = 0;

    for (const profile of this.strategyProfiles.values()) {
      /**
       * Suppress unstable strategies.
       */
      if (profile.stabilityScore < 50) {
        suppressedStrategies.push(profile.strategyId);

        reasoning.push(
          `Strategy '${profile.strategyId}' suppressed due to instability.`,
        );

        continue;
      }

      /**
       * Select strongest strategy.
       */
      if (profile.confidence > highestConfidence) {
        highestConfidence = profile.confidence;

        recommendedStrategy = profile.strategyId;
      }
    }

    reasoning.push(`Recommended strategy: '${recommendedStrategy}'.`);

    return {
      recommendedStrategy,

      suppressedStrategies,

      reasoning,

      confidence: highestConfidence,
    };
  }

  /**
   * Retrieve strategy profiles.
   */
  public getStrategyProfiles(): RuntimeStrategyProfile[] {
    return Array.from(this.strategyProfiles.values());
  }

  /**
   * Process memory record.
   */
  private processRecord(record: RuntimeMemoryRecord): void {
    const strategyId = record.executionType;

    const existing = this.strategyProfiles.get(strategyId);

    /**
     * Create new profile.
     */
    if (!existing) {
      this.strategyProfiles.set(strategyId, {
        strategyId,

        confidence: record.score.overallScore,

        successRate: record.success ? 100 : 40,

        stabilityScore: record.rollbackTriggered ? 50 : 100,

        usageCount: 1,

        lastUpdated: Date.now(),
      });

      return;
    }

    /**
     * Evolve existing profile.
     */
    existing.usageCount += 1;

    existing.lastUpdated = Date.now();

    existing.confidence = Math.floor(
      (existing.confidence + record.score.overallScore) / 2,
    );

    existing.successRate = Math.floor(
      (existing.successRate + (record.success ? 100 : 40)) / 2,
    );

    existing.stabilityScore = Math.floor(
      (existing.stabilityScore + (record.rollbackTriggered ? 50 : 100)) / 2,
    );
  }

  /**
   * Detect unstable strategies.
   */
  public detectUnstableStrategies(): string[] {
    return Array.from(this.strategyProfiles.values())
      .filter((profile) => profile.stabilityScore < 50)
      .map((profile) => profile.strategyId);
  }

  /**
   * Detect high-confidence strategies.
   */
  public detectHighConfidenceStrategies(): string[] {
    return Array.from(this.strategyProfiles.values())
      .filter((profile) => profile.confidence > 85)
      .map((profile) => profile.strategyId);
  }

  /**
   * Clear strategy evolution memory.
   */
  public clearEvolution(): void {
    this.strategyProfiles.clear();

    console.warn("[StrategyEvolution] Strategy evolution memory cleared.");
  }
}
