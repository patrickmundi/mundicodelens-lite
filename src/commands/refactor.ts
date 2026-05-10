import * as vscode from 'vscode';

import { runAICommand } from '../core/runAICommand';

export function registerRefactorCommand(
    context: vscode.ExtensionContext
) {

    const disposable =
        vscode.commands.registerCommand(
            'mundicodelens-lite.refactorCode',

            async () => {

                await runAICommand(
                    context,
                    'refactor'
                );
            }
        );

    context.subscriptions.push(disposable);
}