import { CommandHandler, CommandLHandler, CommandWHandler, CommandDHandler, CommandDockerHandler } from "./handler";
import { platform } from "os";
import * as vscode from "vscode";
import * as DurangoConstants from "./DurangoConstants";

/**
 * Application Core Class; manage all the extension; operations.
 */
export class AppCore {

    /**
     * extension Path
     */
    private extensionPath: string;

    /**
     * Current CommandHandler; uses multiples extended classes for each configuration.
     */
    private commandHandler;

    /**
     * Class Constructor. This Constructor Builds the CommandHandler for each System; depending
     * of the ToolChainType Configuration, and Operating System.
     * @param extensionPath extension Path
     */
    public constructor(extensionPath: string) {

        this.extensionPath = extensionPath;
        let toolchainType = vscode.workspace.getConfiguration().get(DurangoConstants.TOOLCHAINTYPE,DurangoConstants.NATIVE);
        if(toolchainType===DurangoConstants.NATIVE){
        switch(platform().toString()){
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
    }else{
        this.commandHandler=new CommandDockerHandler(extensionPath);
    }
    }

    /**
     * Create a new Project on the Selected path
     * @param currentPath Path where the Project will be located
     * @returns 
     */
    public createProject(currentPath:vscode.Uri):vscode.Uri|undefined{
       
        return  this.commandHandler?.create(currentPath.fsPath)?currentPath:undefined;
    }

    /**
     * Call the Compile Operation
     */
    public compile(){
        this.commandHandler?.compile();
    }

    /**
     * Call the Clean Operation
     */
    public clean(){
        this.commandHandler?.clean();
    }

}