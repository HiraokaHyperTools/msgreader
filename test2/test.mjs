import fs from 'fs';
import assert from 'assert';
import { Reader } from '../lib/Reader.js'

describe('Reader', function () {
  // const Reader = require('../lib/Reader').Reader;

  function testIt(file, expectedWords) {
    const array = fs.readFileSync(`test2/${file}`);
    const reader = new Reader(array);
    reader.parse();

    const readData = reader.rootFolder().readFile("File");
    assert.notStrictEqual(readData, null);
    assert.notStrictEqual(readData, undefined);

    const actual = Buffer.from(readData).toString("ascii").replace(/\0+/g, " ").trim();
    assert.strictEqual(actual, expectedWords);
  };

  it('Small.bin', function () {
    testIt('Small.bin', "First Second Third");
  });
  it('Normal.bin', function () {
    testIt('Normal.bin', "First Second Third Fourth Fifth Sixth Seventh Eighth");
  });
});
