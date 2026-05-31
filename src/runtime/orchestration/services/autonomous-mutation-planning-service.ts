import {
  MutationGovernanceCognitionService,
  MutationExecutionRequest,
} from "../../governance/services/mutation-governance-cognition-service";

export interface PlannedMutationStep {
  stepId: string;

  mutationType: string;

  targetRegion: string;

  estimatedRisk: number;

  executionPriority: number;

  requiresRollbackProtection: boolean;

  approved: boolean;
}

export interface AutonomousMutationPlan {
  planId: string;

  generatedAt: number;

  totalSteps: number;

  approvedSteps: number;

  blockedSteps: number;

  executionOrder: PlannedMutationStep[];

  reasoning: string[];
}

export class AutonomousMutationPlanningService {
  constructor(
    private readonly governance: MutationGovernanceCognitionService,
  ) {}

  /**
   * Generate autonomous mutation plan.
   */
  public generatePlan(
    requests: MutationExecutionRequest[],
  ): AutonomousMutationPlan {
    const executionOrder: PlannedMutationStep[] = [];

    const reasoning: string[] = [];

    let approvedSteps = 0;

    let blockedSteps = 0;

    /**
     * Sort mutations by estimated risk.
     * Lower risk executes first.
     */
    const sortedRequests = [...requests].sort(
      (a, b) => a.estimatedRisk - b.estimatedRisk,
    );

    sortedRequests.forEach((request, index) => {
      const governanceDecision = this.governance.evaluateMutation(request);

      const step: PlannedMutationStep = {
        stepId: `mutation-step-${index + 1}`,

        mutationType: request.mutationType,

        targetRegion: request.targetRegion,

        estimatedRisk: request.estimatedRisk,

        executionPriority: index + 1,

        requiresRollbackProtection: request.estimatedRisk > 60,

        approved: governanceDecision.approved,
      };

      executionOrder.push(step);

      /**
       * Approved mutation.
       */
      if (governanceDecision.approved) {
        approvedSteps += 1;

        reasoning.push(
          `Approved mutation '${request.mutationType}' for '${request.targetRegion}'.`,
        );
      } else {
        blockedSteps += 1;

        reasoning.push(
          `Blocked mutation '${request.mutationType}' due to governance restrictions.`,
        );
      }

      /**
       * Rollback protection.
       */
      if (step.requiresRollbackProtection) {
        reasoning.push(`Rollback protection enabled for '${step.stepId}'.`);
      }

      /**
       * Governance escalation.
       */
      if (governanceDecision.escalationRequired) {
        reasoning.push(`Governance escalation required for '${step.stepId}'.`);
      }
    });

    return {
      planId: `mutation-plan-${Date.now()}`,

      generatedAt: Date.now(),

      totalSteps: executionOrder.length,

      approvedSteps,

      blockedSteps,

      executionOrder,

      reasoning,
    };
  }

  /**
   * Detect high-risk mutation paths.
   */
  public detectHighRiskPaths(
    plan: AutonomousMutationPlan,
  ): PlannedMutationStep[] {
    return plan.executionOrder.filter((step) => step.estimatedRisk > 70);
  }

  /**
   * Detect rollback-protected steps.
   */
  public detectRollbackProtectedSteps(
    plan: AutonomousMutationPlan,
  ): PlannedMutationStep[] {
    return plan.executionOrder.filter(
      (step) => step.requiresRollbackProtection,
    );
  }

  /**
   * Generate execution summary.
   */
  public generateExecutionSummary(plan: AutonomousMutationPlan): string {
    return [
      "=== Autonomous Mutation Plan ===",

      "",

      `Plan ID: ${plan.planId}`,

      `Generated At: ${new Date(plan.generatedAt).toISOString()}`,

      `Total Steps: ${plan.totalSteps}`,

      `Approved Steps: ${plan.approvedSteps}`,

      `Blocked Steps: ${plan.blockedSteps}`,

      "",

      "Execution Order:",

      ...plan.executionOrder.map(
        (step) =>
          `- [Priority ${step.executionPriority}] ${step.mutationType} → ${step.targetRegion}`,
      ),

      "",

      "Reasoning:",

      ...plan.reasoning.map((item) => `- ${item}`),
    ].join("\n");
  }

  /**
   * Generate safe execution queue.
   */
  public generateSafeExecutionQueue(
    plan: AutonomousMutationPlan,
  ): PlannedMutationStep[] {
    return plan.executionOrder.filter((step) => step.approved);
  }
}
