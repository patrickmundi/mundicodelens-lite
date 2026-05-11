import * as vscode from 'vscode';

export class MundiCodeLensProvider
    implements vscode.CodeLensProvider {

    provideCodeLenses(
        document: vscode.TextDocument
    ): vscode.CodeLens[] {

        const lenses: vscode.CodeLens[] = [];

        for (
            let i = 0;
            i < document.lineCount;
            i++
        ) {

            const line =
                document.lineAt(i).text.trim();

            // 🚫 Ignore generated explanations/comments
            if (

                line.includes('MundiCodeLens') ||

                line.includes(
                    "Run 'Full Explanation'"
                ) ||

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

            // ✅ JavaScript / TypeScript
            const isJavaScriptStructure =

                line.startsWith('function ') ||

                line.startsWith(
                    'async function '
                ) ||

                line.startsWith('class ') ||

                (
                    line.startsWith('const ') &&
                    line.includes('=') &&
                    line.includes('=>')
                );

            // ✅ Python
            const isPythonStructure =

                line.startsWith('def ') ||

                (
                    line.startsWith('class ') &&
                    document.languageId === 'python'
                );

            // ✅ HTML
            const isHtmlStructure =

                line.startsWith('<') &&

                !line.startsWith('</') &&

                !line.startsWith('<!--');

            // ✅ CSS
            const isCssStructure =

                (
                    document.languageId === 'css' ||

                    document.languageId ===
                    'scss'
                ) &&

                line.endsWith('{');

            // ✅ Meaningful structures only
            if (

                isJavaScriptStructure ||

                isPythonStructure ||

                isHtmlStructure ||

                isCssStructure
            ) {

                const range =
                    new vscode.Range(
                        i,
                        0,
                        i,
                        0
                    );

                // 💡 Explain Code
                lenses.push(
                    new vscode.CodeLens(
                        range,
                        {
                            title:
                                '💡 Explain Code',

                            command:
                                'mundicodelens-lite.explainCode'
                        }
                    )
                );

                // 📖 Full Explanation
                lenses.push(
                    new vscode.CodeLens(
                        range,
                        {
                            title:
                                '📖 Full Explanation',

                            command:
                                'mundicodelens-lite.explainFull'
                        }
                    )
                );

                // ✨ Refactor
                lenses.push(
                    new vscode.CodeLens(
                        range,
                        {
                            title:
                                '✨ Refactor',

                            command:
                                'mundicodelens-lite.refactor'
                        }
                    )
                );

                // 🐞 Fix Bug
                lenses.push(
                    new vscode.CodeLens(
                        range,
                        {
                            title:
                                '🐞 Fix Bug',

                            command:
                                'mundicodelens-lite.fix'
                        }
                    )
                );

                // ⚡ Optimize
                lenses.push(
                    new vscode.CodeLens(
                        range,
                        {
                            title:
                                '⚡ Optimize',

                            command:
                                'mundicodelens-lite.optimize'
                        }
                    )
                );
            }
        }

        return lenses;
    }
}