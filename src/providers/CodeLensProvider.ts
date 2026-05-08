import * as vscode from 'vscode';

export class MundiCodeLensProvider implements vscode.CodeLensProvider {

    provideCodeLenses(
        document: vscode.TextDocument
    ): vscode.CodeLens[] {

        const lenses: vscode.CodeLens[] = [];

        for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i).text.trim();

            // 🚫 Ignore generated explanations/comments
            if (

                line.includes('MundiCodeLens') ||
                line.includes("Run 'Full Explanation'") ||
                line.includes('Explain Code') ||
                line.includes('Refactor') ||
                line.includes('Fix Bug') ||
                line.includes('Optimize') ||

                // 🚫 Ignore comments
                line.startsWith('#') ||
                line.startsWith('//') ||
                line.startsWith('/*') ||
                line.startsWith('*') ||
                line.startsWith('<!--')
            ) {
                continue;
            }

            // ✅ JavaScript / TypeScript structures
            const isJavaScriptFunction =

                line.startsWith('function ') ||

                line.startsWith('async function ') ||

                (
                    line.startsWith('const ') &&
                    line.includes('=') &&
                    line.includes('=>')
                );

            // ✅ Python structures
            const isPythonStructure =

                line.startsWith('def ') ||

                line.startsWith('class ');

            // ✅ HTML structures
            const isHtmlStructure =

                line.startsWith('<') &&
                !line.startsWith('</') &&
                !line.startsWith('<!--') &&

                // Ignore inline closing tags
                !line.includes('</');

            // ✅ Only attach lenses to meaningful structures
            if (

                isJavaScriptFunction ||

                isPythonStructure ||

                isHtmlStructure
            ) {

                const range = new vscode.Range(
                    i,
                    0,
                    i,
                    0
                );

                // 💡 Explain Code
                lenses.push(
                    new vscode.CodeLens(range, {
                        title: '💡 Explain Code',
                        command: 'mundicodelens-lite.helloWorld'
                    })
                );

                // 📖 Full Explanation
                lenses.push(
                    new vscode.CodeLens(range, {
                        title: '📖 Full Explanation',
                        command: 'mundicodelens-lite.explainFull'
                    })
                );

                // ✨ Refactor
                lenses.push(
                    new vscode.CodeLens(range, {
                        title: '✨ Refactor',
                        command: 'mundicodelens-lite.refactor'
                    })
                );

                // 🐞 Fix Bug
                lenses.push(
                    new vscode.CodeLens(range, {
                        title: '🐞 Fix Bug',
                        command: 'mundicodelens-lite.fix'
                    })
                );

                // ⚡ Optimize
                lenses.push(
                    new vscode.CodeLens(range, {
                        title: '⚡ Optimize',
                        command: 'mundicodelens-lite.optimize'
                    })
                );
            }
        }

        return lenses;
    }
}