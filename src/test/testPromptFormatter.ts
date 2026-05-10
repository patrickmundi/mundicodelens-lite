import * as path from "path";

import {
  buildProjectContext
} from "../context/builders/projectContextBuilder";

import {
  formatPromptContext
} from "../context/builders/promptContextFormatter";

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

  const formatted =
    formatPromptContext(context);

  console.log(
    "\n=== FORMATTED PROMPT CONTEXT ===\n"
  );

  console.log(formatted);

} catch (error) {

  console.error(
    "Prompt formatter test failed:",
    error
  );
}