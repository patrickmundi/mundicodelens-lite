import * as vscode from "vscode";

import { runAICommand } from "../core/runAICommand";

export function registerImplementCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "mundicodelens-lite.implement",

    async () => {
      await runAICommand({
        context,

        action: "implement",

        panelMode: "implement",

        loadingMessage: "MundiCodeLens implementing feature...",
      });
    },
  );

  context.subscriptions.push(disposable);
}
