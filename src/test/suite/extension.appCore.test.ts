import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import path = require('path');
import { before } from 'mocha';
import { AppCore, EXEC_MODE } from '../../appCore';

let appCore: AppCore;


suite('AppCore Test', () => {
    before(() => {
        appCore = new AppCore(path.join(__dirname, "../../.."));

    });
    test('Test Compile', () => {
        appCore.compile();

        //@ts-ignore
        assert.notStrictEqual(appCore.terminal, undefined);
    });
    test('Test Clean', () => {
        appCore.clean();
        //@ts-ignore
        assert.notStrictEqual(appCore.terminal, undefined);
    });
    test('Test Run', () => {
        appCore.run(EXEC_MODE.Emulator);
        //@ts-ignore
        assert.notStrictEqual(appCore.terminal, undefined);
    });
});