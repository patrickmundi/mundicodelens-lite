import { GraphBuilder } from "../builder/graph-builder";

import { SymbolQuery } from "../queries/symbol-query";

import type { RepositoryGraph } from "../models/repository-graph";

import type { SymbolMatch } from "../queries/symbol-query";

export interface RepositorySymbolServiceOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export class RepositorySymbolService {
  private readonly graph: RepositoryGraph;

  private readonly symbolQuery: SymbolQuery;

  constructor(options: RepositorySymbolServiceOptions) {
    const graphBuilder = new GraphBuilder({
      rootPath: options.rootPath,

      tsConfigFilePath: options.tsConfigFilePath,
    });

    this.graph = graphBuilder.build();

    this.symbolQuery = new SymbolQuery(this.graph);
  }

  /**
   * Finds exact symbol matches.
   */
  public findExactSymbol(symbol: string): SymbolMatch[] {
    console.log(`[RepositorySymbolService] Finding exact symbol:\n${symbol}`);

    return this.symbolQuery.findExactSymbol(symbol);
  }

  /**
   * Finds partial symbol matches.
   */
  public findContainingSymbol(symbol: string): SymbolMatch[] {
    console.log(
      `[RepositorySymbolService] Finding containing symbol:\n${symbol}`,
    );

    return this.symbolQuery.findContainingSymbol(symbol);
  }

  /**
   * Finds service nodes.
   */
  public findServices(): SymbolMatch[] {
    console.log("[RepositorySymbolService] Finding services...");

    return this.symbolQuery.findServices();
  }

  /**
   * Finds command nodes.
   */
  public findCommands(): SymbolMatch[] {
    console.log("[RepositorySymbolService] Finding commands...");

    return this.symbolQuery.findCommands();
  }

  /**
   * Finds runtime nodes.
   */
  public findRuntimeNodes(): SymbolMatch[] {
    console.log("[RepositorySymbolService] Finding runtime nodes...");

    return this.symbolQuery.findRuntimeNodes();
  }

  /**
   * Finds TypeScript files.
   */
  public findTypeScriptFiles(): SymbolMatch[] {
    console.log("[RepositorySymbolService] Finding TypeScript files...");

    return this.symbolQuery.findByExtension(".ts");
  }

  /**
   * Finds TSX files.
   */
  public findTSXFiles(): SymbolMatch[] {
    console.log("[RepositorySymbolService] Finding TSX files...");

    return this.symbolQuery.findByExtension(".tsx");
  }
}
