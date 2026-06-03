export interface RepositoryReasoningContext {
  repositoryPath: string;

  objective: string;

  architecturalInsights: string[];

  constraints: string[];

  activeFiles: string[];

  metadata?: Record<string, unknown>;

  updatedAt: Date;
}

export class RepositoryReasoningContextService {
  private context?: RepositoryReasoningContext;

  /**
   * Set active reasoning context.
   */
  public setContext(context: RepositoryReasoningContext): void {
    this.context = {
      ...context,

      updatedAt: new Date(),
    };
  }

  /**
   * Retrieve active reasoning context.
   */
  public getContext(): RepositoryReasoningContext | undefined {
    return this.context;
  }

  /**
   * Determine whether context exists.
   */
  public hasContext(): boolean {
    return this.context !== undefined;
  }

  /**
   * Add architectural insight.
   */
  public addInsight(insight: string): void {
    if (!this.context) {
      return;
    }

    this.context.architecturalInsights.push(insight);

    this.context.updatedAt = new Date();
  }

  /**
   * Add repository constraint.
   */
  public addConstraint(constraint: string): void {
    if (!this.context) {
      return;
    }

    this.context.constraints.push(constraint);

    this.context.updatedAt = new Date();
  }

  /**
   * Track active file.
   */
  public addActiveFile(filePath: string): void {
    if (!this.context) {
      return;
    }

    if (!this.context.activeFiles.includes(filePath)) {
      this.context.activeFiles.push(filePath);
    }

    this.context.updatedAt = new Date();
  }

  /**
   * Clear reasoning context.
   */
  public clearContext(): void {
    this.context = undefined;
  }
}
