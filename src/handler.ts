import { readFileSync, mkdirSync, copyFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import * as DurangoConstants from "./DurangoConstants";
import { platform } from "os";
import { CommandData } from "./utils";



/**
 * Current System Configuration
 */
export enum SYSTEM {
    /**
     * Windows (win32)
     */
    WINDOWS = "w",
    /**
     * Linux
     */
    LINUX = "l",
    /**
     * Darwin
     */
    DARWIN = "d",
    /**
     * Docker
     */
    DOCKER = "docker",
    /**
     * Unknow System
     */
    UNKNOWN = "UNKNOWN"
};

/**
 * Commands Handler: Handle the execution of the commands. This is the base class.
 */
export abstract class CommandHandler {

    /**
     * Extension Folder path
     */
    protected extensionPath: string;

    /**
     * Current System
     */
    protected System: SYSTEM;

    /**
     * Durango Code Integrated Terminal
     */
    protected terminal: vscode.Terminal | undefined;


    /**
     * Class Constructor
     * @param extensionPath extension Folder Path 
     */
    constructor(extensionPath: string) {
        this.extensionPath = extensionPath;

        this.System = SYSTEM.UNKNOWN;
    }

    /**
     * get the current environmentVariables and returns the composed Command
     * 
     * @param commandData Command Data with all the Command Parameters
     * @returns Composed EnvironMent Variables commands.
     */
    abstract getEnvironmentVariablesData(commandData: CommandData): string;

    /**
     * Send a file or program using VSP (Virtual Serial Port)
     * @param filePath File to Send
     */
    abstract sendVSP(filePath: String): Boolean;
    /**
     * Load information from VSP (Virtual Serial Port) and create a new File.
     * @param filePath Path of the new file to be created. If exists, will be overwritten.
     */
    abstract loadVSP(filePath: String): Boolean;

    /**
     * Handle a new command searching in the commands.json file.
     * 
     * @param commandName command Name.
     * @param system System used. @see SYSTEM
     * @returns The current Command
     */
    protected handleCommand(commandName: string, system: SYSTEM): string | undefined {


        let bufferJson = readFileSync(path.join(this.extensionPath, DurangoConstants.RESOURCESDIR, "commands.json"));
        let json = JSON.parse(bufferJson.toString());
        try {
            return json.commands[commandName][system];
        } catch (error) {
            return undefined;
        }

    }


    /**
     * Handle the Compile Project Command
     * 
     * @param commandData Command Data With all the replace Parameters
     * 
     * @returns Composed Command
     */
    public compile(commandData: CommandData): string | undefined {
        let command: string | undefined = this.handleCommand(DurangoConstants.COMPILE, this.System);

        return command;
    }


    /**
     * Current Execution Mode From Configuration
     * @returns Get Current Execution Mode From Configuration
     */
    protected getCurrentExecutable(commandData: CommandData): string | undefined {

        let executable = commandData.getData(DurangoConstants.EXECUTABLE, "perdita");
        
        return executable;
    }

    /**
     * Handle the Clean Project Command.
     * 
     * @param commandData commandData with all the required Parameters to be replaced
     * 
     * @returns Composed Command
     */
    public clean(commandData: CommandData): string | undefined {

        let command = this.handleCommand(DurangoConstants.CLEAN, this.System);

        return command;
    }

    /**
     * Handle the Run Commands Handle.
     * @param commandData command Data with all the parameters
     * @param compose allow to compose with earlier command
     */
    public run(commandData: CommandData, compose: Boolean): string | undefined {

        let executable = this.getCurrentExecutable(commandData);

        let executeCommand: string | undefined = this.handleCommand(DurangoConstants.RUN, this.System);
        let romFile = commandData.getData(DurangoConstants.ROMLOCATION);
        if (executable)
            executeCommand = executeCommand?.replace(/{{executable}}/, executable)
                .replace(/{{romFile}}/, romFile);

        return executeCommand;
    }



};

/**
 * CommandWHandler: Command Handler for Native Windows Systems.
 */
export class CommandWHandler extends CommandHandler {


    /**
     * Class Constructor
     * @param extensionPath Extension Path
     */
    public constructor(extensionPath: string) {
        super(extensionPath);
        this.System = SYSTEM.WINDOWS;
    }


    getEnvironmentVariablesData(commandData: CommandData): string {
        //Set DDK Variable
        let command = "";
        let DDKVariable = commandData.getData(DurangoConstants.DDK);
        if (DDKVariable) {
            command += `set DDK="${DDKVariable}";`;
        }
        //Set custom RescompPath
        let rescompPath = commandData.getData(DurangoConstants.CUSTOMRESCOMP);
        if (rescompPath) {
            command += `set RESCOMP="${rescompPath}";`;
        }
        return command;
    }

    sendVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    loadVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }

};

/**
 * Command Handler For Linux/*Nix Systems
 */
export class CommandLHandler extends CommandHandler {

    public constructor(extensionPath: string) {
        super(extensionPath);
        this.System = SYSTEM.LINUX;
    }

    getEnvironmentVariablesData(commandData: CommandData): string {
        let command = "";
        //Set DDK Variable
        let DDKVariable = commandData.getData(DurangoConstants.DDK);
        if (DDKVariable) {
            command += `export DDK="${DDKVariable}";`;
        }
        let rescompPath = commandData.getData(DurangoConstants.CUSTOMRESCOMP);
        if (rescompPath) {
            command += `export RESCOMP="${rescompPath}";`;
        }
        return command;
    }


    sendVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    loadVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }

};

/**
 * Command Handler For MacOs Based Systems (Darwin).
 */
export class CommandDHandler extends CommandLHandler {

    constructor(extensionPath: string) {
        super(extensionPath);
        this.System = SYSTEM.DARWIN;
    }
    //TODO Implement Macos (darwin) implementation


};

/**
 * Command Handler For Docker based Systems
 */
export class CommandDockerHandler extends CommandHandler {


    /**
     * Platform used (based on os.Platform() function)
     */
    private platform: string;

    /**
     * Default Constructor
     * @param extensionPath Extension Path
     */
    public constructor(extensionPath: string, platform: string) {
        super(extensionPath);
        this.System = SYSTEM.DOCKER;
        this.platform = platform
    }

    /**
     * Compile Command for Docker Based Systems
     * @param newLine Add a new Line at the end of the command
     * @returns True if the command Was Successful
     */
    public compile(commandData: CommandData): string | undefined {
        let command = this.handleCommand(DurangoConstants.COMPILE, this.System);
        command = this.ComposeCommandDocker(command, commandData);

        return command;
    }

    /**
     * Clean Command for Docker based Systems
     * @returns True if the command Was Successful
     */
    public clean(commandData: CommandData): string | undefined {
        let command = this.handleCommand(DurangoConstants.CLEAN, this.System);
        command = this.ComposeCommandDocker(command, commandData);

        return command;
    }

    /**
     * Compose the Docker Command using replacements using the current configuration
     * @param command Command to be composed with the replacements
     * @returns Command with replacements
     */
    private ComposeCommandDocker(command: string | undefined, commandData: CommandData): string | undefined {
        let currPath = '"$PWD"';
        //In case of windows use %CD% for volume creation
        if (this.platform === 'win32') {
            currPath = '"%CD%"'
        }

        //Environment Variables
        let environmentVar = "";
        //Set DDK Variable
        let DDKVariable = commandData.getData(DurangoConstants.DDK);
        if (DDKVariable) {
            environmentVar += ` --env DDK=${DDKVariable}`;
        }
        //Set custom RescompPath
        let rescompPath = commandData.getData(DurangoConstants.CUSTOMRESCOMP);
        if (rescompPath) {
            environmentVar += ` --env RESCOMP=${rescompPath}`;
        }
        let DockerImageName = commandData.getData(DurangoConstants.DOCKERTAG, DurangoConstants.DEFAULTTAG);
        command = command?.replace(/{{currentPath}}/g, currPath)
            .replace(/{{envVariables}}/, environmentVar)
            .replace(/{{dockerTag}}/, DockerImageName);

        return command;
    }

    getEnvironmentVariablesData(commandData: CommandData): string {
        throw new Error("Method not valid for Docker");
    }

    public run(commandData: CommandData, compose: Boolean): string | undefined {

        return (this.platform === 'win32') ? this.composeRunDockerWin32(commandData, compose) : super.run(commandData, compose);
    }
    private composeRunDockerWin32(commandData: CommandData, compose: Boolean = false): string | undefined {
        let command: string | undefined = "";
        if (compose) {
            command += " && "
        }
        let executable = this.getCurrentExecutable(commandData)
        let romLocation = commandData.getData(DurangoConstants.ROMLOCATION);
        if (executable)
            command = this.handleCommand(DurangoConstants.RUN, SYSTEM.WINDOWS)
                ?.replace(/{{executable}}/, executable)
                ?.replace(/{{romFile}}/, romLocation);
 
        return command;
    }
    sendVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }
    loadVSP(filePath: String): Boolean {
        throw new Error("Method not implemented.");
    }

}