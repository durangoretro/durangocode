import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as handler from '../../handler';
import path = require('path');
import * as fs from 'fs';
import {tmpdir} from "os";
import { CommandData } from '../../utils';
import { before } from 'mocha';
import { AppCore } from '../../appCore';
import * as vscodeTest from '@vscode/test-electron';

let appCore:AppCore;

suite('AppCore Test',()=>{
    before(()=>{
        appCore=new AppCore(path.join(__dirname,"../../.."));
        
    });
    test('Test Compile', () =>{
        appCore.compile();
    });

});