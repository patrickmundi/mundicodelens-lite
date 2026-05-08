import * as vscode from 'vscode';

// 🔥 FULL FUNCTION DETECTION (UPGRADED — MULTI-LANGUAGE)
export function getFullFunction(
    document: vscode.TextDocument,
    position: vscode.Position
): string {

    let startLine = position.line;
    let endLine = position.line;

    // 🔍 STEP 1 — Find start (multi-language)
    while (startLine > 0) {
        const text = document.lineAt(startLine).text.trim();

        // 🚫 IGNORE generated explanations/comments
        if (

            // 🚫 Generated extension UI/comments
            text.includes("MundiCodeLens") ||
            text.includes("Run 'Full Explanation'") ||
            text.includes("Explain Code") ||
            text.includes("Refactor") ||
            text.includes("Fix Bug") ||
            text.includes("Optimize") ||

            // 🚫 AI explanation/comment lines
            text.startsWith("#") ||
            text.startsWith("//") ||
            text.startsWith("/*") ||
            text.startsWith("*") ||
            text.startsWith("<!--")
        ) {
            startLine--;
            continue;
        }

        if (
            text.startsWith("function") ||
            text.startsWith("async function") ||
            text.startsWith("def ") ||                 // Python
            text.startsWith("class ") ||               // Python / JS
            text.startsWith("public") ||               // Java / C#
            text.startsWith("private") ||
            text.startsWith("protected") ||
            text.includes("=>") ||
            text.startsWith("const") ||
            text.startsWith("let") ||

            // ✅ HTML (ignore comments)
            (
                text.startsWith("<") &&
                !text.startsWith("<!--")
            )
        ) {
            break;
        }

        startLine--;
    }

    // 🔍 STEP 2 — Detect structure type
    let openBraces = 0;
    let foundOpening = false;
    let isPython = document.languageId === "python";

    for (let i = startLine; i < document.lineCount; i++) {

        const lineText = document.lineAt(i).text;
        const trimmed = lineText.trim();

        // 🚫 STOP before generated explanation content/comments
        if (

            trimmed.includes("MundiCodeLens") ||
            trimmed.includes("Run 'Full Explanation'") ||
            trimmed.includes("Explain Code") ||
            trimmed.includes("Refactor") ||
            trimmed.includes("Fix Bug") ||
            trimmed.includes("Optimize") ||

            trimmed.startsWith("#") ||
            trimmed.startsWith("//") ||
            trimmed.startsWith("/*") ||
            trimmed.startsWith("*") ||
            trimmed.startsWith("<!--")
        ) {
            endLine = i - 1;
            break;
        }

        // 🧠 Python (indentation-based)
        // 🧠 Python (indentation-based)
if (isPython) {

    // Allow empty lines inside functions
    if (i > startLine && trimmed === "") {
        continue;
    }

    const indent =
        lineText.match(/^\s*/)?.[0].length || 0;

    const baseIndent =
        document.lineAt(startLine)
            .text
            .match(/^\s*/)?.[0].length || 0;

    // Allow decorators and comments
    if (
        trimmed.startsWith('#') ||
        trimmed.startsWith('@')
    ) {
        continue;
    }

    // Detect end of Python block
    if (
        i > startLine &&
        trimmed.length > 0 &&
        indent <= baseIndent
    ) {
        endLine = i - 1;
        break;
    }

    // Keep extending valid function block
    endLine = i;
}
    }

    if (endLine < startLine) {
        endLine = position.line;
    }

    const range = new vscode.Range(
        startLine,
        0,
        endLine,
        1000
    );

    return document.getText(range);
}