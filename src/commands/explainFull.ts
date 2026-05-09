import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { showPanel } from '../utils/webview';


export function registerExplainFullCommand(
	context: vscode.ExtensionContext
) {

	const disposable = vscode.commands.registerCommand(
		'mundicodelens-lite.explainFull',

		async () => {

			try {

				const editor = vscode.window.activeTextEditor;

				if (!editor) {
					return;
				}

				const position = editor.selection.active;

				const selectedText = getFullFunction(
					editor.document,
					position
				);

				if (!selectedText) {
					return;
				}

				vscode.window.setStatusBarMessage(
					'$(sync~spin) Loading full explanation...',
					2000
				);

				const aiResponse = await getAIResponse(
					selectedText,
					"deepExplain",
					editor.document.languageId
				);

				showPanel(
					context,
					aiResponse,
					selectedText,
					'explainFull'
				);

			}
			catch (error: any) {

				console.error(
					"🔥 FULL PANEL ERROR:",
					error
				);

				vscode.window.showErrorMessage(
					`Full Explanation Error: ${
						error?.message || "Unknown error"
					}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}