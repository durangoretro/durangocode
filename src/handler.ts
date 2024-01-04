import { readFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";

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

export enum SYSTEM{
    WINDOWS="w",
    LINUX="l",
    DARWIN="d",
    DOCKER="docker"
};

/**
 * Commands Handler: Handle the execution of the commands. This is the base class.
 */
export abstract class  CommandHandler{

    /**
     * Extension Folder path
     */
    protected extensionPath:string;

    /**
     * Durango Code Integrated Terminal
     */
    protected terminal:vscode.Terminal;


    /**
     * Class Constructor
     * @param extensionPath extension Folder Path 
     */
    constructor(extensionPath:string){
        this.extensionPath=extensionPath;
        this.terminal= vscode.window.createTerminal('Durango.code');
    }
    /**
     * Handle the Compile Project Command
     */
    abstract compile():Boolean;
    /**
     * Handle the Clean Project Command.
     */
    abstract clean():Boolean;
    /**
     * Handle the Run Commands Handle
     * @param mode Run Execution Mode. @see EXEC_MODE
     */
    abstract run(mode: EXEC_MODE):Boolean;
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
     * @returns 
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

    protected executeCommand(command:string,newLine:boolean=true){
        this.terminal.sendText(command,newLine);
    }
 };

export class CommandWHandler extends CommandHandler{

    public constructor(extensionPath: string){
        super(extensionPath);
    }

    compile(): Boolean {
       let command:string|undefined = this.handleCommand("compile",SYSTEM.WINDOWS);
       //TODO: Execute command.
       
       if(command!==undefined)
                this.executeCommand(command);
       return command!==undefined;
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