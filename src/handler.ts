import { readFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import * as DurangoConstants from "./DurangoConstants";

/**
 * EXECUTION MODE:
 * * PEDITA: Run on Perdita Emulator.
 * * NANOBOOT: Run Using NanoBoot.
 */
export enum EXEC_MODE{
    /**Perdita Emulator */
    PERDITA,
    /**Run Using NanoBoot */
    NANOBOOT
};

/**
 * Current System Configuration
 */
export enum SYSTEM{
    WINDOWS="w",
    LINUX="l",
    DARWIN="d",
    DOCKER="docker",
    UNKNOWN="UNKNOWN"
};

/**
 * Commands Handler: Handle the execution of the commands. This is the base class.
 */
export abstract class  CommandHandler{

    /**
     * Extension Folder path
     */
    protected extensionPath:string;

    protected System:SYSTEM;

    /**
     * Durango Code Integrated Terminal
     */
    protected terminal:vscode.Terminal|undefined;


    /**
     * Class Constructor
     * @param extensionPath extension Folder Path 
     */
    constructor(extensionPath:string){
        this.extensionPath=extensionPath;
        this.terminal= undefined;
        this.System=SYSTEM.UNKNOWN;
    }

    /**
     * Updates the current environmentVariables using current Configuration
     */
    abstract setEnvironmentVariables():void;
  
    /**
     * Handle the Run Commands Handle
     * @param mode Run Execution Mode. @see EXEC_MODE
     */
    abstract run(mode: EXEC_MODE, newLine:boolean):Boolean;
    /**
     * Handle the Create Project Command
     * @param projectPath Project Root Path
     */
    abstract create(projectPath:String):Boolean;
    /**
     * Send a file or program using VSP (Virtual Serial Port)
     * @param filePath File to Send
     */
    abstract sendVSP(filePath:String):Boolean;
    /**
     * Load information from VSP (Virtual Serial Port) and create a new File.
     * @param filePath Path of the new file to be created. If exists, will be overwritten.
     */
    abstract loadVSP(filePath:String):Boolean;

    /**
     * Handle a new command searching in the commands.json file.
     * 
     * @param commandName command Name.
     * @param system System used. @see SYSTEM
     * @returns True if the command was successfully handled
     */
    protected handleCommand(commandName:string,system:SYSTEM):string|undefined{

        
        let bufferJson = readFileSync(path.join(this.extensionPath,"resources","commands.json"));
        let json= JSON.parse(bufferJson.toString());
        try {
            return json.commands[commandName][system];
        } catch (error) {
            return undefined;
        }

    }

    /**
     * Gets the current Durango.code Terminal, or create a new One.
     * @returns Current DurangoCode Terminal
     */
    protected getCurrentTerminal():vscode.Terminal{
        if(this.terminal==undefined){
            let terminals = vscode.window.terminals.filter(terminal => terminal.name === DurangoConstants.DURANGOCODE);
            this.terminal= terminals.length>0?terminals[0]:vscode.window.createTerminal(DurangoConstants.DURANGOCODE);
        }
        this.terminal.show(true);
        return this.terminal;
    }

    /**
     * Execute current command on Terminal
     * @param command Command to be executed
     * @param newLine Adds a new Line character at the end or not (for compose commands).
     */
    protected executeCommand(command:string,newLine:boolean=true){
        this.getCurrentTerminal().sendText(command,newLine);
    }
    /**
     * Handle the Compile Project Command
     */
    public compile(newLine:Boolean=true): Boolean {
        let command:string|undefined = this.handleCommand(DurangoConstants.COMPILE,this.System);
        //TODO: Execute command.
        this.setEnvironmentVariables();
        if(command!==undefined)
                 this.executeCommand(command,true);
        return command!==undefined;
     }

    /**
     * Current Execution Mode From Configuration
     * @returns Get Current Execution Mode From Configuration
     */
    protected getCurrentExecMode():EXEC_MODE{
        let execConfig = vscode.workspace.getConfiguration().get(DurangoConstants.EXECUTIONMODECONFIG,EXEC_MODE.PERDITA.toString());

        let execKey= execConfig as keyof typeof EXEC_MODE;

        return EXEC_MODE[execKey];
    }

    /**
     * Handle the Clean Project Command.
     */
    public clean(): Boolean {
        this.setEnvironmentVariables();
        let command=this.handleCommand(DurangoConstants.CLEAN,this.System);
        if(command){
         this.executeCommand(command);
        }
        return command!==undefined;
     }

     public compileAndRun():Boolean{
       return this.compile(false) && this.run(this.getCurrentExecMode(),false);
     }
 };

export class CommandWHandler extends CommandHandler{
  

    public constructor(extensionPath: string){
        super(extensionPath);
        this.System=SYSTEM.WINDOWS;
    }

    
    setEnvironmentVariables(): void {
        //Set DDK Variable
        let DDKVariable=vscode.workspace.getConfiguration().get(DurangoConstants.DDK);
        if(DDKVariable){
           this.executeCommand(`set DDK="${DDKVariable}"`);
        }
        //Set custom RescompPath
        let rescompPath = vscode.workspace.getConfiguration().get(DurangoConstants.CUSTOMRESCOMP);
        if(rescompPath){
            this.executeCommand(`set DDK="${rescompPath}"`);
         }
    }

   

    run(mode: EXEC_MODE, newLine:Boolean=true): Boolean {
        if(!newLine){
            this.executeCommand( ' && ', false);
        }
        let executable="";
        switch(mode){
            case EXEC_MODE.PERDITA:
                executable=vscode.workspace.getConfiguration().get(DurangoConstants.PERDITAPATHCONFIG,"perdita");
            break;
            case EXEC_MODE.NANOBOOT:
                executable=vscode.workspace.getConfiguration().get(DurangoConstants.NANOBOOTPATHCONFIG,"nanoboot");
            break;
        }
        let executeCommand:string|undefined = this.handleCommand(DurangoConstants.RUN,this.System);

        executeCommand?.replace("${executable}",executable);
        //TODO: Review better implementation
        executeCommand?.replace("${romFile}", "build/rom.bin");
        if(executeCommand)
            this.executeCommand(executeCommand);
        return executeCommand!==undefined;
    }
    
    create(projectPath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    sendVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    loadVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }

};

export class CommandLHandler extends CommandHandler{

    public constructor(extensionPath:string){
        super(extensionPath);
        this.System=SYSTEM.LINUX;
    }

    setEnvironmentVariables(): void {
         //Set DDK Variable
        let DDKVariable=vscode.workspace.getConfiguration().get(DurangoConstants.DDK);
        if(DDKVariable){
           this.executeCommand(`export DDK="${DDKVariable}"`);
        }
        let rescompPath = vscode.workspace.getConfiguration().get(DurangoConstants.CUSTOMRESCOMP);
        if(rescompPath){
            this.executeCommand(`export DDK="${rescompPath}"`);
         }
    }

    clean(): Boolean {
        throw new Error("Method not implemented.");
    }
    run(mode: EXEC_MODE): Boolean {
        throw new Error("Method not implemented.");
    }
    create(projectPath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    sendVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    loadVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }

}