import path from "path";

import { AIMutationPlanner } from "../../mutation/services/ai-mutation-planner";

import { MutationOrchestrator } from "../../mutation/services/mutation-orchestrator";

import { SemanticTargetingService } from "../../mutation/services/semantic-targeting-service";

import { FunctionTargetingService } from "../../mutation/services/function-targeting-service";

export interface MutationCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export async function runMutationCommand(
  options: MutationCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running mutation command...\n");

  /**
   * Initialize AI mutation planner.
   */
  const aiMutationPlanner = new AIMutationPlanner();

  /**
   * Initialize mutation orchestrator.
   */
  const mutationOrchestrator = new MutationOrchestrator({
    rootPath: options.rootPath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  /**
   * Target file for semantic mutation.
   */
  /**
   * Target file for semantic mutation.
   */
  /**
   * Initialize semantic targeting service.
   */
  const semanticTargetingService = new SemanticTargetingService({
    rootPath: options.rootPath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  /**
   * Discover semantic runtime targets.
   */
  const runtimeTargets = semanticTargetingService.findRuntimeTargets();

  if (runtimeTargets.length === 0) {
    console.error("[MundiCodeLens CLI] No semantic runtime targets found.");

    return;
  }

  /**
   * Select highest-confidence target.
   */
  const targetFilePath = runtimeTargets[0].filePath;

  console.log(
    `[MundiCodeLens CLI] Semantic target selected:\n${targetFilePath}\n`,
  );

  /**
   * Initialize function targeting service.
   */
  const functionTargetingService = new FunctionTargetingService();

  /**
   * Discover mutation-compatible functions.
   */
  const functionTargets =
    functionTargetingService.findBestMutationTargets(targetFilePath);

  if (functionTargets.length === 0) {
    console.error(
      "[MundiCodeLens CLI] No mutation-compatible functions found.",
    );

    return;
  }

  /**
   * Select highest-ranked function target.
   */
  const targetFunction = functionTargets[0];

  console.log(
    `[MundiCodeLens CLI] Function target selected:\n${targetFunction.functionName}\n`,
  );

  /**
   * Generate AI patch mutation plan.
   */
  const mutationPlan = aiMutationPlanner.generatePlan({
    objective: "append comment",

    targetFilePath,
  });

  if (!mutationPlan.success) {
    console.error("[MundiCodeLens CLI] AI mutation planning failed.");

    console.log("Warnings:", mutationPlan.warnings);

    return;
  }

  console.log("[MundiCodeLens CLI] AI mutation plan generated.\n");

  console.log("Reasoning:", mutationPlan.reasoning);

  /**
   * Execute semantic mutation.
   */
  const result = mutationOrchestrator.execute({
    filePath: targetFilePath,

    patches: mutationPlan.patches,

    astMutations: [
      {
        type: "append-statement",

        targetFunctionName: targetFunction.functionName,

        statement: 'console.log("[AST Mutation] Semantic runtime active.");',
      },

      {
        type: "add-import",

        moduleSpecifier: "path",

        namedImports: ["resolve"],
      },
    ],
  });

  console.log("\n[MundiCodeLens CLI] Mutation execution completed.\n");

  console.log(`Success: ${result.success}`);

  console.log(`Architecture Valid: ${result.architectureValid}`);

  console.log(`Target File: ${result.filePath}\n`);

  if (result.violations.length > 0) {
    console.log(`Violations Detected: ${result.violations.length}\n`);

    for (const violation of result.violations) {
      console.log(`Source: ${violation.source}`);

      console.log(`Dependency: ${violation.dependency}`);

      console.log(`Rule: ${violation.message}\n`);
    }
  }

  if (result.error) {
    console.error("[MundiCodeLens CLI] Mutation failed:", result.error);
  }
}
