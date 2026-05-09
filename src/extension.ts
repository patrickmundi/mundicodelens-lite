import * as vscode from 'vscode';

import { MundiCodeLensProvider } from './providers/CodeLensProvider';

import { registerExplainCommand } from './commands/explain';
import { registerExplainFullCommand } from './commands/explainFull';
import { registerRefactorCommand } from './commands/refactor';
import { registerFixBugCommand } from './commands/fixBug';
import { registerOptimizeCommand } from './commands/optimize';

// 🔹 Extension Activation
export function activate(
	context: vscode.ExtensionContext
) {

	console.log(
		'🚨 ACTIVATE STARTED 🚨'
	);

	registerExplainCommand(context);

	registerExplainFullCommand(context);

	registerRefactorCommand(context);

	registerFixBugCommand(context);

	registerOptimizeCommand(context);

	const provider =
		new MundiCodeLensProvider();

	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(
			{
				scheme: 'file',
				language: '*'
			},
			provider
		)
	);
}

export function deactivate() {}