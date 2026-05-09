import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';
import { getFullFunction } from '../utils/parser';
import { showPanel } from '../utils/webview';

export function registerFixBugCommand(
	context: vscode.ExtensionContext
) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'mundicodelens-lite.fix',
			async () => {

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
					'$(sync~spin) Fixing code...',
					2000
				);

				try {

					const response = await getAIResponse(
						code,
						'fix',
						editor.document.languageId
					);

					showPanel(
						context,
						response,
						code,
						'fix'
					);

				} catch (error: any) {

					console.error(
						'🔥 FIX BUG ERROR:',
						error
					);

					vscode.window.showErrorMessage(
						`Fix Error: ${error?.message || 'Unknown error'}`
					);
				}
			}
		)
	);
}