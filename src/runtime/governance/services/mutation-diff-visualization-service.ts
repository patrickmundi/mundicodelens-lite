export interface MutationDiffLine {
  type: "UNCHANGED" | "ADDED" | "REMOVED";

  content: string;

  lineNumber: number;
}

export interface MutationDiffVisualization {
  filePath: string;

  addedLines: number;

  removedLines: number;

  unchangedLines: number;

  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  diffLines: MutationDiffLine[];

  governanceNotes: string[];
}

export interface MutationDiffVisualizationResult {
  success: boolean;

  visualizations: MutationDiffVisualization[];

  diagnostics: string[];

  error?: string;
}

export interface MutationDiffTarget {
  filePath: string;

  originalContent: string;

  transformedContent: string;
}

export class MutationDiffVisualizationService {
  /**
   * Generate mutation diff visualizations.
   */
  public generateVisualization(
    targets: MutationDiffTarget[],
  ): MutationDiffVisualizationResult {
    const diagnostics: string[] = [];

    const visualizations: MutationDiffVisualization[] = [];

    try {
      diagnostics.push("Initializing mutation diff visualization engine.");

      for (const target of targets) {
        diagnostics.push(`Generating mutation diff for '${target.filePath}'.`);

        const originalLines = target.originalContent.split("\n");

        const transformedLines = target.transformedContent.split("\n");

        const diffLines: MutationDiffLine[] = [];

        let addedLines = 0;

        let removedLines = 0;

        let unchangedLines = 0;

        const maxLength = Math.max(
          originalLines.length,
          transformedLines.length,
        );

        /**
         * Line-by-line diff analysis.
         */
        for (let index = 0; index < maxLength; index += 1) {
          const originalLine = originalLines[index];

          const transformedLine = transformedLines[index];

          /**
           * Unchanged line.
           */
          if (originalLine === transformedLine) {
            if (originalLine !== undefined) {
              diffLines.push({
                type: "UNCHANGED",

                content: originalLine,

                lineNumber: index + 1,
              });

              unchangedLines += 1;
            }

            continue;
          }

          /**
           * Removed line.
           */
          if (originalLine !== undefined) {
            diffLines.push({
              type: "REMOVED",

              content: originalLine,

              lineNumber: index + 1,
            });

            removedLines += 1;
          }

          /**
           * Added line.
           */
          if (transformedLine !== undefined) {
            diffLines.push({
              type: "ADDED",

              content: transformedLine,

              lineNumber: index + 1,
            });

            addedLines += 1;
          }
        }

        /**
         * Governance analysis.
         */
        const governanceNotes: string[] = [];

        governanceNotes.push(`Detected ${addedLines} added lines.`);

        governanceNotes.push(`Detected ${removedLines} removed lines.`);

        governanceNotes.push(`Detected ${unchangedLines} unchanged lines.`);

        /**
         * Risk estimation.
         */
        const riskLevel = this.estimateDiffRisk(addedLines, removedLines);

        governanceNotes.push(`Governance risk estimated at '${riskLevel}'.`);

        /**
         * Large mutation detection.
         */
        if (addedLines + removedLines > 50) {
          governanceNotes.push("Large mutation footprint detected.");
        }

        /**
         * Destructive mutation detection.
         */
        if (removedLines > addedLines) {
          governanceNotes.push(
            "Potential destructive mutation pattern detected.",
          );
        }

        visualizations.push({
          filePath: target.filePath,

          addedLines,

          removedLines,

          unchangedLines,

          riskLevel,

          diffLines,

          governanceNotes,
        });
      }

      diagnostics.push("Mutation diff visualization completed successfully.");

      return {
        success: true,

        visualizations,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        visualizations,

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown diff visualization failure.",
      };
    }
  }

  /**
   * Estimate governance diff risk.
   */
  private estimateDiffRisk(
    addedLines: number,

    removedLines: number,
  ): "LOW" | "MEDIUM" | "HIGH" {
    const mutationMagnitude = addedLines + removedLines;

    if (mutationMagnitude >= 100) {
      return "HIGH";
    }

    if (mutationMagnitude >= 30) {
      return "MEDIUM";
    }

    return "LOW";
  }

  /**
   * Generate terminal-friendly visualization.
   */
  public renderTerminalVisualization(
    visualization: MutationDiffVisualization,
  ): string {
    const renderedLines = visualization.diffLines.map((line) => {
      switch (line.type) {
        case "ADDED":
          return `+ ${line.content}`;

        case "REMOVED":
          return `- ${line.content}`;

        default:
          return `  ${line.content}`;
      }
    });

    return [
      "=== Mutation Diff Visualization ===",

      "",

      `File: ${visualization.filePath}`,

      `Risk Level: ${visualization.riskLevel}`,

      `Added Lines: ${visualization.addedLines}`,

      `Removed Lines: ${visualization.removedLines}`,

      "",

      "Governance Notes:",

      ...visualization.governanceNotes.map((note) => `- ${note}`),

      "",

      "Diff Preview:",

      ...renderedLines,
    ].join("\n");
  }

  /**
   * Generate governance approval report.
   */
  public generateGovernanceReport(
    result: MutationDiffVisualizationResult,
  ): string {
    return [
      "=== Mutation Governance Visualization Report ===",

      "",

      `Success: ${result.success}`,

      "",

      "Visualization Targets:",

      ...result.visualizations.map(
        (visualization) =>
          `- ${visualization.filePath} (${visualization.riskLevel})`,
      ),

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),
    ].join("\n");
  }
}
