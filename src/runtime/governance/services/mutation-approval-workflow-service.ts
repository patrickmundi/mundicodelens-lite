export type MutationApprovalStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXECUTED"
  | "ROLLED_BACK";

export interface MutationApprovalReviewer {
  reviewerId: string;

  reviewerName: string;

  approvedAt?: number;

  rejectedAt?: number;

  comments?: string;
}

export interface MutationApprovalRequest {
  requestId: string;

  mutationId: string;

  repositoryPath: string;

  requestedAt: number;

  requestedBy: string;

  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  summary: string;

  affectedFiles: string[];

  rollbackSupported: boolean;

  status: MutationApprovalStatus;

  reviewers: MutationApprovalReviewer[];

  governanceNotes: string[];

  executionAuthorized: boolean;
}

export interface MutationApprovalDecisionResult {
  success: boolean;

  request: MutationApprovalRequest;

  diagnostics: string[];

  error?: string;
}

export interface MutationApprovalAuditRecord {
  auditId: string;

  requestId: string;

  action: "CREATED" | "APPROVED" | "REJECTED" | "EXECUTED" | "ROLLED_BACK";

  actor: string;

  timestamp: number;

  notes?: string;
}

export class MutationApprovalWorkflowService {
  private readonly approvalRequests: MutationApprovalRequest[] = [];

  private readonly auditTrail: MutationApprovalAuditRecord[] = [];

  /**
   * Create approval request.
   */
  public createApprovalRequest(
    request: Omit<
      MutationApprovalRequest,
      "requestId" | "requestedAt" | "status" | "executionAuthorized"
    >,
  ): MutationApprovalDecisionResult {
    const diagnostics: string[] = [];

    try {
      diagnostics.push("Creating mutation approval request.");

      const approvalRequest: MutationApprovalRequest = {
        ...request,

        requestId: `approval-${Date.now()}`,

        requestedAt: Date.now(),

        status: "PENDING_APPROVAL",

        executionAuthorized: false,
      };

      /**
       * Governance checks.
       */
      if (
        approvalRequest.riskLevel === "HIGH" &&
        !approvalRequest.rollbackSupported
      ) {
        approvalRequest.governanceNotes.push(
          "High-risk mutations must support rollback recovery.",
        );
      }

      approvalRequest.governanceNotes.push(
        `Approval workflow initialized with '${approvalRequest.riskLevel}' governance risk.`,
      );

      this.approvalRequests.push(approvalRequest);

      this.recordAuditEvent({
        requestId: approvalRequest.requestId,

        action: "CREATED",

        actor: approvalRequest.requestedBy,

        notes: "Mutation approval request created.",
      });

      diagnostics.push(
        `Approval request '${approvalRequest.requestId}' created successfully.`,
      );

      return {
        success: true,

        request: approvalRequest,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        request: this.buildFallbackRequest(),

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown approval workflow failure.",
      };
    }
  }

  /**
   * Approve mutation request.
   */
  public approveRequest(
    requestId: string,

    reviewer: MutationApprovalReviewer,
  ): MutationApprovalDecisionResult {
    const diagnostics: string[] = [];

    const request = this.approvalRequests.find(
      (entry) => entry.requestId === requestId,
    );

    if (!request) {
      return {
        success: false,

        request: this.buildFallbackRequest(),

        diagnostics,

        error: "Approval request not found.",
      };
    }

    diagnostics.push(`Approving mutation request '${requestId}'.`);

    reviewer.approvedAt = Date.now();

    request.reviewers.push(reviewer);

    request.status = "APPROVED";

    request.executionAuthorized = true;

    request.governanceNotes.push(`Approved by '${reviewer.reviewerName}'.`);

    this.recordAuditEvent({
      requestId,

      action: "APPROVED",

      actor: reviewer.reviewerName,

      notes: reviewer.comments,
    });

    diagnostics.push("Mutation approval completed successfully.");

    return {
      success: true,

      request,

      diagnostics,
    };
  }

  /**
   * Reject mutation request.
   */
  public rejectRequest(
    requestId: string,

    reviewer: MutationApprovalReviewer,
  ): MutationApprovalDecisionResult {
    const diagnostics: string[] = [];

    const request = this.approvalRequests.find(
      (entry) => entry.requestId === requestId,
    );

    if (!request) {
      return {
        success: false,

        request: this.buildFallbackRequest(),

        diagnostics,

        error: "Approval request not found.",
      };
    }

    diagnostics.push(`Rejecting mutation request '${requestId}'.`);

    reviewer.rejectedAt = Date.now();

    request.reviewers.push(reviewer);

    request.status = "REJECTED";

    request.executionAuthorized = false;

    request.governanceNotes.push(`Rejected by '${reviewer.reviewerName}'.`);

    this.recordAuditEvent({
      requestId,

      action: "REJECTED",

      actor: reviewer.reviewerName,

      notes: reviewer.comments,
    });

    diagnostics.push("Mutation rejection workflow completed successfully.");

    return {
      success: true,

      request,

      diagnostics,
    };
  }

  /**
   * Mark request executed.
   */
  public markExecuted(
    requestId: string,

    actor: string,
  ): MutationApprovalDecisionResult {
    const diagnostics: string[] = [];

    const request = this.approvalRequests.find(
      (entry) => entry.requestId === requestId,
    );

    if (!request) {
      return {
        success: false,

        request: this.buildFallbackRequest(),

        diagnostics,

        error: "Approval request not found.",
      };
    }

    if (!request.executionAuthorized) {
      return {
        success: false,

        request,

        diagnostics,

        error: "Mutation execution not authorized.",
      };
    }

    request.status = "EXECUTED";

    request.governanceNotes.push(`Mutation executed by '${actor}'.`);

    this.recordAuditEvent({
      requestId,

      action: "EXECUTED",

      actor,

      notes: "Mutation execution authorized and completed.",
    });

    diagnostics.push("Mutation execution marked successfully.");

    return {
      success: true,

      request,

      diagnostics,
    };
  }

  /**
   * Mark rollback.
   */
  public markRolledBack(
    requestId: string,

    actor: string,
  ): MutationApprovalDecisionResult {
    const diagnostics: string[] = [];

    const request = this.approvalRequests.find(
      (entry) => entry.requestId === requestId,
    );

    if (!request) {
      return {
        success: false,

        request: this.buildFallbackRequest(),

        diagnostics,

        error: "Approval request not found.",
      };
    }

    request.status = "ROLLED_BACK";

    request.governanceNotes.push(`Mutation rollback executed by '${actor}'.`);

    this.recordAuditEvent({
      requestId,

      action: "ROLLED_BACK",

      actor,

      notes: "Repository rollback completed.",
    });

    diagnostics.push("Rollback workflow completed successfully.");

    return {
      success: true,

      request,

      diagnostics,
    };
  }

  /**
   * Retrieve approval requests.
   */
  public getApprovalRequests(): MutationApprovalRequest[] {
    return this.approvalRequests;
  }

  /**
   * Retrieve audit trail.
   */
  public getAuditTrail(): MutationApprovalAuditRecord[] {
    return this.auditTrail;
  }

  /**
   * Record governance audit event.
   */
  private recordAuditEvent(event: {
    requestId: string;

    action: "CREATED" | "APPROVED" | "REJECTED" | "EXECUTED" | "ROLLED_BACK";

    actor: string;

    notes?: string;
  }): void {
    this.auditTrail.push({
      auditId: `audit-${Date.now()}`,

      requestId: event.requestId,

      action: event.action,

      actor: event.actor,

      timestamp: Date.now(),

      notes: event.notes,
    });
  }

  /**
   * Build fallback request.
   */
  private buildFallbackRequest(): MutationApprovalRequest {
    return {
      requestId: "fallback-request",

      mutationId: "unknown",

      repositoryPath: "unknown",

      requestedAt: Date.now(),

      requestedBy: "system",

      riskLevel: "LOW",

      summary: "Fallback approval request.",

      affectedFiles: [],

      rollbackSupported: false,

      status: "REJECTED",

      reviewers: [],

      governanceNotes: [],

      executionAuthorized: false,
    };
  }

  /**
   * Generate governance approval report.
   */
  public generateApprovalReport(request: MutationApprovalRequest): string {
    return [
      "=== Mutation Approval Workflow Report ===",

      "",

      `Request ID: ${request.requestId}`,

      `Mutation ID: ${request.mutationId}`,

      `Status: ${request.status}`,

      `Risk Level: ${request.riskLevel}`,

      `Execution Authorized: ${request.executionAuthorized}`,

      "",

      "Affected Files:",

      ...request.affectedFiles.map((file) => `- ${file}`),

      "",

      "Governance Notes:",

      ...request.governanceNotes.map((note) => `- ${note}`),

      "",

      "Reviewers:",

      ...request.reviewers.map((reviewer) => `- ${reviewer.reviewerName}`),
    ].join("\n");
  }
}
