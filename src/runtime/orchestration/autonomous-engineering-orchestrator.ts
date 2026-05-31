import { MutationIntentService } from "../../mutation/services/mutation-intent-service";

import { IntentMutationStrategyService } from "../../mutation/services/intent-mutation-strategy-service";

import { MutationSafetyService } from "../../mutation/services/mutation-safety-service";

import {
  MutationRollbackService,
  MutationSnapshot,
} from "../../mutation/services/mutation-rollback-service";

export interface AutonomousEngineeringRequest {
  intent: string;

  filePath: string;

  functionName?: string;
}

export interface AutonomousEngineeringResult {
  success: boolean;

  safe: boolean;

  intentType: string;

  riskLevel: string;

  reasoning: string[];

  warnings: string[];

  snapshot?: MutationSnapshot;
}

export class AutonomousEngineeringOrchestrator {
  private readonly mutationIntentService = new MutationIntentService();

  private readonly strategyService = new IntentMutationStrategyService();

  private readonly mutationSafetyService = new MutationSafetyService();

  private readonly mutationRollbackService = new MutationRollbackService();

  /**
   * Executes autonomous engineering cognition flow.
   */
  public execute(
    request: AutonomousEngineeringRequest,
  ): AutonomousEngineeringResult {
    const reasoning: string[] = [];

    const warnings: string[] = [];

    /**
     * Analyze engineering intent.
     */
    const intentAnalysis = this.mutationIntentService.analyzeIntent(
      request.intent,
    );

    reasoning.push(`Intent analyzed: ${intentAnalysis.type}`);

    /**
     * Generate mutation strategy.
     */
    const mutationStrategy =
      this.strategyService.generateStrategy(intentAnalysis);

    if (!mutationStrategy.success) {
      warnings.push("Mutation strategy generation failed.");

      return {
        success: false,

        safe: false,

        intentType: intentAnalysis.type,

        riskLevel: "unknown",

        reasoning,

        warnings,
      };
    }

    reasoning.push("Mutation strategy generated successfully.");

    /**
     * Evaluate mutation safety.
     */
    const safetyAnalysis = this.mutationSafetyService.analyzeMutationRisk({
      filePath: request.filePath,

      functionName: request.functionName,

      intentType: intentAnalysis.type,
    });

    reasoning.push(`Mutation safety evaluated: ${safetyAnalysis.riskLevel}`);

    warnings.push(...safetyAnalysis.warnings);

    /**
     * Block critical mutations.
     */
    if (!safetyAnalysis.safe) {
      warnings.push("Mutation execution blocked by safety cognition.");

      return {
        success: false,

        safe: false,

        intentType: intentAnalysis.type,

        riskLevel: safetyAnalysis.riskLevel,

        reasoning,

        warnings,
      };
    }

    /**
     * Create rollback snapshot.
     */
    const snapshot = this.mutationRollbackService.createSnapshot(
      request.filePath,
    );

    reasoning.push("Rollback snapshot created successfully.");

    /**
     * Autonomous orchestration completed.
     */
    reasoning.push("Autonomous engineering orchestration completed.");

    return {
      success: true,

      safe: true,

      intentType: intentAnalysis.type,

      riskLevel: safetyAnalysis.riskLevel,

      reasoning,

      warnings,

      snapshot,
    };
  }
}
