import {
  AutonomousExecutionSimulationService,
  ExecutionSimulationResult,
} from "./autonomous-execution-simulation-service";

import { AutonomousMutationPlan } from "../../orchestration/services/autonomous-mutation-planning-service";

export interface EngineeringJudgmentDecision {
  selectedPlanId: string;

  confidenceScore: number;

  rejectedPlans: string[];

  reasoning: string[];

  executionRecommendation: string;

  rollbackRiskAssessment: string;
}

export interface RankedExecutionCandidate {
  plan: AutonomousMutationPlan;

  simulation: ExecutionSimulationResult;

  judgmentScore: number;
}

export class AutonomousEngineeringJudgmentService {
  constructor(
    private readonly simulationService: AutonomousExecutionSimulationService,
  ) {}

  /**
   * Evaluate multiple execution plans.
   */
  public evaluateExecutionCandidates(
    plans: AutonomousMutationPlan[],
  ): EngineeringJudgmentDecision {
    const reasoning: string[] = [];

    const rejectedPlans: string[] = [];

    const rankedCandidates: RankedExecutionCandidate[] = [];

    /**
     * Simulate and score all plans.
     */
    for (const plan of plans) {
      const simulation = this.simulationService.simulateExecutionPlan(plan);

      const judgmentScore = this.calculateJudgmentScore(simulation);

      rankedCandidates.push({
        plan,

        simulation,

        judgmentScore,
      });

      reasoning.push(`Plan '${plan.planId}' scored ${judgmentScore}.`);
    }

    /**
     * Sort by highest score.
     */
    rankedCandidates.sort((a, b) => b.judgmentScore - a.judgmentScore);

    const selected = rankedCandidates[0];

    /**
     * Reject weaker candidates.
     */
    for (const candidate of rankedCandidates.slice(1)) {
      rejectedPlans.push(candidate.plan.planId);

      reasoning.push(
        `Rejected '${candidate.plan.planId}' due to lower execution confidence.`,
      );
    }

    /**
     * Rollback assessment.
     */
    const rollbackRiskAssessment =
      selected.simulation.rollbackProbability > 50 ? "HIGH" : "LOW";

    /**
     * Final recommendation.
     */
    const executionRecommendation =
      selected.judgmentScore > 70 ? "EXECUTE" : "REVIEW_REQUIRED";

    reasoning.push(
      `Selected '${selected.plan.planId}' as optimal execution path.`,
    );

    reasoning.push(`Execution recommendation: ${executionRecommendation}.`);

    return {
      selectedPlanId: selected.plan.planId,

      confidenceScore: selected.judgmentScore,

      rejectedPlans,

      reasoning,

      executionRecommendation,

      rollbackRiskAssessment,
    };
  }

  /**
   * Calculate execution judgment score.
   */
  private calculateJudgmentScore(
    simulation: ExecutionSimulationResult,
  ): number {
    let score = 100;

    /**
     * Penalize rollback risk.
     */
    score -= simulation.rollbackProbability * 0.3;

    /**
     * Penalize governance violations.
     */
    score -= simulation.governanceViolationProbability * 0.4;

    /**
     * Penalize instability.
     */
    score -= simulation.architecturalInstabilityRisk * 0.3;

    /**
     * Reward success probability.
     */
    score += simulation.successProbability * 0.2;

    /**
     * Normalize.
     */
    return Math.max(0, Math.min(100, Math.floor(score)));
  }

  /**
   * Detect unstable candidates.
   */
  public detectUnstableCandidates(plans: AutonomousMutationPlan[]): string[] {
    const unstable: string[] = [];

    for (const plan of plans) {
      const simulation = this.simulationService.simulateExecutionPlan(plan);

      if (simulation.architecturalInstabilityRisk > 70) {
        unstable.push(plan.planId);
      }
    }

    return unstable;
  }

  /**
   * Detect governance-dangerous candidates.
   */
  public detectGovernanceDangerousCandidates(
    plans: AutonomousMutationPlan[],
  ): string[] {
    const dangerous: string[] = [];

    for (const plan of plans) {
      const simulation = this.simulationService.simulateExecutionPlan(plan);

      if (simulation.governanceViolationProbability > 50) {
        dangerous.push(plan.planId);
      }
    }

    return dangerous;
  }

  /**
   * Generate engineering judgment report.
   */
  public generateJudgmentReport(decision: EngineeringJudgmentDecision): string {
    return [
      "=== Autonomous Engineering Judgment Report ===",

      "",

      `Selected Plan: ${decision.selectedPlanId}`,

      `Confidence Score: ${decision.confidenceScore}`,

      `Execution Recommendation: ${decision.executionRecommendation}`,

      `Rollback Risk: ${decision.rollbackRiskAssessment}`,

      "",

      "Rejected Plans:",

      ...decision.rejectedPlans.map((plan) => `- ${plan}`),

      "",

      "Reasoning:",

      ...decision.reasoning.map((item) => `- ${item}`),
    ].join("\n");
  }
}
