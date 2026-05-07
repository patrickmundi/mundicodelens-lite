import * as vscode from 'vscode';
import { showPanel } from './utils/webview';
import { MundiCodeLensProvider } from './providers/CodeLensProvider';
import { getAIResponse } from './ai/openai';
import { getFullFunction } from './utils/parser';

// ✅ NEW IMPORT
import { registerExplainCommand } from './commands/explain';
import { registerRefactorCommand } from './commands/refactor';

// 🔹 Extension Activation
export function activate(context: vscode.ExtensionContext) {
	console.log("🚨 ACTIVATE STARTED 🚨");

	// ✅ NEW
	registerExplainCommand(context);
	registerRefactorCommand(context);
	// 🐞 FIX COMMAND
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'mundicodelens-lite.fix',
			async () => {

				const editor = vscode.window.activeTextEditor;
				if (!editor) return;

				const code = getFullFunction(
					editor.document,
					editor.selection.active
				);

				const response = await getAIResponse(
					code,
					"fix",
					editor.document.languageId
				);

				showPanel(context, response, code);
			}
		)
	);

	// ⚡ OPTIMIZE COMMAND
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'mundicodelens-lite.optimize',
			async () => {

				const editor = vscode.window.activeTextEditor;
				if (!editor) return;

				const code = getFullFunction(
					editor.document,
					editor.selection.active
				);

				const response = await getAIResponse(
					code,
					"optimize",
					editor.document.languageId
				);

				showPanel(context, response, code);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'mundicodelens-lite.explainFull',
			async () => {

				try {
					const editor = vscode.window.activeTextEditor;
					if (!editor) return;

					const position = editor.selection.active;
					const selectedText = getFullFunction(editor.document, position);

					if (!selectedText) return;

					vscode.window.setStatusBarMessage(
						'$(sync~spin) Loading full explanation...',
						2000
					);

					const aiResponse = await getAIResponse(
						selectedText,
						"explain",
						editor.document.languageId
					);

					showPanel(context, aiResponse, selectedText);

				} catch (error: any) {
					console.error("🔥 FULL PANEL ERROR:", error);

					vscode.window.showErrorMessage(
						`Full Explanation Error: ${error?.message || "Unknown error"}`
					);
				}
			}
		)
	);

	const provider = new MundiCodeLensProvider();

	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(
			{ scheme: "file", language: "*" },
			provider
		)
	);
}




export function deactivate() {}