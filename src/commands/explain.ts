import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { formatExplanationAsComment } from '../utils/formatter';

export function registerExplainCommand(
	context: vscode.ExtensionContext
) {

	const disposable = vscode.commands.registerCommand(
		'mundicodelens-lite.helloWorld',
		async () => {

			try {
				const editor = vscode.window.activeTextEditor;

				if (!editor) {
					vscode.window.showErrorMessage('No active editor');
					return;
				}

				const position = editor.selection.active;

				const selectedText = getFullFunction(
					editor.document,
					position
				);

				if (!selectedText || selectedText.trim().length < 5) {
					vscode.window.showInformationMessage(
						'No valid function detected'
					);
					return;
				}

				vscode.window.setStatusBarMessage(
					'$(sync~spin) MundiCodeLens thinking...',
					2000
				);

				const aiResponse = await getAIResponse(
					selectedText,
					"explain",
					editor.document.languageId
				);

				const cleanResponse = aiResponse.trim();

				console.log(
					"🚀 FINAL RESPONSE TO UI:",
					cleanResponse
				);

				const formatted = formatExplanationAsComment(
					cleanResponse,
					editor.document.languageId
				);

				const insertPosition = editor.selection.end;

				await editor.edit(editBuilder => {
					editBuilder.insert(
						insertPosition,
						"\n\n" + formatted + "\n"
					);
				});

			} catch (error: any) {

				console.error(
					"🔥 EXTENSION ERROR:",
					error
				);

				vscode.window.showErrorMessage(
					`AI ERROR: ${error?.message || "Unknown error"}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}