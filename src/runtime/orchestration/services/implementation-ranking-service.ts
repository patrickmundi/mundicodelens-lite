import { CodexImplementationCandidate } from "../../providers/codex-delegation-service";

export interface RankedImplementationCandidate extends CodexImplementationCandidate {
  architectureScore: number;

  governanceScore: number;

  riskScore: number;

  executionScore: number;

  totalScore: number;

  recommended: boolean;
}

export interface ImplementationRankingRequest {
  candidates: CodexImplementationCandidate[];

  repositoryPath: string;

  targetFile: string;

  intentType: string;
}

export interface ImplementationRankingResult {
  success: boolean;

  reasoning: string[];

  warnings: string[];

  rankedCandidates: RankedImplementationCandidate[];

  recommendedCandidate?: RankedImplementationCandidate;
}

export class ImplementationRankingService {
  /**
   * Ranks implementation candidates
   * using engineering cognition scoring.
   */
  public rankCandidates(
    request: ImplementationRankingRequest,
  ): ImplementationRankingResult {
    const reasoning: string[] = [];

    const warnings: string[] = [];

    reasoning.push("Implementation candidate ranking initialized.");

    /**
     * Rank implementation candidates.
     */
    const rankedCandidates = request.candidates.map(
      (candidate): RankedImplementationCandidate => {
        const architectureScore = this.calculateArchitectureScore(candidate);

        const governanceScore = this.calculateGovernanceScore(candidate);

        const riskScore = this.calculateRiskScore(candidate);

        const executionScore = this.calculateExecutionScore(candidate);

        const totalScore =
          architectureScore + governanceScore + riskScore + executionScore;

        return {
          ...candidate,

          architectureScore,

          governanceScore,

          riskScore,

          executionScore,

          totalScore,

          recommended: false,
        };
      },
    );

    /**
     * Sort candidates by total score.
     */
    rankedCandidates.sort((a, b) => b.totalScore - a.totalScore);

    /**
     * Select best implementation candidate.
     */
    const recommendedCandidate = rankedCandidates[0];

    if (recommendedCandidate) {
      recommendedCandidate.recommended = true;

      reasoning.push(
        `Recommended candidate selected: ${recommendedCandidate.id}`,
      );
    } else {
      warnings.push("No implementation candidates available.");
    }

    reasoning.push("Implementation ranking completed.");

    return {
      success: rankedCandidates.length > 0,

      reasoning,

      warnings,

      rankedCandidates,

      recommendedCandidate,
    };
  }

  /**
   * Architecture compatibility scoring.
   */
  private calculateArchitectureScore(
    candidate: CodexImplementationCandidate,
  ): number {
    return candidate.confidence * 30;
  }

  /**
   * Governance compatibility scoring.
   */
  private calculateGovernanceScore(
    candidate: CodexImplementationCandidate,
  ): number {
    if (candidate.estimatedRisk === "low") {
      return 30;
    }

    if (candidate.estimatedRisk === "medium") {
      return 20;
    }

    return 10;
  }

  /**
   * Risk evaluation scoring.
   */
  private calculateRiskScore(candidate: CodexImplementationCandidate): number {
    if (candidate.estimatedRisk === "low") {
      return 25;
    }

    if (candidate.estimatedRisk === "medium") {
      return 15;
    }

    return 5;
  }

  /**
   * Execution viability scoring.
   */
  private calculateExecutionScore(
    candidate: CodexImplementationCandidate,
  ): number {
    return candidate.implementationSteps.length * 5;
  }
}
