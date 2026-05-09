import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { getWebviewContent, showPanel } from '../utils/webview';

export function registerRefactorCommand(
    context: vscode.ExtensionContext
) {

    const disposable = vscode.commands.registerCommand(
        'mundicodelens-lite.refactor',

        async () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return;
            }

            const code = getFullFunction(
                editor.document,
                editor.selection.active
            );

            const response = await getAIResponse(
                code,
                "refactor",
                editor.document.languageId
            );

            showPanel(
                context,
                response,
                code,
                'refactor'
            );
        }
    );

    context.subscriptions.push(disposable);
}