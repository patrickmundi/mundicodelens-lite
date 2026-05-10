import * as path from "path";

import { scanWorkspace } from "../context/scanner/workspaceScanner";

const workspaceRoot = path.resolve(
  __dirname,
  "../../../MundiSaaS/"
);

try {

  const result = scanWorkspace(workspaceRoot);

  console.log("\n=== WORKSPACE SCAN RESULT ===\n");

  console.log("Detected Domains:\n");

  console.log(result.domains);

  console.log("\n=== FILE CLASSIFICATIONS ===\n");

  for (const classification of result.classifications) {

    console.log(
      `${classification.filePath} -> ${classification.domain}`
    );
  }

  console.log("\n=== TOTAL FILES ===\n");

  console.log(result.files.length);

} catch (error) {

  console.error(
    "Scanner test failed:",
    error
  );
}