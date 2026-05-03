import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// 🔥 Force correct .env loading
dotenv.config({
	path: path.resolve(__dirname, '../.env')
});

console.log("API KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

// 🔹 AI function (real OpenAI integration)

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(code: string): Promise<string> {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content: `
You are a senior software engineer.

Explain the code clearly and concisely.

Rules:
- Use bullet points
- Be short and precise
- No unnecessary introductions
- Focus on what the code does
- Mention key concepts (loop, condition, function, etc.)
`
			},
			{
				role: "user",
				content: `Explain this code:\n\n${code}`
			}
		],
	});

	return response.choices[0].message.content || "No response from AI";
}

export function activate(context: vscode.ExtensionContext) {
	console.log("🚨 ACTIVATE STARTED 🚨");
	console.log("🔥 MundiCodeLens activate() fired");
  	console.log("API KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

	const disposable = vscode.commands.registerCommand(
		'mundicodelens-lite.helloWorld',
		async () => {

			console.log("Command triggered");

			try {
				const editor = vscode.window.activeTextEditor;

				if (!editor) {
					vscode.window.showErrorMessage('No active editor');
					return;
				}

				const selectedText = editor.document.getText(editor.selection);

				if (!selectedText) {
					vscode.window.showInformationMessage('No text selected');
					return;
				}

				// 🔥 STATUS FEEDBACK
				vscode.window.setStatusBarMessage('$(sync~spin) MundiCodeLens thinking...', 2000);

				const aiResponse = await getAIResponse(selectedText);

				const cleanResponse = aiResponse.trim();

				const panel = vscode.window.createWebviewPanel(
					'mundiCodeLensPanel',
					'MundiCodeLens Lite',
					vscode.ViewColumn.Beside,
					{}
				);

				panel.webview.html = getWebviewContent(
					context,
					cleanResponse,
					selectedText
				);

			} catch (error: any) {
				vscode.window.showErrorMessage(
					'AI request failed: ' + (error.message || 'Unknown error')
				);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// 🔹 HTML UI (separated file approach)
function getWebviewContent(context: vscode.ExtensionContext, response: string, code: string): string {
	const filePath = path.join(context.extensionPath, 'src', 'webview.html');

	let html = fs.readFileSync(filePath, 'utf8');

	html = html.replace('{{response}}', response);
	html = html.replace('{{code}}', code);

	return html;
}

export function deactivate() {}