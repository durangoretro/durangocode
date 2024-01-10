import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import path = require('path');
import { before } from 'mocha';
import { AppCore } from '../../appCore';
import * as DurangoConstants from '../../DurangoConstants';
import * as vscode from 'vscode';

let appCore: AppCore;

let getTerminal=()=>{
    let terminals = vscode.window.terminals.filter(terminal => terminal.name === DurangoConstants.DURANGOCODE);
    return terminals[0];
}

suite('AppCore Test', () => {
    before(() => {
        appCore = new AppCore(path.join(__dirname, "../../.."));

    });
    test('Test Compile', () => {
        appCore.compile();
        let terminal = getTerminal();
        assert.strictEqual(terminal.name, DurangoConstants.DURANGOCODE);
        terminal.hide();
    });
    test('Test Clean', () => {
        appCore.clean();
        let terminal = getTerminal();
        assert.strictEqual(terminal.name, DurangoConstants.DURANGOCODE);
        terminal.hide();
    });
});