import {
  RuntimeReasoningEngineService,
  RuntimeReasoningContext,
  RuntimeDecision,
} from "./runtime-reasoning-engine-service";

export interface RuntimeExecutionCandidate {
  id: string;

  objective: string;

  confidence: number;

  riskLevel: "low" | "medium" | "high";

  metadata?: Record<string, unknown>;
}

export interface RuntimeDecisionResult {
  selectedCandidate?: RuntimeExecutionCandidate;

  decision: RuntimeDecision;

  rejectedCandidates: RuntimeExecutionCandidate[];
}

export class RuntimeDecisionOrchestratorService {
  constructor(
    private readonly reasoningEngine: RuntimeReasoningEngineService,
  ) {}

  /**
   * Evaluate runtime candidates
   * and select best execution path.
   */
  public evaluateCandidates(
    candidates: RuntimeExecutionCandidate[],
  ): RuntimeDecisionResult {
    console.log("[RuntimeDecisionOrchestrator] Evaluating candidates.");

    const rejectedCandidates: RuntimeExecutionCandidate[] = [];

    let bestCandidate: RuntimeExecutionCandidate | undefined;

    let bestDecision: RuntimeDecision | undefined;

    for (const candidate of candidates) {
      const context: RuntimeReasoningContext = {
        objective: candidate.objective,

        confidence: candidate.confidence,

        riskLevel: candidate.riskLevel,

        metadata: candidate.metadata,
      };

      const decision = this.reasoningEngine.analyze(context);

      if (!decision.accepted) {
        rejectedCandidates.push(candidate);

        continue;
      }

      if (!bestCandidate || candidate.confidence > bestCandidate.confidence) {
        bestCandidate = candidate;

        bestDecision = decision;
      }
    }

    if (!bestCandidate || !bestDecision) {
      return {
        rejectedCandidates,

        decision: {
          accepted: false,

          confidence: 0,

          reasoning: [
            "No execution candidate passed runtime reasoning validation.",
          ],

          recommendedAction: "abort",
        },
      };
    }

    return {
      selectedCandidate: bestCandidate,

      rejectedCandidates,

      decision: bestDecision,
    };
  }
}
