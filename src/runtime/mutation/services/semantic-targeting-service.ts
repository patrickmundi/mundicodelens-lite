import path from "path";

import { RepositorySymbolService } from "../../graph/services/repository-symbol-service";

export interface SemanticTarget {
  filePath: string;

  confidence: number;

  reason: string;
}

export interface SemanticTargetingServiceOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export class SemanticTargetingService {
  private readonly repositorySymbolService: RepositorySymbolService;

  private readonly rootPath: string;

  constructor(options: SemanticTargetingServiceOptions) {
    this.rootPath = options.rootPath;

    this.repositorySymbolService = new RepositorySymbolService({
      rootPath: options.rootPath,

      tsConfigFilePath: options.tsConfigFilePath,
    });
  }

  /**
   * Finds likely service targets.
   */
  public findServiceTargets(): SemanticTarget[] {
    const matches = this.repositorySymbolService.findServices();

    return matches.map((match) => ({
      filePath: this.resolveNodePath(match.nodeId),

      confidence: 0.9,

      reason: "Matched service pattern.",
    }));
  }

  /**
   * Finds likely command targets.
   */
  public findCommandTargets(): SemanticTarget[] {
    const matches = this.repositorySymbolService.findCommands();

    return matches.map((match) => ({
      filePath: this.resolveNodePath(match.nodeId),

      confidence: 0.85,

      reason: "Matched command pattern.",
    }));
  }

  /**
   * Finds runtime targets.
   */
  public findRuntimeTargets(): SemanticTarget[] {
    const matches = this.repositorySymbolService.findRuntimeNodes();

    return matches.map((match) => ({
      filePath: this.resolveNodePath(match.nodeId),

      confidence: 0.8,

      reason: "Matched runtime pattern.",
    }));
  }

  /**
   * Finds targets by symbol.
   */
  public findTargetsBySymbol(symbol: string): SemanticTarget[] {
    const matches = this.repositorySymbolService.findContainingSymbol(symbol);

    return matches.map((match) => ({
      filePath: this.resolveNodePath(match.nodeId),

      confidence: 0.95,

      reason: `Matched symbol: ${symbol}`,
    }));
  }

  /**
   * Resolves graph node id
   * into repository path.
   */
  private resolveNodePath(nodeId: string): string {
    return path.resolve(this.rootPath, nodeId);
  }
}
