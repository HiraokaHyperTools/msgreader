const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;

describe('ReaderAntiCyclic', function () {
  const Reader = require('../lib/Reader').Reader;

  function testIt(file) {
    const array = fs.readFileSync(`test3/${file}`);
    const reader = new Reader(array);
    reader.parse();
  };

  it('cyclicDirTree.msg', function () {
    expect(testIt.bind(null, 'cyclicDirTree.msg')).to.throw("Cyclic property hierarchy detected");
  });
  it('cyclicFatRing.msg', function () {
    expect(testIt.bind(null, 'cyclicFatRing.msg')).to.throw("Cyclic property chain detected");
  });
});
