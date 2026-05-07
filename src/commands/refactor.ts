import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { getWebviewContent } from '../utils/webview';

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

            const panel = vscode.window.createWebviewPanel(
                'mundiCodeLensPanel',
                'MundiCodeLens AI',
                vscode.ViewColumn.Beside,
                { enableScripts: true }
            );

            panel.webview.html = getWebviewContent(
                context,
                response,
                code
            );
        }
    );

    context.subscriptions.push(disposable);
}