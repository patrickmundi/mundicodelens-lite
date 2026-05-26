import { GraphSyncService } from "./graph-sync-service";

export interface RepositoryWatchServiceOptions {
  rootPath: string;

  storagePath: string;

  tsConfigFilePath?: string;
}

export class RepositoryWatchService {
  private readonly graphSyncService: GraphSyncService;

  private watcher: any = null;

  constructor(options: RepositoryWatchServiceOptions) {
    this.graphSyncService = new GraphSyncService({
      rootPath: options.rootPath,

      storagePath: options.storagePath,

      tsConfigFilePath: options.tsConfigFilePath,
    });
  }

  /**
   * Starts repository watching
   * and keeps graph synchronized.
   */
  public async start(
    onChange?: (changedFilePath: string) => Promise<void> | void,
  ): Promise<void> {
    if (this.watcher) {
      console.warn("[RepositoryWatchService] Watcher already running.");

      return;
    }

    const chokidarModule = await import("chokidar");

    const chokidar = chokidarModule.default || chokidarModule;

    this.watcher = chokidar.watch(this.getWatchPatterns(), {
      ignored: [...this.getIgnoredPatterns(), /(^|[\/\\])\../],

      persistent: true,

      ignoreInitial: true,

      awaitWriteFinish: {
        stabilityThreshold: 200,

        pollInterval: 100,
      },
    });

    this.watcher
      .on("add", async (filePath: string) => {
        console.log(`[RepositoryWatchService] File added: ${filePath}`);

        this.synchronizeGraph();

        await onChange?.(filePath);
      })

      .on("change", async (filePath: string) => {
        console.log(`[RepositoryWatchService] File changed: ${filePath}`);

        this.synchronizeGraph();

        await onChange?.(filePath);
      })

      .on("unlink", async (filePath: string) => {
        console.log(`[RepositoryWatchService] File removed: ${filePath}`);

        this.synchronizeGraph();

        await onChange?.(filePath);
      })

      .on("error", (error: unknown) => {
        console.error("[RepositoryWatchService] Watcher error:", error);
      });

    console.log("[RepositoryWatchService] Repository watcher started.");

    this.synchronizeGraph();
  }

  /**
   * Stops repository watcher.
   */
  public async stop(): Promise<void> {
    if (!this.watcher) {
      return;
    }

    await this.watcher.close();

    this.watcher = null;

    console.log("[RepositoryWatchService] Repository watcher stopped.");
  }

  /**
   * Returns active graph sync service.
   */
  public getGraphSyncService(): GraphSyncService {
    return this.graphSyncService;
  }

  /**
   * Synchronizes graph state.
   */
  private synchronizeGraph(): void {
    try {
      const graph = this.graphSyncService.synchronize();

      console.log(
        `[RepositoryWatchService] Graph synchronized. Nodes: ${graph.nodes.size}, Edges: ${graph.edges.length}`,
      );
    } catch (error) {
      console.error(
        "[RepositoryWatchService] Graph synchronization failed:",
        error,
      );
    }
  }

  /**
   * Repository watch patterns.
   */
  private getWatchPatterns(): string[] {
    return [process.cwd()];
  }

  /**
   * Ignored repository patterns.
   */
  private getIgnoredPatterns(): string[] {
    return [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
    ];
  }
}
