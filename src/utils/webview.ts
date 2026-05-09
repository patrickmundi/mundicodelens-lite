import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// 🔹 Singleton Panel
let currentPanel: vscode.WebviewPanel | undefined;

// 🔹 HTML UI
export function getWebviewContent(
	context: vscode.ExtensionContext,
	response: string,
	code: string,
	mode: string
): string {

	const filePath = path.join(
		context.extensionPath,
		'src',
		'webview',
		'panel.html'
	);

	console.log(
		'WEBVIEW PATH:',
		filePath
	);

	let html: string;

	try {

		html = fs.readFileSync(
			filePath,
			'utf8'
		);

	}
	catch (err) {

		console.error(
			'FILE READ ERROR:',
			err
		);

		return `
			<h2>File load failed</h2>
			<pre>${filePath}</pre>
		`;
	}

	// 🔹 Dynamic Panel Titles
	let panelTitle =
		'🧠 AI Response';

	if (mode === 'explain') {

		panelTitle =
			'💡 Code Explanation';
	}

	else if (
		mode === 'explainFull'
	) {

		panelTitle =
			'📘 Deep Explanation';
	}

	else if (
		mode === 'refactor'
	) {

		panelTitle =
			'✨ Refactor Suggestions';
	}

	else if (
		mode === 'fix'
	) {

		panelTitle =
			'🐞 Bug Analysis';
	}

	else if (
		mode === 'optimize'
	) {

		panelTitle =
			'⚡ Optimization Review';
	}

	// 🔹 Dynamic Subtitles
	let panelSubtitle =
		'AI-assisted development workflow';

	if (mode === 'explain') {

		panelSubtitle =
			'Quick conceptual explanation of the selected code.';
	}

	else if (
		mode === 'explainFull'
	) {

		panelSubtitle =
			'Deep walkthrough with educational breakdown and logic analysis.';
	}

	else if (
		mode === 'refactor'
	) {

		panelSubtitle =
			'Code structure and readability improvement suggestions.';
	}

	else if (
		mode === 'fix'
	) {

		panelSubtitle =
			'Potential issue detection and correction analysis.';
	}

	else if (
		mode === 'optimize'
	) {

		panelSubtitle =
			'Performance and readability optimization review.';
	}

	// 🔹 Escape code safely
	const safeCode = code
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	// 🔹 Render markdown response
	const safeResponse =
		md.render(response);

	html = html.replace(
		/{{code}}/g,
		safeCode
	);

	html = html.replace(
		/{{response}}/g,
		safeResponse
	);

	html = html.replace(
		/{{panelTitle}}/g,
		panelTitle
	);

	html = html.replace(
		/{{panelSubtitle}}/g,
		panelSubtitle
	);

	return html;
}

// 🔹 Reusable Panel Function
export function showPanel(
	context: vscode.ExtensionContext,
	response: string,
	code: string,
	mode: string
) {

	// ✅ Reuse existing panel
	if (currentPanel) {

		currentPanel.reveal(
			vscode.ViewColumn.Beside
		);

		currentPanel.webview.html =
			getWebviewContent(
				context,
				response,
				code,
				mode
			);

		return;
	}

	// ✅ Create new panel only once
	currentPanel =
		vscode.window.createWebviewPanel(
			'mundiCodeLensPanel',
			'MundiCodeLens AI',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true
			}
		);

	currentPanel.webview.html =
		getWebviewContent(
			context,
			response,
			code,
			mode
		);

	// ✅ Cleanup when closed
	currentPanel.onDidDispose(() => {

		currentPanel = undefined;

	});
}