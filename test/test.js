const fs = require('fs');

function removeCompressedRtf(msg) {
  const attachments = msg.attachments.map(
    sub => {
      const newSub = Object.assign({}, sub);
      if (newSub.innerMsgContentFields) {
        newSub.innerMsgContentFields = removeCompressedRtf(sub.innerMsgContentFields);
      }
      return newSub;
    }
  );

  const newMsg = Object.assign({}, msg);
  delete newMsg.compressedRtf;
  newMsg.attachments = attachments;
  return newMsg;
}

const generateJsonData = false;

function use(testMsgInfo, jsonFilePath) {
  if (generateJsonData) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(testMsgInfo, null, 1));
  }
  else {
    assert.deepStrictEqual(
      testMsgInfo,
      JSON.parse(fs.readFileSync(jsonFilePath))
    );
  }
}

const { decompressRTF } = require('@kenjiuno/decompressrtf');

function useRtf(testMsgInfo, rtfFilePath) {
  const { compressedRtf } = testMsgInfo;
  const rtf = decompressRTF(compressedRtf);

  if (generateJsonData) {
    fs.writeFileSync(rtfFilePath, Buffer.from(rtf));
  }
  else {
    assert.deepStrictEqual(
      rtf,
      [...fs.readFileSync(rtfFilePath)]
    );
  }
}

const assert = require('assert');
const { TypeEnum } = require('../lib/Reader');
describe('MsgReader', function () {
  const MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test1.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/test1.json');
    });
    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/test1.rtf');
    });
  });

  describe('test2.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test2.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachment0 = testMsg.getAttachment(0);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/test2.json');
    });

    it('verify attachment: A.txt', function () {
      assert.deepStrictEqual(
        testMsgAttachment0,
        {
          fileName: 'A.txt',
          content: new Uint8Array([97, 116, 116, 97, 99, 104, 32, 116, 101, 115, 116])
        }
      );
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/test2.rtf');
    });
  });

  describe('msgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachment0 = testMsg.getAttachment(0);
    const testMsgAttachments0 = testMsg.getAttachment(testMsgInfo.attachments[0]);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/msgInMsg.json');
    });

    it('testMsgAttachment0 === testMsgAttachments0', function () {
      assert.deepStrictEqual(testMsgAttachment0, testMsgAttachments0);
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();

      const subMsg = removeCompressedRtf(subInfo);
      use(subMsg, 'test/msgInMsg-attachments0.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/msgInMsg.rtf');
    });
  });


  describe('msgInMsgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachments0 = testMsg.getAttachment(
      testMsgInfo.attachments[0]
    );
    const testMsgAttachments0AndItsAttachments0 = testMsg.getAttachment(
      testMsgInfo.attachments[0].innerMsgContentFields.attachments[0]
    );

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/msgInMsgInMsg.json');
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();
      const subMsg = removeCompressedRtf(subInfo);

      use(subMsg, 'test/msgInMsgInMsg-attachments0.json');
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0AndItsAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0AndItsAttachments0.content);
      const subInfo = subReader.getFileData();
      const subMsg = removeCompressedRtf(subInfo);

      use(subMsg, 'test/msgInMsgInMsg-attachments0-attachments0.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/msgInMsgInMsg.rtf');
    });
  });

  describe('Subject.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/Subject.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/Subject.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/Subject.rtf');
    });
  });

  describe('sent.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/sent.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/sent.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/sent.rtf');
    });
  });

  describe('sent2.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/sent2.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/sent2.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/sent2.rtf');
    });
  });

  describe('longerFat.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/longerFat.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachments0 = testMsg.getAttachment(testMsgInfo.attachments[0]);

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();
      const subMsg = removeCompressedRtf(subInfo);

      use(subMsg, 'test/longerFat-attachments0.json');
    });
  });

  describe('longerDifat.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/longerDifat.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachments0 = testMsg.getAttachment(testMsgInfo.attachments[0]);

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();
      const subMsg = removeCompressedRtf(subInfo);

      use(subMsg, 'test/longerDifat-attachments0.json');
    });
  });

  describe('attachAndInline.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/attachAndInline.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/attachAndInline.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/attachAndInline.rtf');
    });
  });

  describe('voteItems.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/voteItems.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/voteItems.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/voteItems.rtf');
    });
  });

  describe('voteNo.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/voteNo.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/voteNo.json');
    });
  });

  describe('voteYes.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/voteYes.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/voteYes.json');
    });
  });

  describe('A schedule.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/A schedule.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/A schedule.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/A schedule.rtf');
    });
  });

  describe('A memo.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/A memo.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      const msg = removeCompressedRtf(testMsgInfo);
      use(msg, 'test/A memo.json');
    });

    it('compare rtf', function () {
      useRtf(testMsgInfo, 'test/A memo.rtf');
    });
  });
});


describe('Burner', function () {
  const burn = require('../lib/Burner').burn;
  const Reader = require('../lib/Reader').Reader;

  const test = (x) => {
    const array = burn([
      {
        name: "Root Entry",
        type: TypeEnum.ROOT,
        length: 0,
        children: [1],
      },
      {
        name: "file",
        type: TypeEnum.DOCUMENT,
        length: x,
        binaryProvider: () => new Uint8Array(x),
      }
    ]);

    //require('fs').writeFileSync(x + ".msg", array);
    const reader = new Reader(array);
    reader.parse();
  };

  it('known boundary tests', function () {
    test(4095);
    test(4096);
    test(8192);
    test(64000);
    test(64513);
    test(129537);
    test(1024 * 8192);
    test(1024 * 8192 * 2);
    test(1024 * 8192 * 3);
  });
});

describe('toHexStr', function () {
  const toHexStr = require('../lib/utils').toHexStr;
  it('tests', function () {
    assert.strictEqual(toHexStr(0x00, 2), "00");
    assert.strictEqual(toHexStr(0x01, 2), "01");
    assert.strictEqual(toHexStr(0x10, 2), "10");
    assert.strictEqual(toHexStr(0x11, 2), "11");
    assert.strictEqual(toHexStr(0x0000, 4), "0000");
    assert.strictEqual(toHexStr(0x1234, 4), "1234");
    assert.strictEqual(toHexStr(0x5678, 4), "5678");
    assert.strictEqual(toHexStr(0x9abc, 4), "9abc");
    assert.strictEqual(toHexStr(0xdef0, 4), "def0");
    assert.strictEqual(toHexStr(0xfeff, 4), "feff");
    assert.strictEqual(toHexStr(0xfffe, 4), "fffe");
    assert.strictEqual(toHexStr(0xa5a5, 4), "a5a5");
    assert.strictEqual(toHexStr(0x5a5a, 4), "5a5a");
  });
});

describe('DataStream', function () {
  const DataStream = require('../lib/DataStream').default;

  const buff = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  it('little.readUint32', function () {
    const ds = new DataStream(buff, 0, DataStream.LITTLE_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x03020100);
    assert.strictEqual(ds.readUint32(), 0x07060504);
    assert.strictEqual(ds.readUint32(), 0x0b0a0908);
    assert.strictEqual(ds.readUint32(), 0x0f0e0d0c);
  });
  it('big.readUint32', function () {
    const ds = new DataStream(buff, 0, DataStream.BIG_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x00010203);
    assert.strictEqual(ds.readUint32(), 0x04050607);
    assert.strictEqual(ds.readUint32(), 0x08090a0b);
    assert.strictEqual(ds.readUint32(), 0x0c0d0e0f);
  });
  it('little.offset.readUint32', function () {
    const ds = new DataStream(buff, 4, DataStream.LITTLE_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x07060504);
    assert.strictEqual(ds.readUint32(), 0x0b0a0908);
    assert.strictEqual(ds.readUint32(), 0x0f0e0d0c);
  });
  it('big.offset.readUint32', function () {
    const ds = new DataStream(buff, 4, DataStream.BIG_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x04050607);
    assert.strictEqual(ds.readUint32(), 0x08090a0b);
    assert.strictEqual(ds.readUint32(), 0x0c0d0e0f);
  });
  it('little.buffer.readUint32', function () {
    const ds = new DataStream(buff.buffer, 0, DataStream.LITTLE_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x03020100);
    assert.strictEqual(ds.readUint32(), 0x07060504);
    assert.strictEqual(ds.readUint32(), 0x0b0a0908);
    assert.strictEqual(ds.readUint32(), 0x0f0e0d0c);
  });
  it('little.buffer.offset.readUint32', function () {
    const ds = new DataStream(buff.buffer, 4, DataStream.LITTLE_ENDIAN);
    assert.strictEqual(ds.readUint32(), 0x07060504);
    assert.strictEqual(ds.readUint32(), 0x0b0a0908);
    assert.strictEqual(ds.readUint32(), 0x0f0e0d0c);
  });

  it('little.readUint32Array', function () {
    const ds = new DataStream(buff, 0, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readUint32Array()], [0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c]);
  });
  it('little.readInt32Array', function () {
    const ds = new DataStream(buff, 0, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readInt32Array()], [0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c]);
  });
  it('little.readUint16Array', function () {
    const ds = new DataStream(buff, 0, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readUint16Array()], [0x0100, 0x0302, 0x0504, 0x0706, 0x0908, 0x0b0a, 0x0d0c, 0x0f0e]);
  });
  it('little.readInt16Array', function () {
    const ds = new DataStream(buff, 0, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readInt16Array()], [0x0100, 0x0302, 0x0504, 0x0706, 0x0908, 0x0b0a, 0x0d0c, 0x0f0e]);
  });

  it('little.readUint32Array +offset', function () {
    const ds = new DataStream(buff, 8, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readUint32Array()], [0x0b0a0908, 0x0f0e0d0c]);
  });
  it('little.readInt32Array +offset', function () {
    const ds = new DataStream(buff, 8, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readInt32Array()], [0x0b0a0908, 0x0f0e0d0c]);
  });
  it('little.readUint16Array +offset', function () {
    const ds = new DataStream(buff, 8, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readUint16Array()], [0x0908, 0x0b0a, 0x0d0c, 0x0f0e]);
  });
  it('little.readInt16Array +offset', function () {
    const ds = new DataStream(buff, 8, DataStream.LITTLE_ENDIAN);
    assert.notStrictEqual([...ds.readInt16Array()], [0x0908, 0x0b0a, 0x0d0c, 0x0f0e]);
  });
});


describe('msftUuidStringify', function () {
  const { msftUuidStringify } = require('../lib/utils');

  it("basic", function () {
    assert.strictEqual(
      msftUuidStringify(
        [
          0x33, 0x22, 0x11, 0x00, 0x55, 0x44, 0x77, 0x66,
          0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
        ],
        0
      ),
      "00112233-4455-6677-8899-aabbccddeeff"
    );
    assert.strictEqual(
      msftUuidStringify(
        [
          0xff,
          0x33, 0x22, 0x11, 0x00, 0x55, 0x44, 0x77, 0x66,
          0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff
        ],
        1
      ),
      "00112233-4455-6677-8899-aabbccddeeff"
    );
  });
});

describe('toHex', function () {
  const { toHex1, toHex2, toHex4 } = require('../lib/utils');
  it("toHex1", function () {
    assert.strictEqual(toHex1(0x12), "12");
    assert.strictEqual(toHex1(0xab), "ab");
  });
  it("toHex2", function () {
    assert.strictEqual(toHex2(0x1234), "1234");
    assert.strictEqual(toHex2(0xabcd), "abcd");
  });
  it("toHex4", function () {
    assert.strictEqual(toHex4(0x12345678), "12345678");
    assert.strictEqual(toHex4(0xabcdef01), "abcdef01");
  });
});
