import {
  AutonomousEngineeringJudgmentService,
  EngineeringJudgmentDecision,
} from "../../reasoning/services/autonomous-engineering-judgment-service";

import { AutonomousMutationPlan } from "./autonomous-mutation-planning-service";

export interface WorkflowCheckpoint {
  checkpointId: string;

  workflowId: string;

  phase: string;

  timestamp: number;

  status: "ACTIVE" | "COMPLETED" | "FAILED";

  notes: string;
}

export interface AutonomousWorkflowExecution {
  workflowId: string;

  startedAt: number;

  completedAt?: number;

  activePhase: string;

  completedPhases: string[];

  failedPhases: string[];

  checkpoints: WorkflowCheckpoint[];

  judgmentDecision?: EngineeringJudgmentDecision;

  executionState: "RUNNING" | "COMPLETED" | "FAILED" | "PAUSED";
}

export class AutonomousEngineeringWorkflowService {
  private readonly workflows: Map<string, AutonomousWorkflowExecution> =
    new Map();

  constructor(
    private readonly judgmentService: AutonomousEngineeringJudgmentService,
  ) {}

  /**
   * Start autonomous workflow.
   */
  public startWorkflow(
    plans: AutonomousMutationPlan[],
  ): AutonomousWorkflowExecution {
    const decision = this.judgmentService.evaluateExecutionCandidates(plans);

    const workflowId = `workflow-${Date.now()}`;

    const workflow: AutonomousWorkflowExecution = {
      workflowId,

      startedAt: Date.now(),

      activePhase: "INITIALIZATION",

      completedPhases: [],

      failedPhases: [],

      checkpoints: [],

      judgmentDecision: decision,

      executionState: "RUNNING",
    };

    this.workflows.set(workflowId, workflow);

    /**
     * Initial checkpoint.
     */
    this.createCheckpoint(
      workflow,
      "INITIALIZATION",
      "ACTIVE",
      "Workflow initialized.",
    );

    console.log(`[Workflow] Started workflow '${workflowId}'.`);

    return workflow;
  }

  /**
   * Advance workflow phase.
   */
  public advancePhase(
    workflowId: string,

    nextPhase: string,
  ): void {
    const workflow = this.requireWorkflow(workflowId);

    workflow.completedPhases.push(workflow.activePhase);

    workflow.activePhase = nextPhase;

    this.createCheckpoint(
      workflow,
      nextPhase,
      "ACTIVE",
      `Advanced to phase '${nextPhase}'.`,
    );

    console.log(`[Workflow] Advanced '${workflowId}' to '${nextPhase}'.`);
  }

  /**
   * Pause workflow.
   */
  public pauseWorkflow(workflowId: string): void {
    const workflow = this.requireWorkflow(workflowId);

    workflow.executionState = "PAUSED";

    this.createCheckpoint(
      workflow,
      workflow.activePhase,
      "FAILED",
      "Workflow paused.",
    );

    console.warn(`[Workflow] Paused '${workflowId}'.`);
  }

  /**
   * Resume workflow.
   */
  public resumeWorkflow(workflowId: string): void {
    const workflow = this.requireWorkflow(workflowId);

    workflow.executionState = "RUNNING";

    this.createCheckpoint(
      workflow,
      workflow.activePhase,
      "ACTIVE",
      "Workflow resumed.",
    );

    console.log(`[Workflow] Resumed '${workflowId}'.`);
  }

  /**
   * Complete workflow.
   */
  public completeWorkflow(workflowId: string): void {
    const workflow = this.requireWorkflow(workflowId);

    workflow.executionState = "COMPLETED";

    workflow.completedAt = Date.now();

    this.createCheckpoint(
      workflow,
      workflow.activePhase,
      "COMPLETED",
      "Workflow completed successfully.",
    );

    console.log(`[Workflow] Completed '${workflowId}'.`);
  }

  /**
   * Mark workflow phase failure.
   */
  public failPhase(
    workflowId: string,

    failedPhase: string,

    reason: string,
  ): void {
    const workflow = this.requireWorkflow(workflowId);

    workflow.failedPhases.push(failedPhase);

    workflow.executionState = "FAILED";

    this.createCheckpoint(workflow, failedPhase, "FAILED", reason);

    console.error(`[Workflow] Phase '${failedPhase}' failed.`);
  }

  /**
   * Create workflow checkpoint.
   */
  private createCheckpoint(
    workflow: AutonomousWorkflowExecution,

    phase: string,

    status: "ACTIVE" | "COMPLETED" | "FAILED",

    notes: string,
  ): void {
    workflow.checkpoints.push({
      checkpointId: `checkpoint-${Date.now()}`,

      workflowId: workflow.workflowId,

      phase,

      timestamp: Date.now(),

      status,

      notes,
    });
  }

  /**
   * Retrieve workflow.
   */
  public getWorkflow(
    workflowId: string,
  ): AutonomousWorkflowExecution | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Require workflow existence.
   */
  private requireWorkflow(workflowId: string): AutonomousWorkflowExecution {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found.`);
    }

    return workflow;
  }

  /**
   * Generate workflow report.
   */
  public generateWorkflowReport(workflowId: string): string {
    const workflow = this.requireWorkflow(workflowId);

    return [
      "=== Autonomous Engineering Workflow Report ===",

      "",

      `Workflow ID: ${workflow.workflowId}`,

      `Execution State: ${workflow.executionState}`,

      `Active Phase: ${workflow.activePhase}`,

      "",

      "Completed Phases:",

      ...workflow.completedPhases.map((phase) => `- ${phase}`),

      "",

      "Failed Phases:",

      ...workflow.failedPhases.map((phase) => `- ${phase}`),

      "",

      "Checkpoints:",

      ...workflow.checkpoints.map(
        (checkpoint) => `- [${checkpoint.status}] ${checkpoint.phase}`,
      ),
    ].join("\n");
  }
}
