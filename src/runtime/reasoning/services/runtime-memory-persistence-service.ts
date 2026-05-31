import { RuntimeExecutionScore } from "./runtime-execution-scoring-service";

export interface RuntimeMemoryRecord {
  id: string;

  timestamp: number;

  executionType: string;

  success: boolean;

  score: RuntimeExecutionScore;

  rollbackTriggered: boolean;

  reasoning: string[];
}

export interface RuntimeMemoryStatistics {
  totalExecutions: number;

  successfulExecutions: number;

  failedExecutions: number;

  rollbackCount: number;

  averageScore: number;
}

export class RuntimeMemoryPersistenceService {
  private readonly memory: RuntimeMemoryRecord[] = [];

  /**
   * Persist runtime memory.
   */
  public persistMemory(record: RuntimeMemoryRecord): void {
    this.memory.push(record);

    console.log("[RuntimeMemory] Memory persisted:", record.id);
  }

  /**
   * Retrieve runtime memory.
   */
  public getMemory(): RuntimeMemoryRecord[] {
    return this.memory;
  }

  /**
   * Retrieve latest execution.
   */
  public getLatestExecution(): RuntimeMemoryRecord | undefined {
    return this.memory.at(-1);
  }

  /**
   * Retrieve successful executions.
   */
  public getSuccessfulExecutions(): RuntimeMemoryRecord[] {
    return this.memory.filter((record) => record.success);
  }

  /**
   * Retrieve rollback executions.
   */
  public getRollbackExecutions(): RuntimeMemoryRecord[] {
    return this.memory.filter((record) => record.rollbackTriggered);
  }

  /**
   * Generate runtime statistics.
   */
  public generateStatistics(): RuntimeMemoryStatistics {
    const totalExecutions = this.memory.length;

    const successfulExecutions = this.memory.filter(
      (record) => record.success,
    ).length;

    const failedExecutions = totalExecutions - successfulExecutions;

    const rollbackCount = this.memory.filter(
      (record) => record.rollbackTriggered,
    ).length;

    const totalScore = this.memory.reduce(
      (accumulator, record) => accumulator + record.score.overallScore,

      0,
    );

    const averageScore =
      totalExecutions === 0 ? 0 : Math.floor(totalScore / totalExecutions);

    return {
      totalExecutions,

      successfulExecutions,

      failedExecutions,

      rollbackCount,

      averageScore,
    };
  }

  /**
   * Detect unstable runtime behavior.
   */
  public detectInstability(): boolean {
    const recentFailures = this.memory
      .slice(-5)
      .filter((record) => !record.success).length;

    return recentFailures >= 3;
  }

  /**
   * Detect governance degradation.
   */
  public detectGovernanceRisk(): boolean {
    return this.memory.some((record) => record.score.governanceScore < 50);
  }

  /**
   * Clear runtime memory.
   */
  public clearMemory(): void {
    this.memory.length = 0;

    console.warn("[RuntimeMemory] Runtime memory cleared.");
  }
}
