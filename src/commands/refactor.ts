import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerRefactorCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.refactor',

            async () => {

                await runAICommand({

                    context,

                    action: 'refactor',

                    panelMode: 'refactor',

                    loadingMessage:
                        'Refactoring code...'
                });
            }
        );

    context.subscriptions.push(
        disposable
    );
}