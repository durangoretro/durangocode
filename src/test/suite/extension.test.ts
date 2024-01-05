import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as handler from '../../handler';
import path = require('path');
import * as fs from 'fs';
import {tmpdir} from "os";

// import * as myExtension from '../../extension';

suite('Handle Commands Suite Test', () => {
	vscode.window.showInformationMessage('Start all tests.');


	test('Handler compiler test',()=>{
		let handl= new handler.CommandWHandler(path.join(__dirname,"../../.."));
		assert.strictEqual(handl.compile(),true);
	});
	test('Handler Clean test',()=>{
		let handl= new handler.CommandWHandler(path.join(__dirname,"../../.."));
		assert.strictEqual(handl.clean(),true);
	});
	test('Handler RUN test',()=>{
		let handl= new handler.CommandWHandler(path.join(__dirname,"../../.."));
		assert.strictEqual(handl.run(handler.EXEC_MODE.PERDITA,false),true);
	});
	test('Handler CompileAndRun test',()=>{
		let handl= new handler.CommandWHandler(path.join(__dirname,"../../.."));
		assert.strictEqual(handl.compileAndRun(),true);
	});
	test('create Project Test',()=>{
		//create temporal Directory
		fs.mkdirSync(path.join(tmpdir(),"durproject"));
		let handl= new handler.CommandWHandler(path.join(__dirname,"../../.."));
		assert.strictEqual(handl.create(path.join(tmpdir(),"durproject")),true);
		let paths = [path.join(tmpdir(),"durproject","src","main.c"),
					path.join(tmpdir(),"durproject","Makefile"),
					path.join(tmpdir(),"durproject","Readme.md"),
					path.join(tmpdir(),"durproject",".gitignore")];
		//Check Files
		paths.forEach((value)=>{
			assert.strictEqual(fs.existsSync(value),true);
		});
		//Delete Temporal Directory
		fs.rmSync("/tmp/durproject", { 
			recursive: true, 
		});
	});
});
