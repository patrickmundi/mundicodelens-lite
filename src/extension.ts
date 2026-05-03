import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// 🔥 Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// 🔍 DEBUG
console.log("ENV PATH:", envPath);
console.log("API KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

// 🔹 OpenAI singleton
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY is missing");
	}

	if (!openaiInstance) {
		openaiInstance = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}

	return openaiInstance;
}

// 🔹 AI Function
async function getAIResponse(code: string): Promise<string> {
	try {
		const openai = getOpenAI();

		const response = await openai.responses.create({
			model: "gpt-4.1-mini",
			input: `Explain this code clearly:\n\n${code}`,
		});

		console.log("✅ FULL RESPONSE:", JSON.stringify(response, null, 2));

		const text =
			(response as any).output_text ||
			(response as any).output?.[0]?.content?.[0]?.text ||
			"⚠️ No response from AI";

		console.log("✅ AI TEXT:", text);

		return text;

	} catch (error: any) {
		console.error("🔥 AI ERROR FULL:", error);
		console.error("🔥 MESSAGE:", error?.message);
		console.error("🔥 STACK:", error?.stack);

		return `❌ AI ERROR:\n\n${error?.message || "Unknown error"}`;
	}
}

// 🔥 CodeLens Provider
class MundiCodeLensProvider implements vscode.CodeLensProvider {
	provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
		const lenses: vscode.CodeLens[] = [];

		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i);

			if (
				line.text.includes("function") ||
				line.text.includes("=>") ||
				line.text.includes("const")
			) {
				const range = new vscode.Range(i, 0, i, 0);

				lenses.push(
					new vscode.CodeLens(range, {
						title: "💡 Explain Code",
						command: "mundicodelens-lite.helloWorld",
						arguments: [document, i] // 🔥 PASS CONTEXT
					})
				);
			}
		}

		return lenses;
	}
}

// 🔹 Extension Activation
export function activate(context: vscode.ExtensionContext) {
	console.log("🚨 ACTIVATE STARTED 🚨");

	const disposable = vscode.commands.registerCommand(
		'mundicodelens-lite.helloWorld',
		async (doc?: vscode.TextDocument, lineNumber?: number) => {

			try {
				let codeToExplain = "";

				// 🔥 If triggered from CodeLens
				if (doc && typeof lineNumber === "number") {
					codeToExplain = doc.lineAt(lineNumber).text;
				}
				// 🔥 If triggered manually (fallback)
				else {
					const editor = vscode.window.activeTextEditor;

					if (!editor) {
						vscode.window.showErrorMessage('No active editor');
						return;
					}

					codeToExplain = editor.document.getText(editor.selection);
				}

				if (!codeToExplain || codeToExplain.trim() === "") {
					vscode.window.showInformationMessage('No code to explain');
					return;
				}

				vscode.window.setStatusBarMessage(
					'$(sync~spin) MundiCodeLens thinking...',
					2000
				);

				const aiResponse = await getAIResponse(codeToExplain);
				const cleanResponse = aiResponse.trim();

				console.log("🚀 FINAL RESPONSE TO UI:", cleanResponse);

				const panel = vscode.window.createWebviewPanel(
					'mundiCodeLensPanel',
					'MundiCodeLens Lite',
					vscode.ViewColumn.Beside,
					{ enableScripts: true }
				);

				panel.webview.html = getWebviewContent(
					context,
					cleanResponse,
					codeToExplain
				);

			} catch (error: any) {
				console.error("🔥 EXTENSION ERROR:", error);

				vscode.window.showErrorMessage(
					`AI ERROR: ${error?.message || "Unknown error"}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);

	// 🔥 Register CodeLens
	const provider = new MundiCodeLensProvider();

	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(
			{ scheme: "file", language: "*" },
			provider
		)
	);
}

// 🔹 HTML UI
function getWebviewContent(
	context: vscode.ExtensionContext,
	response: string,
	code: string
): string {

	const filePath = path.join(context.extensionPath, 'src', 'webview.html');

	console.log("WEBVIEW PATH:", filePath);

	let html: string;

	try {
		html = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		console.error("FILE READ ERROR:", err);
		return `<h2>File load failed</h2><pre>${filePath}</pre>`;
	}

	const safeCode = code
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	const safeResponse = response
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	html = html.replace(/{{code}}/g, safeCode);
	html = html.replace(/{{response}}/g, safeResponse);

	return html;
}

export function deactivate() {}