import { DjangoRepositoryCognitionService } from "../../reasoning/services/django-repository-cognition-service";

export interface DjangoCognitionCommandOptions {
  rootPath: string;
}

export async function runDjangoCognitionCommand(
  options: DjangoCognitionCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running Django repository cognition...\n");

  const cognitionService = new DjangoRepositoryCognitionService();

  /**
   * Analyze repository.
   */
  const result = cognitionService.analyzeRepository(options.rootPath);

  /**
   * Print cognition report.
   */
  console.log(cognitionService.generateCognitionReport(result));

  console.log("\n[MundiCodeLens CLI] Django repository cognition completed.\n");
}
