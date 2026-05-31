export interface EngineeringMemoryRecord {
  id: string;

  timestamp: Date;

  intent: string;

  targetFile: string;

  targetFunction?: string;

  success: boolean;

  safe: boolean;

  riskLevel: string;

  rollbackTriggered: boolean;

  reasoning: string[];

  warnings: string[];
}

export interface EngineeringMemoryStatistics {
  totalMutations: number;

  successfulMutations: number;

  failedMutations: number;

  rollbackCount: number;

  criticalRiskCount: number;
}

export class EngineeringMemoryService {
  private readonly memoryRecords: EngineeringMemoryRecord[] = [];

  /**
   * Stores engineering execution memory.
   */
  public remember(record: EngineeringMemoryRecord): void {
    this.memoryRecords.push(record);
  }

  /**
   * Returns all engineering memories.
   */
  public getMemories(): EngineeringMemoryRecord[] {
    return [...this.memoryRecords];
  }

  /**
   * Returns memories for a target file.
   */
  public getMemoriesForFile(filePath: string): EngineeringMemoryRecord[] {
    return this.memoryRecords.filter(
      (record) => record.targetFile === filePath,
    );
  }

  /**
   * Returns memories for an intent.
   */
  public getMemoriesForIntent(intent: string): EngineeringMemoryRecord[] {
    return this.memoryRecords.filter((record) => record.intent === intent);
  }

  /**
   * Generates engineering statistics.
   */
  public generateStatistics(): EngineeringMemoryStatistics {
    const successfulMutations = this.memoryRecords.filter(
      (record) => record.success,
    ).length;

    const failedMutations = this.memoryRecords.filter(
      (record) => !record.success,
    ).length;

    const rollbackCount = this.memoryRecords.filter(
      (record) => record.rollbackTriggered,
    ).length;

    const criticalRiskCount = this.memoryRecords.filter(
      (record) => record.riskLevel === "critical",
    ).length;

    return {
      totalMutations: this.memoryRecords.length,

      successfulMutations,

      failedMutations,

      rollbackCount,

      criticalRiskCount,
    };
  }

  /**
   * Detects dangerous engineering patterns.
   */
  public detectRiskPatterns(): string[] {
    const warnings: string[] = [];

    const criticalRiskCount = this.memoryRecords.filter(
      (record) => record.riskLevel === "critical",
    ).length;

    if (criticalRiskCount >= 3) {
      warnings.push("Repeated critical-risk mutations detected.");
    }

    const rollbackCount = this.memoryRecords.filter(
      (record) => record.rollbackTriggered,
    ).length;

    if (rollbackCount >= 3) {
      warnings.push("Frequent rollback activity detected.");
    }

    return warnings;
  }
}
