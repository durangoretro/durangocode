// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AppCore } from './appCore';

let appCode:AppCore;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	//AppCore
	appCode=new AppCore(context.extensionPath);


	let disposableCompile = vscode.commands.registerCommand('durcode.compileProject', () => {
		
	});

	let disposableCreate = vscode.commands.registerCommand('durango-code.create-project', () => {
		vscode.window.showOpenDialog({
			canSelectFiles:false,
			canSelectFolders: true,
			canSelectMany: false
		}).then(r =>{
			if(r!==undefined){
				let projectPath=appCode.createProject(r[0]);
				if(projectPath)
					vscode.commands.executeCommand('vscode.openFolder',projectPath);
			}
		});
	});

	context.subscriptions.push(disposableCompile);
	context.subscriptions.push(disposableCreate);
}

// this method is called when your extension is deactivated
export function deactivate() {}
