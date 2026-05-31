import { RepositoryCognitionService } from "../../reasoning/services/repository-cognition-service";

export interface MutationGovernancePolicy {
  mutationType: string;

  requiresApproval: boolean;

  allowedRegions: string[];

  prohibitedRegions: string[];

  maximumRiskLevel: number;
}

export interface MutationExecutionRequest {
  mutationType: string;

  targetRegion: string;

  estimatedRisk: number;

  initiatedBy: string;
}

export interface MutationGovernanceDecision {
  approved: boolean;

  escalationRequired: boolean;

  reasoning: string[];

  governanceWarnings: string[];
}

export class MutationGovernanceCognitionService {
  private readonly policies: MutationGovernancePolicy[] = [];

  constructor(
    private readonly repositoryCognition: RepositoryCognitionService,
  ) {
    this.bootstrapPolicies();
  }

  /**
   * Bootstrap governance policies.
   */
  private bootstrapPolicies(): void {
    this.policies.push({
      mutationType: "safe-refactor",

      requiresApproval: false,

      allowedRegions: ["observability", "reasoning"],

      prohibitedRegions: ["governance"],

      maximumRiskLevel: 40,
    });

    this.policies.push({
      mutationType: "execution-optimization",

      requiresApproval: true,

      allowedRegions: ["orchestration"],

      prohibitedRegions: ["governance"],

      maximumRiskLevel: 70,
    });

    this.policies.push({
      mutationType: "governance-modification",

      requiresApproval: true,

      allowedRegions: ["governance"],

      prohibitedRegions: [],

      maximumRiskLevel: 95,
    });

    this.policies.push({
      mutationType: "adaptive-runtime-evolution",

      requiresApproval: true,

      allowedRegions: ["reasoning", "orchestration"],

      prohibitedRegions: ["governance"],

      maximumRiskLevel: 80,
    });
  }

  /**
   * Evaluate mutation governance.
   */
  public evaluateMutation(
    request: MutationExecutionRequest,
  ): MutationGovernanceDecision {
    const reasoning: string[] = [];

    const governanceWarnings: string[] = [];

    const policy = this.policies.find(
      (candidate) => candidate.mutationType === request.mutationType,
    );

    /**
     * Unknown mutation policy.
     */
    if (!policy) {
      return {
        approved: false,

        escalationRequired: true,

        reasoning: ["Unknown mutation type detected."],

        governanceWarnings: ["Mutation policy resolution failed."],
      };
    }

    /**
     * Region validation.
     */
    if (policy.prohibitedRegions.includes(request.targetRegion)) {
      return {
        approved: false,

        escalationRequired: true,

        reasoning: [`Mutation prohibited in region '${request.targetRegion}'.`],

        governanceWarnings: ["Protected repository region violation detected."],
      };
    }

    /**
     * Allowed region validation.
     */
    if (!policy.allowedRegions.includes(request.targetRegion)) {
      governanceWarnings.push(
        `Region '${request.targetRegion}' is not classified as approved for mutation type '${request.mutationType}'.`,
      );
    }

    /**
     * Risk validation.
     */
    if (request.estimatedRisk > policy.maximumRiskLevel) {
      governanceWarnings.push("Mutation risk exceeded governance threshold.");

      return {
        approved: false,

        escalationRequired: true,

        reasoning: ["Mutation blocked due to excessive risk."],

        governanceWarnings,
      };
    }

    /**
     * Governance-sensitive region detection.
     */
    const governanceRegions =
      this.repositoryCognition.detectGovernanceRegions();

    if (governanceRegions.includes(request.targetRegion)) {
      governanceWarnings.push(
        "Governance-sensitive repository region detected.",
      );
    }

    /**
     * Approval reasoning.
     */
    reasoning.push(
      `Mutation '${request.mutationType}' approved for region '${request.targetRegion}'.`,
    );

    if (policy.requiresApproval) {
      reasoning.push("Administrative approval required before execution.");
    }

    return {
      approved: true,

      escalationRequired: policy.requiresApproval,

      reasoning,

      governanceWarnings,
    };
  }

  /**
   * Retrieve governance policies.
   */
  public getPolicies(): MutationGovernancePolicy[] {
    return this.policies;
  }

  /**
   * Detect protected repository regions.
   */
  public detectProtectedRegions(): string[] {
    return this.repositoryCognition.detectGovernanceRegions();
  }

  /**
   * Detect safe mutation regions.
   */
  public detectSafeRegions(): string[] {
    return this.repositoryCognition.detectSafeMutationRegions();
  }

  /**
   * Generate governance report.
   */
  public generateGovernanceReport(): string {
    return [
      "=== Mutation Governance Report ===",

      "",

      "Registered Policies:",

      ...this.policies.map((policy) => `- ${policy.mutationType}`),

      "",

      "Protected Regions:",

      ...this.detectProtectedRegions().map((region) => `- ${region}`),

      "",

      "Safe Mutation Regions:",

      ...this.detectSafeRegions().map((region) => `- ${region}`),
    ].join("\n");
  }
}
