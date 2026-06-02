import { EngineeringPlanningService } from "./engineering-planning-service";

import { EngineeringPolicyService } from "../../governance/engineering-policy-service";

import {
  MutationRollbackService,
  MutationSnapshot,
} from "../../mutation/services/mutation-rollback-service";

import {
  EngineeringMemoryService,
  EngineeringMemoryRecord,
} from "../engineering-memory-service";
export interface EngineeringExecutionPipelineRequest {
  goal: string;

  filePath: string;

  intentType: string;

  riskLevel: string;

  functionName?: string;
}

export interface EngineeringExecutionPipelineResult {
  success: boolean;

  executionId: string;

  stepsExecuted: string[];

  reasoning: string[];

  warnings: string[];

  governanceApproved: boolean;

  rollbackPrepared: boolean;

  snapshot?: MutationSnapshot;
}

export class EngineeringExecutionPipelineService {
  private readonly planningService = new EngineeringPlanningService();

  private readonly policyService = new EngineeringPolicyService();

  private readonly rollbackService = new MutationRollbackService();

  private readonly memoryService = new EngineeringMemoryService();

  /**
   * Executes autonomous engineering lifecycle pipeline.
   */
  public executePipeline(
    request: EngineeringExecutionPipelineRequest,
  ): EngineeringExecutionPipelineResult {
    const executionId = `exec-${Date.now()}`;

    const reasoning: string[] = [];

    const warnings: string[] = [];

    const stepsExecuted: string[] = [];

    /**
     * Generate engineering workflow plan.
     */
    const executionPlan = this.planningService.generatePlan(request.goal);

    reasoning.push("Engineering workflow plan generated.");

    stepsExecuted.push("workflow-planning");

    /**
     * Evaluate governance policy.
     */
    const governanceResult = this.policyService.evaluatePolicy({
      filePath: request.filePath,

      intentType: request.intentType,

      riskLevel: request.riskLevel,
    });

    reasoning.push(...governanceResult.reasoning);

    warnings.push(...governanceResult.warnings);

    stepsExecuted.push("governance-validation");

    /**
     * Block unauthorized operations.
     */
    if (!governanceResult.allowed) {
      warnings.push("Engineering execution blocked by governance.");

      return {
        success: false,

        executionId,

        stepsExecuted,

        reasoning,

        warnings,

        governanceApproved: false,

        rollbackPrepared: false,
      };
    }

    /**
     * Prepare rollback snapshot.
     */
    const snapshot = this.rollbackService.createSnapshot(request.filePath);

    reasoning.push("Rollback snapshot prepared.");

    stepsExecuted.push("rollback-preparation");

    /**
     * Persist engineering memory.
     */
    const memoryRecord: EngineeringMemoryRecord = {
      id: executionId,

      timestamp: new Date(),

      intent: request.intentType,

      targetFile: request.filePath,

      targetFunction: request.functionName,

      success: true,

      safe: true,

      riskLevel: request.riskLevel,

      rollbackTriggered: false,

      reasoning,

      warnings,
    };

    this.memoryService.remember(memoryRecord);

    reasoning.push("Engineering execution memory persisted.");

    stepsExecuted.push("memory-persistence");

    /**
     * Pipeline execution completed.
     */
    reasoning.push("Engineering execution pipeline completed successfully.");

    return {
      success: true,

      executionId,

      stepsExecuted,

      reasoning,

      warnings,

      governanceApproved: true,

      rollbackPrepared: true,

      snapshot,
    };
  }
}
