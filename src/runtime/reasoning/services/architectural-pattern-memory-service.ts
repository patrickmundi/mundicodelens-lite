export interface ArchitecturalPatternRecord {
  patternId: string;

  name: string;

  description: string;

  category:
    | "ARCHITECTURE"
    | "MODULARITY"
    | "DEPENDENCY_INJECTION"
    | "GOVERNANCE"
    | "REASONING"
    | "OBSERVABILITY";

  usageCount: number;

  successCount: number;

  lastUsedAt?: Date;

  metadata?: Record<string, unknown>;
}

export class ArchitecturalPatternMemoryService {
  private readonly patterns = new Map<string, ArchitecturalPatternRecord>();

  /**
   * Store architectural pattern.
   */
  public rememberPattern(pattern: ArchitecturalPatternRecord): void {
    this.patterns.set(pattern.patternId, pattern);
  }

  /**
   * Retrieve architectural pattern.
   */
  public getPattern(patternId: string): ArchitecturalPatternRecord | undefined {
    return this.patterns.get(patternId);
  }

  /**
   * Retrieve all patterns.
   */
  public getPatterns(): ArchitecturalPatternRecord[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Record successful usage.
   */
  public recordSuccessfulUsage(patternId: string): void {
    const pattern = this.patterns.get(patternId);

    if (!pattern) {
      return;
    }

    pattern.usageCount += 1;

    pattern.successCount += 1;

    pattern.lastUsedAt = new Date();
  }

  /**
   * Record attempted usage.
   */
  public recordUsage(patternId: string): void {
    const pattern = this.patterns.get(patternId);

    if (!pattern) {
      return;
    }

    pattern.usageCount += 1;

    pattern.lastUsedAt = new Date();
  }

  /**
   * Determine pattern success rate.
   */
  public getSuccessRate(patternId: string): number {
    const pattern = this.patterns.get(patternId);

    if (!pattern) {
      return 0;
    }

    if (pattern.usageCount === 0) {
      return 0;
    }

    return pattern.successCount / pattern.usageCount;
  }

  /**
   * Remove pattern from memory.
   */
  public forgetPattern(patternId: string): boolean {
    return this.patterns.delete(patternId);
  }

  /**
   * Total known patterns.
   */
  public getPatternCount(): number {
    return this.patterns.size;
  }
}
