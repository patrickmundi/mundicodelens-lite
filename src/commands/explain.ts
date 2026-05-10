import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { buildProjectContext } from '../context/builders/projectContextBuilder';
import { formatPromptContext } from '../context/builders/promptContextFormatter';
import { getFullFunction } from '../utils/parser';
import { showPanel } from '../utils/webview';

export function registerExplainCommand(
	context: vscode.ExtensionContext
) {

	const disposable = vscode.commands.registerCommand(
		'mundicodelens-lite.helloWorld',
		async () => {

			try {

				const editor = vscode.window.activeTextEditor;

				if (!editor) {

					vscode.window.showErrorMessage(
						'No active editor'
					);

					return;
				}

				const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0];

				if (!workspaceFolder) {

					vscode.window.showErrorMessage(
						'No workspace folder found'
					);

					return;
				}

				const workspaceRoot = workspaceFolder.uri.fsPath;

				const position = editor.selection.active;

				const selectedText = getFullFunction(
					editor.document,
					position
				);

				if (
					!selectedText ||
					selectedText.trim().length < 5
				) {

					vscode.window.showInformationMessage(
						'No valid function detected'
					);

					return;
				}

				vscode.window.setStatusBarMessage(
					'$(sync~spin) MundiCodeLens thinking...',
					2000
				);

				const projectContext =
    buildProjectContext(
        workspaceRoot,
        editor.document.fileName
    );

				const formattedContext =
					formatPromptContext(
						projectContext
					);

				console.log(
					'🧠 FORMATTED CONTEXT:',
					formattedContext
				);

				const aiResponse = await getAIResponse(
					selectedText,
					'explain',
					editor.document.languageId,
					formattedContext
				);

				console.log(
					'🚀 FINAL RESPONSE TO UI:',
					aiResponse
				);

				// ✅ TEMPORARY STABILIZATION:
				// Show explanation in panel instead of
				// injecting comments into source code.

				showPanel(
					context,
					aiResponse,
					selectedText,
					'explain'
				);
			} catch (error: any) {

				console.error(
					'🔥 EXTENSION ERROR:',
					error
				);

				vscode.window.showErrorMessage(
					`AI ERROR: ${error?.message || 'Unknown error'}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}