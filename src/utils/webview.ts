import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// 🔹 HTML UI
export function getWebviewContent(
    context: vscode.ExtensionContext,
    response: string,
    code: string
): string {

    const filePath = path.join(
        context.extensionPath,
        'src',
        'webview',
        'panel.html'
    );

    console.log("WEBVIEW PATH:", filePath);

    let html: string;

    try {
        html = fs.readFileSync(filePath, 'utf8');
    } catch (err) {

        console.error("FILE READ ERROR:", err);

        return `
            <h2>File load failed</h2>
            <pre>${filePath}</pre>
        `;
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

// 🔹 Reusable Panel Function
export function showPanel(
    context: vscode.ExtensionContext,
    response: string,
    code: string
) {

    const panel = vscode.window.createWebviewPanel(
        'mundiCodeLensPanel',
        'MundiCodeLens AI',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    panel.webview.html = getWebviewContent(
        context,
        response,
        code
    );
}