import { GraphBuilder } from "../../graph/builder/graph-builder";

import { ArchitectureQuery } from "../../graph/queries/architecture-query";

import type { ArchitectureRule } from "../../graph/queries/architecture-query";

import {
  ASTMutationEngine,
  ASTMutationInstruction,
} from "../engines/ast-mutation-engine";

import { PatchEngine, PatchInstruction } from "../engines/patch-engine";

import { FileMutationService } from "./file-mutation-service";

export interface MutationRequest {
  filePath: string;

  patches?: PatchInstruction[];

  astMutations?: ASTMutationInstruction[];
}

export interface MutationExecutionResult {
  success: boolean;

  filePath: string;

  architectureValid: boolean;

  violations: any[];

  error?: unknown;
}

export interface MutationOrchestratorOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export class MutationOrchestrator {
  private readonly fileMutationService: FileMutationService;

  private readonly patchEngine: PatchEngine;

  private readonly astMutationEngine: ASTMutationEngine;

  private readonly rootPath: string;

  private readonly tsConfigFilePath?: string;

  constructor(options: MutationOrchestratorOptions) {
    this.rootPath = options.rootPath;

    this.tsConfigFilePath = options.tsConfigFilePath;

    this.fileMutationService = new FileMutationService();

    this.patchEngine = new PatchEngine();

    this.astMutationEngine = new ASTMutationEngine();
  }

  /**
   * Executes safe repository mutation.
   */
  public execute(request: MutationRequest): MutationExecutionResult {
    console.log(
      `[MutationOrchestrator] Starting mutation:\n${request.filePath}`,
    );

    const mutationResult = this.fileMutationService.mutate(
      request.filePath,
      (currentContent) => {
        let updatedContent = currentContent;

        /**
         * Apply patch mutations.
         */
        if (request.patches && request.patches.length > 0) {
          updatedContent = this.patchEngine.applyPatches(
            updatedContent,
            request.patches,
          );
        }

        /**
         * Apply AST mutations.
         */
        if (request.astMutations && request.astMutations.length > 0) {
          this.fileMutationService.writeFile(request.filePath, updatedContent);

          updatedContent = this.astMutationEngine.applyMutations(
            request.filePath,
            request.astMutations,
          );
        }

        return updatedContent;
      },
    );

    if (!mutationResult.success) {
      return {
        success: false,

        filePath: request.filePath,

        architectureValid: false,

        violations: [],

        error: mutationResult.error,
      };
    }

    /**
     * Rebuild repository graph.
     */
    const graphBuilder = new GraphBuilder({
      rootPath: this.rootPath,

      tsConfigFilePath: this.tsConfigFilePath,
    });

    const graph = graphBuilder.build();

    /**
     * Validate architecture.
     */
    const architectureQuery = new ArchitectureQuery(graph);

    const rules: ArchitectureRule[] = [
      {
        sourcePattern: /commands/,

        forbiddenPattern: /storage/,

        message: "Commands layer must not depend directly on storage layer.",
      },

      {
        sourcePattern: /ui/,

        forbiddenPattern: /storage/,

        message: "UI layer must not depend directly on storage layer.",
      },
    ];

    const violations = architectureQuery.validateRules(rules);

    /**
     * Rollback if governance fails.
     */
    if (violations.length > 0) {
      console.warn(
        "[MutationOrchestrator] Governance violations detected. Rolling back mutation.",
      );

      if (mutationResult.backupPath) {
        this.fileMutationService.restoreBackup(
          mutationResult.backupPath,
          request.filePath,
        );
      }

      return {
        success: false,

        filePath: request.filePath,

        architectureValid: false,

        violations,
      };
    }

    console.log("[MutationOrchestrator] Mutation completed successfully.");

    return {
      success: true,

      filePath: request.filePath,

      architectureValid: true,

      violations: [],
    };
  }
}
