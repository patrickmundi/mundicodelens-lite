import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerOptimizeCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.optimize',

            async () => {

                await runAICommand({

                    context,

                    action: 'optimize',

                    panelMode: 'optimize',

                    loadingMessage:
                        'Optimizing code...'
                });
            }
        );

    context.subscriptions.push(
        disposable
    );
}