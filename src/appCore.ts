import { CommandHandler, CommandLHandler, CommandWHandler, CommandDHandler, CommandDockerHandler } from "./handler";
import { platform } from "os";
import * as vscode from "vscode";
import * as DurangoConstants from "./DurangoConstants";
import { copyFileSync, mkdirSync } from "fs";
import path = require("path");
import { CommandData } from "./utils";


/**
 * EXECUTION MODE:
 * * PEDITA: Run on Perdita Emulator.
 * * NANOBOOT: Run Using NanoBoot.
 */
export enum EXEC_MODE {
    /**Perdita Emulator */
    Emulator,
    /**Run Using NanoBoot */
    NANOBOOT
};

/**
 * Application Core Class; manage all the extension; operations.
 */
export class AppCore {

    /**
     * extension Path
     */
    private extensionPath: string;

    private terminal: vscode.Terminal | undefined;

    /**
     * Current CommandHandler; uses multiples extended classes for each configuration.
     */
    private commandHandler;

    private docker: boolean = false;

    /**
     * Class Constructor. This Constructor Builds the CommandHandler for each System; depending
     * of the ToolChainType Configuration, and Operating System.
     * @param extensionPath extension Path
     */
    public constructor(extensionPath: string) {

        this.extensionPath = extensionPath;
        let toolchainType = vscode.workspace.getConfiguration().get(DurangoConstants.TOOLCHAINTYPE, DurangoConstants.NATIVE);
        let platfrm = platform().toString();
        if (toolchainType === DurangoConstants.NATIVE) {
            switch (platfrm) {
                case "win32":
                    this.commandHandler = new CommandWHandler(extensionPath);
                    break;
                case "linux":
                    this.commandHandler = new CommandLHandler(extensionPath);
                    break;
                case "darwin":
                    this.commandHandler = new CommandDHandler(extensionPath);
                    break;
                default:
                    throw Error("UnSupported Platform");
            }
        } else {
            this.commandHandler = new CommandDockerHandler(extensionPath, platfrm);
            this.docker = true;
        }
        this.terminal = undefined;
    }

    /**
     * Create a new Project on the Selected path
     * @param currentPath Path where the Project will be located
     * @returns 
     */
    public createProject(currentPath: vscode.Uri): vscode.Uri | undefined {

        return (this.create(currentPath.toString())) ? currentPath : undefined;
    }

    /**
     * Handle the Create Project Command
     * @param projectPath Project Root Path
     */
    create(projectPath: string): Boolean {

        mkdirSync(path.join(projectPath, "src"));
        //main.c
        let sourceMainCPath = path.join(this.extensionPath, DurangoConstants.RESOURCESDIR, DurangoConstants.TEMPLATEDIR
            , "main.c.template");
        let destinationPath = path.join(projectPath, "src", "main.c");
        copyFileSync(sourceMainCPath, destinationPath);
        //MakeFile
        let sourceMakeFilePath = path.join(this.extensionPath, DurangoConstants.RESOURCESDIR, DurangoConstants.TEMPLATEDIR
            , "Makefile.template");
        let destinationMakeFilePath = path.join(projectPath, "Makefile");
        copyFileSync(sourceMakeFilePath, destinationMakeFilePath);
        //Readme
        let sourceReadmePath = path.join(this.extensionPath, DurangoConstants.RESOURCESDIR, DurangoConstants.TEMPLATEDIR
            , "Readme.md.template");
        let destinationReadMePath = path.join(projectPath, "Readme.md");
        copyFileSync(sourceReadmePath, destinationReadMePath);
        //gitignore
        let sourceGitIgnorePath = path.join(this.extensionPath, DurangoConstants.RESOURCESDIR, DurangoConstants.TEMPLATEDIR
            , ".gitignore.template");
        let destinationGitIgnorePath = path.join(projectPath, ".gitignore");
        copyFileSync(sourceGitIgnorePath, destinationGitIgnorePath);
        return true;
    }


    private compileWithLine(newLine:boolean){
        let ddKConfig = vscode.workspace.getConfiguration().get(DurangoConstants.DDK)
        let rescompConfig = vscode.workspace.getConfiguration().get(DurangoConstants.CUSTOMRESCOMP);
        let data:any = {};
        data[DurangoConstants.DDK] = ddKConfig;
        data[DurangoConstants.CUSTOMRESCOMP] = rescompConfig;
        let customEnvVariables = this.commandHandler.getEnvironmentVariablesData(new CommandData(data));
        if (this.docker) {
            data[DurangoConstants.DOCKERTAG] = vscode.workspace.getConfiguration().get(DurangoConstants.DOCKERTAG);
        } else {
            this.executeCommand(customEnvVariables,newLine);
        }

        let compileCommand = this.commandHandler.compile(new CommandData(data));
        if (compileCommand)
            this.executeCommand(compileCommand, newLine);
    }

    /**
     * Call the Compile Operation
     */
    public compile() {
        this.compileWithLine(true);
    }

    /**
     * Call the Clean Operation
     */
    public clean() {
        let ddKConfig = vscode.workspace.getConfiguration().get(DurangoConstants.DDK);
        let rescompConfig = vscode.workspace.getConfiguration().get(DurangoConstants.CUSTOMRESCOMP);
        let data: any={};
        data[DurangoConstants.DDK] = ddKConfig;
        data[DurangoConstants.CUSTOMRESCOMP] = rescompConfig;
        let customEnvVariables = this.commandHandler.getEnvironmentVariablesData(new CommandData(data));
        if (this.docker) {
            data[DurangoConstants.DOCKERTAG] = vscode.workspace.getConfiguration().get(DurangoConstants.DOCKERTAG);
            data[DurangoConstants.CUSTOMRESCOMP] = vscode.workspace.getConfiguration().get(DurangoConstants.CUSTOMRESCOMP);
        } else {
            this.executeCommand(customEnvVariables);
        }
        let cleanCommand =  this.commandHandler?.clean(new CommandData(data));
        if(cleanCommand){
            this.executeCommand(cleanCommand);
        }
    }

    private composeRun(execMode:EXEC_MODE,compose:Boolean=false){
       let runCommand="";
        if(compose){
            runCommand+=" && ";
       }
        let data:any={};
        let executable:string|undefined="";
        switch(execMode){
            case EXEC_MODE.Emulator:
                executable=vscode.workspace.getConfiguration().get(DurangoConstants.PERDITAPATHCONFIG);
                break;
            case EXEC_MODE.NANOBOOT:
                executable=vscode.workspace.getConfiguration().get(DurangoConstants.NANOBOOTPATHCONFIG);
                break;
        }
        data[DurangoConstants.EXECUTABLE]=executable;
        data[DurangoConstants.ROMLOCATION]=vscode.workspace.getConfiguration().get(DurangoConstants.ROMLOCATION);
        runCommand += this.commandHandler.run(new CommandData(data),compose);
        if(runCommand)
            this.executeCommand(runCommand,true);
        
    }
    /**
     * Run the generated ROM on an emulator or using NanoBoot on Raspberry Pi
     * @param execMode Execution Mode emulator or using nanoboot @see EXEC_MODE
     */
    public run(execMode:EXEC_MODE){
        this.composeRun(execMode);
    }

    /**
     * Compile the project and later run the generated Rom using an emulator or nanoboot
     * @param execMode Execution Mode using an Emulator or using Nano Boot @see EXEC_MODE
     */
    public compileAndRun(execMode:EXEC_MODE){
        this.compileWithLine(false);
        this.composeRun(execMode,true);
    }

    /**
     * Gets the current Durango.code Terminal, or create a new One.
     * @returns Current DurangoCode Terminal
     */
    private getCurrentTerminal(): vscode.Terminal {
        if (this.terminal == undefined) {
            let terminals = vscode.window.terminals.filter(terminal => terminal.name === DurangoConstants.DURANGOCODE);
            this.terminal = terminals.length > 0 ? terminals[0] : vscode.window.createTerminal(DurangoConstants.DURANGOCODE);
        }
        this.terminal.show(true);
        return this.terminal;
    }

    /**
     * Execute current command on Terminal
     * @param command Command to be executed
     * @param newLine Adds a new Line character at the end or not (for compose commands).
     */
    private executeCommand(command: string, newLine: boolean = true) {
        this.getCurrentTerminal().sendText(command, newLine);
    }

}