import * as vscode from "vscode";

export class MundiCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i).text.trim();

      // 🚫 Ignore generated explanations/comments

      if (
        line.includes("MundiCodeLens") ||
        line.includes("Run 'Full Explanation'") ||
        line.includes("Explain Code") ||
        line.includes("Refactor") ||
        line.includes("Fix Bug") ||
        line.includes("Optimize") ||
        line.includes("Implement") ||
        // 🚫 Ignore comments

        line.startsWith("#") ||
        line.startsWith("//") ||
        line.startsWith("/*") ||
        line.startsWith("*") ||
        line.startsWith("<!--")
      ) {
        continue;
      }

      // ✅ JavaScript / TypeScript

      const isJavaScriptStructure =
        line.startsWith("function ") ||
        line.startsWith("async function ") ||
        line.startsWith("class ") ||
        (line.startsWith("const ") &&
          line.includes("=") &&
          line.includes("=>"));

      // ✅ React Components

      const isReactComponent =
        (line.startsWith("export default function ") ||
          line.startsWith("function ") ||
          line.startsWith("const ")) &&
        (line.includes("return (") || line.includes("=>"));

      // ✅ Python

      const isPythonStructure =
        line.startsWith("def ") ||
        (line.startsWith("class ") && document.languageId === "python");

      // ✅ HTML / Django Templates

      const isHtmlStructure =
        (document.languageId === "html" ||
          document.languageId === "django-html" ||
          document.languageId === "django-template") &&
        line.startsWith("<") &&
        !line.startsWith("</") &&
        !line.startsWith("<!--") &&
        line.length > 12 &&
        (line.includes("class=") ||
          line.includes("id=") ||
          line.includes("<form") ||
          line.includes("<section") ||
          line.includes("<main") ||
          line.includes("<article") ||
          line.includes("<nav") ||
          line.includes("<aside") ||
          line.includes("<header") ||
          line.includes("<table") ||
          line.includes("<ul") ||
          line.includes("<button") ||
          line.includes("<a "));

      // ✅ CSS

      const isCssStructure =
        (document.languageId === "css" || document.languageId === "scss") &&
        line.endsWith("{") &&
        line.length > 15 &&
        !line.startsWith("@") &&
        (line.startsWith(".") ||
          line.startsWith("#") ||
          line.includes(":hover") ||
          line.includes(":focus"));

      // ✅ Meaningful structures only

      if (
        isJavaScriptStructure ||
        isReactComponent ||
        isPythonStructure ||
        isHtmlStructure ||
        isCssStructure
      ) {
        const range = new vscode.Range(i, 0, i, 0);

        // 💡 Explain Code

        lenses.push(
          new vscode.CodeLens(range, {
            title: "💡 Explain Code",

            command: "mundicodelens-lite.explainCode",
          }),
        );

        // 📖 Full Explanation

        lenses.push(
          new vscode.CodeLens(range, {
            title: "📖 Full Explanation",

            command: "mundicodelens-lite.explainFull",
          }),
        );

        // ✨ Refactor

        lenses.push(
          new vscode.CodeLens(range, {
            title: "✨ Refactor",

            command: "mundicodelens-lite.refactor",
          }),
        );

        // 🐞 Fix Bug

        lenses.push(
          new vscode.CodeLens(range, {
            title: "🐞 Fix Bug",

            command: "mundicodelens-lite.fix",
          }),
        );

        // ⚡ Optimize

        lenses.push(
          new vscode.CodeLens(range, {
            title: "⚡ Optimize",

            command: "mundicodelens-lite.optimize",
          }),
        );

        // 🛠 Implement

        lenses.push(
          new vscode.CodeLens(range, {
            title: "🛠 Implement",

            command: "mundicodelens-lite.implement",
          }),
        );
      }
    }

    return lenses;
  }
}
