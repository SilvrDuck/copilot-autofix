// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copilot-autofix" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const exceptionTracker = vscode.debug.registerDebugAdapterTrackerFactory("*",
		{
			createDebugAdapterTracker(session: vscode.DebugSession): vscode.ProviderResult<vscode.DebugAdapterTracker> {
				return new ExceptionDetectionTracker(session)
			}
		}

	)
	context.subscriptions.push(exceptionTracker);
}

class ExceptionDetectionTracker implements vscode.DebugAdapterTracker {
	constructor(private session: vscode.DebugSession) { }

	isException(message: any) {
		return message.type === 'event' && message.event === 'stopped' && message.body?.reason === 'exception'
	}

	onDidSendMessage(message: any): void {
		console.log("onSendMessage")
		if (this.isException(message)) {
			console.log("got excetpion")
			vscode.window.showInformationMessage("GOT EXCEPTION" + message.body)
		}
	}
}


// This method is called when your extension is deactivated
export function deactivate() { }
