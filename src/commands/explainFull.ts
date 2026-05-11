import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerExplainFullCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.explainFull',

            async () => {

                await runAICommand({

                    context,

                    action: 'deepExplain',

                    panelMode: 'explainFull',

                    loadingMessage:
                        'Loading full explanation...'
                });
            }
        );

    context.subscriptions.push(
        disposable
    );
}