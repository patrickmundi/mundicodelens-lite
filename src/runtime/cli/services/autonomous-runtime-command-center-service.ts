import { RepositoryGraphScannerService } from "../../scanning/services/repository-graph-scanner-service";

import { AutonomousEvolutionDryRunService } from "../../simulation/services/autonomous-evolution-dry-run-service";

import { AutonomousRepositoryEvolutionPipelineService } from "../../pipelines/services/autonomous-repository-evolution-pipeline-service";

import { RuntimeCognitionTelemetryService } from "../../telemetry/services/runtime-cognition-telemetry-service";

export interface RuntimeCommandRequest {
  command:
    | "SCAN_REPOSITORY"
    | "DRY_RUN"
    | "EXECUTE_PIPELINE"
    | "TELEMETRY_REPORT";

  repositoryPath: string;

  targetFiles?: string[];
}

export interface RuntimeCommandResult {
  success: boolean;

  command: string;

  diagnostics: string[];

  output?: string;

  error?: string;
}

export class AutonomousRuntimeCommandCenterService {
  constructor(
    private readonly repositoryScanner: RepositoryGraphScannerService,

    private readonly dryRunService: AutonomousEvolutionDryRunService,

    private readonly pipelineService: AutonomousRepositoryEvolutionPipelineService,

    private readonly telemetryService: RuntimeCognitionTelemetryService,
  ) {}

  /**
   * Execute command center operation.
   */
  public executeCommand(request: RuntimeCommandRequest): RuntimeCommandResult {
    const diagnostics: string[] = [];

    try {
      diagnostics.push(`Executing runtime command '${request.command}'.`);

      switch (request.command) {
        /**
         * Repository scan.
         */
        case "SCAN_REPOSITORY": {
          const scan = this.repositoryScanner.scanRepository(
            request.repositoryPath,
          );

          diagnostics.push("Repository scan command completed.");

          return {
            success: scan.success,

            command: request.command,

            diagnostics,

            output: this.repositoryScanner.generateRepositoryReport(scan),

            error: scan.error,
          };
        }

        /**
         * Dry-run simulation.
         */
        case "DRY_RUN": {
          const dryRun = this.dryRunService.executeDryRun({
            repositoryPath: request.repositoryPath,

            targetFiles: request.targetFiles,

            enableRiskAnalysis: true,

            enableRollbackEstimation: true,

            enableSemanticMutationPreview: true,
          });

          diagnostics.push("Dry-run simulation command completed.");

          return {
            success: dryRun.success,

            command: request.command,

            diagnostics,

            output: this.dryRunService.generateDryRunReport(dryRun),

            error: dryRun.error,
          };
        }

        /**
         * Autonomous execution pipeline.
         */
        case "EXECUTE_PIPELINE": {
          const pipeline = this.pipelineService.executePipeline({
            repositoryPath: request.repositoryPath,

            targetFiles: request.targetFiles,

            enableRollbackProtection: true,

            enableTopologyValidation: true,

            enableSemanticMutation: true,
          });

          diagnostics.push("Autonomous evolution pipeline command completed.");

          return {
            success: pipeline.success,

            command: request.command,

            diagnostics,

            output: this.pipelineService.generatePipelineReport(pipeline),

            error: pipeline.error,
          };
        }

        /**
         * Telemetry report.
         */
        case "TELEMETRY_REPORT": {
          const telemetry = this.telemetryService.captureTelemetry();

          diagnostics.push("Telemetry report command completed.");

          return {
            success: true,

            command: request.command,

            diagnostics,

            output: this.telemetryService.generateTelemetryReport(telemetry),
          };
        }

        default:
          return {
            success: false,

            command: request.command,

            diagnostics,

            error: "Unsupported runtime command.",
          };
      }
    } catch (error) {
      return {
        success: false,

        command: request.command,

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown runtime command failure.",
      };
    }
  }

  /**
   * Generate command center help menu.
   */
  public generateHelpMenu(): string {
    return [
      "=== Autonomous Runtime Command Center ===",

      "",

      "Available Commands:",

      "",

      "1. SCAN_REPOSITORY",
      "   - Scan repository topology",
      "   - Build dependency graph",
      "   - Bootstrap repository cognition",

      "",

      "2. DRY_RUN",
      "   - Simulate repository evolution",
      "   - Generate mutation previews",
      "   - Estimate rollback probability",

      "",

      "3. EXECUTE_PIPELINE",
      "   - Execute autonomous repository evolution",
      "   - Perform AST mutations",
      "   - Coordinate rollback-safe execution",

      "",

      "4. TELEMETRY_REPORT",
      "   - Capture cognition telemetry",
      "   - Analyze runtime stability",
      "   - Generate operational diagnostics",
    ].join("\n");
  }

  /**
   * Generate command execution report.
   */
  public generateExecutionReport(result: RuntimeCommandResult): string {
    return [
      "=== Runtime Command Execution Report ===",

      "",

      `Command: ${result.command}`,

      `Success: ${result.success}`,

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),

      "",

      "Output:",

      result.output ?? "No output generated.",

      "",

      result.error
        ? `Error: ${result.error}`
        : "Execution completed successfully.",
    ].join("\n");
  }
}
