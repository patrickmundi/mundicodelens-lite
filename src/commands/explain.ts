import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerExplainCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.explainCode',

            async () => {

                await runAICommand({

                    context,

                    action: 'explain',

                    panelMode: 'explain',

                    loadingMessage:
                        'MundiCodeLens thinking...'
                });
            }
        );

    context.subscriptions.push(
        disposable
    );
}