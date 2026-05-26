import type { RepositoryGraph } from "../models/repository-graph";

export interface SymbolMatch {
  nodeId: string;

  matchedText: string;
}

export class SymbolQuery {
  constructor(private readonly graph: RepositoryGraph) {}

  /**
   * Finds nodes matching exact symbol.
   */
  public findExactSymbol(symbol: string): SymbolMatch[] {
    const matches: SymbolMatch[] = [];

    for (const node of this.graph.nodes.values()) {
      if (node.id === symbol) {
        matches.push({
          nodeId: node.id,

          matchedText: symbol,
        });
      }
    }

    return matches;
  }

  /**
   * Finds nodes containing symbol.
   */
  public findContainingSymbol(symbol: string): SymbolMatch[] {
    const matches: SymbolMatch[] = [];

    const normalizedSearch = symbol.toLowerCase();

    for (const node of this.graph.nodes.values()) {
      const normalizedNodeId = node.id.toLowerCase();

      if (normalizedNodeId.includes(normalizedSearch)) {
        matches.push({
          nodeId: node.id,

          matchedText: symbol,
        });
      }
    }

    return matches;
  }

  /**
   * Finds nodes matching regex.
   */
  public findMatchingPattern(pattern: RegExp): SymbolMatch[] {
    const matches: SymbolMatch[] = [];

    for (const node of this.graph.nodes.values()) {
      if (pattern.test(node.id)) {
        matches.push({
          nodeId: node.id,

          matchedText: node.id,
        });
      }
    }

    return matches;
  }

  /**
   * Finds all nodes by extension.
   */
  public findByExtension(extension: string): SymbolMatch[] {
    const matches: SymbolMatch[] = [];

    for (const node of this.graph.nodes.values()) {
      if (node.id.endsWith(extension)) {
        matches.push({
          nodeId: node.id,

          matchedText: extension,
        });
      }
    }

    return matches;
  }

  /**
   * Finds likely service files.
   */
  public findServices(): SymbolMatch[] {
    return this.findMatchingPattern(/service/i);
  }

  /**
   * Finds likely command files.
   */
  public findCommands(): SymbolMatch[] {
    return this.findMatchingPattern(/command/i);
  }

  /**
   * Finds likely runtime files.
   */
  public findRuntimeNodes(): SymbolMatch[] {
    return this.findMatchingPattern(/runtime/i);
  }
}
