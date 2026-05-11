import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerFixBugCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.fix',

            async () => {

                await runAICommand({

                    context,

                    action: 'fix',

                    panelMode: 'fix',

                    loadingMessage:
                        'Fixing code...'
                });
            }
        );

    context.subscriptions.push(
        disposable
    );
}