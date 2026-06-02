import path from "path";

import { AIMutationPlanner } from "../../mutation/services/ai-mutation-planner";

import { MutationOrchestrator } from "../../mutation/services/mutation-orchestrator";

import { SemanticTargetingService } from "../../mutation/services/semantic-targeting-service";

import { FunctionTargetingService } from "../../mutation/services/function-targeting-service";

import { MutationIntentService } from "../../mutation/services/mutation-intent-service";

import { IntentMutationStrategyService } from "../../mutation/services/intent-mutation-strategy-service";

import type { ASTMutationInstruction } from "../../mutation/engines/ast-mutation-engine";
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
   * Initialize mutation intent service.
   */
  const mutationIntentService = new MutationIntentService();

  /**
   * Analyze engineering intent.
   */
  const intentAnalysis = mutationIntentService.analyzeIntent("add logging");

  console.log("[MundiCodeLens CLI] Intent analysis completed.\n");

  console.log("Intent Type:", intentAnalysis.type);

  console.log("Intent Confidence:", intentAnalysis.confidence);

  console.log("Intent Reasoning:", intentAnalysis.reasoning);

  /**
   * Initialize strategy service.
   */
  const intentMutationStrategyService = new IntentMutationStrategyService();

  /**
   * Generate mutation strategy.
   */
  const mutationStrategy =
    intentMutationStrategyService.generateStrategy(intentAnalysis);

  if (!mutationStrategy.success) {
    console.error("[MundiCodeLens CLI] Mutation strategy generation failed.");

    console.log("Warnings:", mutationStrategy.warnings);

    return;
  }

  console.log("\n[MundiCodeLens CLI] Mutation strategy generated.\n");

  console.log("Strategy Reasoning:", mutationStrategy.reasoning);

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

    astMutations: mutationStrategy.astMutations.map(
      (mutation): ASTMutationInstruction => {
        if (mutation.type === "append-statement") {
          return {
            type: "append-statement",

            targetFunctionName: targetFunction.functionName,

            statement: mutation.statement ?? "",
          };
        }

        return {
          type: "add-import",

          moduleSpecifier: mutation.moduleSpecifier ?? "",

          namedImports: mutation.namedImports ?? [],
        };
      },
    ),
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
