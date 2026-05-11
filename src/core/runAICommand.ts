import * as vscode from 'vscode';

import { getAIResponse } from '../ai/openai';

import { buildProjectContext } from '../context/builders/projectContextBuilder';

import { formatPromptContext } from '../context/builders/promptContextFormatter';

import { getFullFunction } from '../utils/parser';

import { showPanel } from '../utils/webview';

interface RunAICommandOptions {

    context: vscode.ExtensionContext;

    action:
        | 'explain'
        | 'deepExplain'
        | 'refactor'
        | 'fix'
        | 'optimize';

    panelMode?:
        | 'explain'
        | 'explainFull'
        | 'refactor'
        | 'fix'
        | 'optimize';

    loadingMessage?: string;
}

export async function runAICommand(
    options: RunAICommandOptions
) {

    const {
    context,
    action,
    panelMode,
    loadingMessage
} = options;

try {

        const editor =
            vscode.window.activeTextEditor;

        if (!editor) {

            vscode.window.showErrorMessage(
                'No active editor'
            );

            return;
        }

        const workspaceFolder =
            vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder) {

            vscode.window.showErrorMessage(
                'No workspace folder found'
            );

            return;
        }

        const workspaceRoot =
            workspaceFolder.uri.fsPath;

        const position =
            editor.selection.active;

        const selectedText =
            getFullFunction(
                editor.document,
                position
            );

        if (
            !selectedText ||
            selectedText.trim().length < 5
        ) {

            vscode.window.showInformationMessage(
                'No valid function detected'
            );

            return;
        }

       vscode.window.setStatusBarMessage(
            `$(sync~spin) ${
                loadingMessage ||
                'MundiCodeLens thinking...'
            }`,
            2000
        );

        const projectContext =
            buildProjectContext(
                workspaceRoot,
                editor.document.fileName
            );

        const formattedContext =
            formatPromptContext(
                projectContext
            );

        console.log(
            '🧠 FORMATTED CONTEXT:',
            formattedContext
        );

        const aiResponse =
            await getAIResponse(
                selectedText,
                action,
                editor.document.languageId,
                formattedContext
            );

        console.log(
            '🚀 FINAL RESPONSE TO UI:',
            aiResponse
        );

        showPanel(
            context,
            aiResponse,
            selectedText,
            panelMode || action
        );

    } catch (error: any) {

        console.error(
            '🔥 COMMAND PIPELINE ERROR:',
            error
        );

        vscode.window.showErrorMessage(
            `AI ERROR: ${
                error?.message || 'Unknown error'
            }`
        );
    }
}