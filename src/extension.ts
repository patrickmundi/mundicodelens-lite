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

// 🔥 FULL FUNCTION DETECTION
function getFullFunction(
	document: vscode.TextDocument,
	position: vscode.Position
): string {

	let startLine = position.line;
	let endLine = position.line;

	while (startLine > 0) {
		const text = document.lineAt(startLine).text.trim();

		if (
			text.startsWith("function") ||
			text.startsWith("async function") ||
			text.includes("=>") ||
			text.startsWith("const") ||
			text.startsWith("let")
		) {
			break;
		}

		startLine--;
	}

	let openBraces = 0;
	let foundOpening = false;

	for (let i = startLine; i < document.lineCount; i++) {
		const lineText = document.lineAt(i).text;

		if (lineText.includes("{")) {
			openBraces++;
			foundOpening = true;
		}

		if (lineText.includes("}")) {
			openBraces--;
		}

		if (foundOpening && openBraces === 0) {
			endLine = i;
			break;
		}
	}

	if (endLine < startLine) {
		endLine = position.line;
	}

	const range = new vscode.Range(startLine, 0, endLine, 1000);

	return document.getText(range);
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
						command: "mundicodelens-lite.helloWorld"
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
		async () => {

			try {
				const editor = vscode.window.activeTextEditor;

				if (!editor) {
					vscode.window.showErrorMessage('No active editor');
					return;
				}

				const position = editor.selection.active;
				const selectedText = getFullFunction(editor.document, position);

				if (!selectedText || selectedText.trim().length < 5) {
					vscode.window.showInformationMessage('No valid function detected');
					return;
				}

				vscode.window.setStatusBarMessage(
					'$(sync~spin) MundiCodeLens thinking...',
					2000
				);

				const aiResponse = await getAIResponse(selectedText);
				const cleanResponse = aiResponse.trim();

				console.log("🚀 FINAL RESPONSE TO UI:", cleanResponse);

				// 🔥 HYBRID LOGIC (ONLY CHANGE)
				if (cleanResponse.length < 500) {
					// 🔹 INLINE
					const formatted = formatExplanationAsComment(cleanResponse);
					const insertPosition = editor.selection.end;

					await editor.edit(editBuilder => {
						editBuilder.insert(insertPosition, "\n\n" + formatted + "\n");
					});

				} else {
					// 🔹 PANEL
					const panel = vscode.window.createWebviewPanel(
						'mundiCodeLensPanel',
						'MundiCodeLens Lite',
						vscode.ViewColumn.Beside,
						{ enableScripts: true }
					);

					panel.webview.html = getWebviewContent(
						context,
						cleanResponse,
						selectedText
					);
				}

			} catch (error: any) {
				console.error("🔥 EXTENSION ERROR:", error);

				vscode.window.showErrorMessage(
					`AI ERROR: ${error?.message || "Unknown error"}`
				);
			}
		}
	);

	context.subscriptions.push(disposable);

	const provider = new MundiCodeLensProvider();

	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(
			{ scheme: "file", language: "*" },
			provider
		)
	);
}

// 🔹 FORMATTER (already assumed in your system)
function formatExplanationAsComment(text: string): string {
	const lines = text.split("\n");
	return [
		"// 💡 MundiCodeLens Explanation",
		...lines.map(line => `// ${line}`)
	].join("\n");
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

	const safeResponse = response;

	html = html.replace(/{{code}}/g, safeCode);
	html = html.replace(/{{response}}/g, safeResponse);

	return html;
}

export function deactivate() {}