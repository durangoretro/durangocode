import { CommandHandler, CommandLHandler, CommandWHandler, CommandDHandler } from "./handler";
import { platform } from "os";
import * as vscode from "vscode";

export class AppCore {

    private extensionPath: string;

    private commandHandler: CommandHandler|undefined;

    public constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        switch(platform.toString()){
            case "win32":
                this.commandHandler=new CommandWHandler(extensionPath);
            break;
            case "linux":
                this.commandHandler=new CommandLHandler(extensionPath);
            break;
            case "darwin":
                this.commandHandler= new CommandDHandler(extensionPath);
            break;
            default:
                throw Error("UnSupported Platform");
        }
    }

    public createProject(currentPath:vscode.Uri):vscode.Uri|undefined{
       
        return  this.commandHandler?.create(currentPath.fsPath)?currentPath:undefined;
    }

}