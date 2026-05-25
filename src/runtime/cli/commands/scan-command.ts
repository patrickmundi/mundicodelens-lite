import { GraphBuilder } from "../../graph/builder/graph-builder";

export interface ScanCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export async function runScanCommand(
  options: ScanCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running repository scan...\n");

  const graphBuilder = new GraphBuilder({
    rootPath: options.rootPath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  const graph = graphBuilder.build();

  console.log("[MundiCodeLens CLI] Repository graph built successfully.\n");

  console.log(`Nodes: ${graph.nodes.size}`);

  console.log(`Edges: ${graph.edges.length}`);

  console.log(`Last scanned: ${graph.metadata.lastScannedAt.toISOString()}`);

  console.log("\n[MundiCodeLens CLI] Sample repository nodes:\n");

  const sampleNodes = Array.from(graph.nodes.keys()).slice(0, 10);

  for (const node of sampleNodes) {
    console.log(`- ${node}`);
  }

  console.log("\n[MundiCodeLens CLI] Repository scan completed.\n");
}
