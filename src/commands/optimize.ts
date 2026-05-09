import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { showPanel } from '../utils/webview';

export function registerOptimizeCommand(
	context: vscode.ExtensionContext
) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'mundicodelens-lite.optimize',
			async () => {

				try {

					const editor = vscode.window.activeTextEditor;

					if (!editor) {
						return;
					}

					const code = getFullFunction(
						editor.document,
						editor.selection.active
					);

					if (!code) {
						return;
					}

					vscode.window.setStatusBarMessage(
						'$(sync~spin) Optimizing code...',
						2000
					);

					const response = await getAIResponse(
						code,
						'optimize',
						editor.document.languageId
					);

					showPanel(
						context,
						response,
						code,
						'optimize'
					);

				} catch (error: any) {

					console.error(
						'🔥 OPTIMIZE ERROR:',
						error
					);

					vscode.window.showErrorMessage(
						`Optimize Error: ${error?.message || 'Unknown error'}`
					);
				}
			}
		)
	);
}