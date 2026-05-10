import * as vscode from 'vscode';

// 🔥 FULL FUNCTION / BLOCK DETECTION
export function getFullFunction(
    document: vscode.TextDocument,
    position: vscode.Position
): string {

    const language =
        document.languageId;

    let startLine = position.line;
    let endLine = position.line;

    // ---------------------------------------------------
    // 🧠 HELPERS
    // ---------------------------------------------------

    function isIgnoredLine(text: string): boolean {

        return (

            text.includes("MundiCodeLens") ||
            text.includes("Run 'Full Explanation'") ||
            text.includes("Explain Code") ||
            text.includes("Refactor") ||
            text.includes("Fix Bug") ||
            text.includes("Optimize") ||

            text.startsWith("#") ||
            text.startsWith("//") ||
            text.startsWith("/*") ||
            text.startsWith("*") ||
            text.startsWith("<!--")
        );
    }

    function isCssSelector(text: string): boolean {

        return (
            (
                text.includes("{") ||
                text.endsWith("{")
            ) &&
            (
                text.startsWith(".") ||
                text.startsWith("#") ||
                text.includes(":") ||
                text.includes("[") ||
                text.includes("body") ||
                text.includes("html") ||
                text.includes("@media")
            )
        );
    }

    function isJavaScriptStructure(
        text: string
    ): boolean {

        return (

            text.startsWith("function ") ||
            text.startsWith("async function ") ||

            text.startsWith("const ") ||
            text.startsWith("let ") ||
            text.startsWith("var ") ||

            text.startsWith("class ") ||

            text.startsWith("export ") ||

            text.includes("=>") ||

            text.startsWith("public ") ||
            text.startsWith("private ") ||
            text.startsWith("protected ")
        );
    }

    // ---------------------------------------------------
    // 🔍 STEP 1 — FIND BLOCK START
    // ---------------------------------------------------

    while (startLine > 0) {

        const text =
            document
                .lineAt(startLine)
                .text
                .trim();

        if (isIgnoredLine(text)) {

            startLine--;
            continue;
        }

        // 🐍 Python
        if (
            language === "python" &&
            (
                text.startsWith("def ") ||
                text.startsWith("class ")
            )
        ) {
            break;
        }

        // 🎨 CSS
        if (
            language === "css" &&
            isCssSelector(text)
        ) {
            break;
        }

        // 🌐 HTML
        if (
            (
                language === "html" ||
                language === "django-html"
            ) &&
            text.startsWith("<") &&
            !text.startsWith("<!--")
        ) {
            break;
        }

        // ⚡ JS / TS / JSX / TSX
        if (
            isJavaScriptStructure(text)
        ) {
            break;
        }

        startLine--;
    }

    // ---------------------------------------------------
    // 🔍 STEP 2 — BLOCK EXTRACTION
    // ---------------------------------------------------

    let openBraces = 0;
    let foundOpening = false;

    const isPython =
        language === "python";

    for (
        let i = startLine;
        i < document.lineCount;
        i++
    ) {

        const lineText =
            document.lineAt(i).text;

        const trimmed =
            lineText.trim();

        // 🚫 Ignore generated comments
        if (
            i > startLine &&
            isIgnoredLine(trimmed)
        ) {

            endLine = i - 1;
            break;
        }

        // ---------------------------------------------------
        // 🐍 PYTHON
        // ---------------------------------------------------

        if (isPython) {

            if (
                i > startLine &&
                trimmed === ""
            ) {
                continue;
            }

            const indent =
                lineText.match(/^\s*/)?.[0].length || 0;

            const baseIndent =
                document
                    .lineAt(startLine)
                    .text
                    .match(/^\s*/)?.[0].length || 0;

            if (
                trimmed.startsWith("#") ||
                trimmed.startsWith("@")
            ) {
                continue;
            }

            if (
                i > startLine &&
                trimmed.length > 0 &&
                indent <= baseIndent
            ) {

                endLine = i - 1;
                break;
            }

            endLine = i;
        }

        // ---------------------------------------------------
        // ⚡ BRACE-BASED LANGUAGES
        // JS / TS / CSS / HTML
        // ---------------------------------------------------

        else {

            const opens =
                (lineText.match(/{/g) || []).length;

            const closes =
                (lineText.match(/}/g) || []).length;

            if (opens > 0) {
                foundOpening = true;
            }

            openBraces += opens;
            openBraces -= closes;

            endLine = i;

            if (
                foundOpening &&
                openBraces === 0 &&
                i > startLine
            ) {
                break;
            }
        }
    }

    // ---------------------------------------------------
    // 🛟 FALLBACK SAFETY
    // ---------------------------------------------------

    if (endLine < startLine) {
        endLine = position.line;
    }

    const range =
        new vscode.Range(
            startLine,
            0,
            endLine,
            1000
        );

    return document.getText(range);
}