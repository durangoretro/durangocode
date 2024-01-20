import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as handler from '../../handler';
import path = require('path');
import * as fs from 'fs';
import { tmpdir } from "os";
import { CommandData } from '../../utils';
import { before } from 'mocha';

// import * as myExtension from '../../extension';
let data: any = {
	"DDK": "/opt/DurangoLib",
	"CustomRescompJar": "/opt/DurangoLib/rescomp/rescomp.jar",
	"ExecutionMode": "Emulator",
	"executable": "perdita",
	"romLocation": "rom.dux"
};
let commandHandler: handler.CommandHandler;

let Commands = {
	"compileW": "make",
	"cleanW": "make clean",
	"runW": "START \\B perdita \"rom.dux\"",
	"envVarW": "set DDK=\"/opt/DurangoLib\";set RESCOMP=\"/opt/DurangoLib/rescomp/rescomp.jar\";",
	//Linux
	"compileL": "make",
	"cleanL": "make clean",
	"runL": "perdita \"rom.dux\" &",
	"envVarL": "export DDK=\"/opt/DurangoLib\";export RESCOMP=\"/opt/DurangoLib/rescomp/rescomp.jar\";",
	//Darwin (MacOs)
	"compileD": "make",
	"cleanD": "make clean",
	"runD": "perdita \"rom.dux\" &",
	"envVarD": "export DDK=\"/opt/DurangoLib\";export RESCOMP=\"/opt/DurangoLib/rescomp/rescomp.jar\";",
	//Docker
	"compileDocker": "docker run --rm -v \"%CD%\":/src/durango  --env DDK=/opt/DurangoLib --env RESCOMP=/opt/DurangoLib/rescomp/rescomp.jar zerasul/durangodevkit",
	"cleanDocker": "docker run --rm -v \"%CD%\":/src/durango  --env DDK=/opt/DurangoLib --env RESCOMP=/opt/DurangoLib/rescomp/rescomp.jar zerasul/durangodevkit make clean",
	"runDocker": "START \\B perdita \"rom.dux\""
};

suite('Handle Windows Commands Suite Test', () => {
	vscode.window.showInformationMessage('Start all tests.');

	before(() => {
		commandHandler = new handler.CommandWHandler(path.join(__dirname, "../../.."));
	});
	test('Handler compiler test', () => {

		assert.strictEqual(commandHandler?.compile(new CommandData(data)), Commands["compileW"]);
	});
	test('Handler Clean test', () => {

		assert.strictEqual(commandHandler?.clean(new CommandData(data)), Commands["cleanW"]);
	});
	test('Handler RUN test', () => {
		assert.strictEqual(commandHandler?.run(new CommandData(data), false), Commands["runW"]);

	});
	test('Handler Environment Variables Test', () => {
		assert.strictEqual(commandHandler?.getEnvironmentVariablesData(new CommandData(data)), Commands["envVarW"]);

	});
});

suite('Handle Linux Commands Suite Test', () => {
	vscode.window.showInformationMessage('Start all tests.');

	before(() => {
		commandHandler = new handler.CommandLHandler(path.join(__dirname, "../../.."));
	});
	test('Handler compiler test', () => {

		assert.strictEqual(commandHandler?.compile(new CommandData(data)), Commands["compileL"]);
	});
	test('Handler Clean test', () => {

		assert.strictEqual(commandHandler?.clean(new CommandData(data)), Commands["cleanL"]);
	});
	test('Handler RUN test', () => {
		assert.strictEqual(commandHandler?.run(new CommandData(data), false), Commands["runL"]);

	});
	test('Handler Environment Variables Test', () => {
		assert.strictEqual(commandHandler?.getEnvironmentVariablesData(new CommandData(data)), Commands["envVarL"]);

	});
});
suite('Handle Darwin Commands Suite Test', () => {
	vscode.window.showInformationMessage('Start all tests.');

	before(() => {
		commandHandler = new handler.CommandDHandler(path.join(__dirname, "../../.."));
	});
	test('Handler compiler test', () => {

		assert.strictEqual(commandHandler?.compile(new CommandData(data)), Commands["compileD"]);
	});
	test('Handler Clean test', () => {

		assert.strictEqual(commandHandler?.clean(new CommandData(data)), Commands["cleanD"]);
	});
	test('Handler RUN test', () => {
		assert.strictEqual(commandHandler?.run(new CommandData(data), false), Commands["runD"]);

	});
	test('Handler Environment Variables Test', () => {
		assert.strictEqual(commandHandler?.getEnvironmentVariablesData(new CommandData(data)), Commands["envVarD"]);

	});
});
suite('Handle Docker Commands Suite Test', () => {
	vscode.window.showInformationMessage('Start all tests.');

	before(() => {
		commandHandler = new handler.CommandDockerHandler(path.join(__dirname, "../../.."), "win32");
	});
	test('Handler compiler test', () => {

		assert.strictEqual(commandHandler?.compile(new CommandData(data)), Commands["compileDocker"]);
	});
	test('Handler Clean test', () => {

		assert.strictEqual(commandHandler?.clean(new CommandData(data)), Commands["cleanDocker"]);
	});
	test('Handler RUN test', () => {
		assert.strictEqual(commandHandler?.run(new CommandData(data), false), Commands["runDocker"]);

	});

});
