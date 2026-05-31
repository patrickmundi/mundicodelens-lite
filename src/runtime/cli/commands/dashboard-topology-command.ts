import { DjangoRepositoryCognitionService } from "../../reasoning/services/django-repository-cognition-service";

import { DashboardTopologyInferenceService } from "../../reasoning/services/dashboard-topology-inference-service";

export interface DashboardTopologyCommandOptions {
  rootPath: string;
}

export async function runDashboardTopologyCommand(
  options: DashboardTopologyCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running dashboard topology inference...\n");

  /**
   * Django cognition.
   */
  const djangoCognition = new DjangoRepositoryCognitionService();

  const cognitionResult = djangoCognition.analyzeRepository(options.rootPath);

  if (!cognitionResult.success) {
    console.log("[MundiCodeLens CLI] Django cognition failed.\n");

    console.log(cognitionResult.error);

    return;
  }

  /**
   * Dashboard inference.
   */
  const topologyInference = new DashboardTopologyInferenceService();

  const topologyResult = topologyInference.inferTopology(
    cognitionResult.topology,
  );

  /**
   * Print dashboard report.
   */
  console.log(topologyInference.generateTopologyReport(topologyResult));

  console.log(
    "\n[MundiCodeLens CLI] Dashboard topology inference completed.\n",
  );
}
