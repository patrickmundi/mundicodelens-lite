import * as path from "path";

import {
  buildProjectContext
} from "../context/builders/projectContextBuilder";

const workspaceRoot = path.resolve(
  __dirname,
  "../../../MundiSaaS"
);

const targetFile = path.join(
  workspaceRoot,
  "backend/finance/models.py"
);

try {

  const context = buildProjectContext(
    workspaceRoot,
    targetFile
  );

  console.log("\n=== PROJECT CONTEXT ===\n");

  console.log(
    JSON.stringify(context, null, 2)
  );

} catch (error) {

  console.error(
    "Project context test failed:",
    error
  );

}