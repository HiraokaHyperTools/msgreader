const fs = require('fs');

const assert = require('assert');
describe('MsgReader', function () {
  const MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test1.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    it('has no attachments', function () {
      assert.deepStrictEqual(testMsgInfo.attachments, []);
    });
    it('has 2 recipients', function () {
      assert.deepStrictEqual(testMsgInfo.recipients, [
        {
          dataType: "recipient", name: 'to@example.com', email: 'to@example.com', recipType: "to"
        },
        {
          dataType: "recipient", name: 'cc@example.com', email: 'cc@example.com', recipType: "cc"
        }
      ]);
    });
    it('has a title', function () {
      assert.strictEqual(testMsgInfo.subject, "title");
    });
    it('has a body', function () {
      assert.strictEqual(testMsgInfo.body, "body\r\n");
    });
  });

  describe('test2.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test2.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    testMsg.getFileData();
    const testMsgAttachment0 = testMsg.getAttachment(0);

    it('has one attachment: A.txt', function () {
      assert.deepStrictEqual(
        {
          fileName: 'A.txt',
          content: new Uint8Array([97, 116, 116, 97, 99, 104, 32, 116, 101, 115, 116])
        },
        testMsgAttachment0
      );
    });
  });

  describe('msgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('2 attachments', function () {
      assert.strictEqual(testMsgInfo.attachments.length, 2);
    });

    it('first is innerMsgContent', function () {
      assert.strictEqual(testMsgInfo.attachments[0].innerMsgContent, true);
    });

    it('second is not innerMsgContent', function () {
      assert.strictEqual(testMsgInfo.attachments[1].innerMsgContent, undefined);
    });

    it('first sub msg has no attachment', function () {
      assert.strictEqual(testMsgInfo.attachments[0].innerMsgContentFields.attachments.length, 0);
    });

  });


  describe('msgInMsgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('2 attachments', function () {
      assert.strictEqual(
        testMsgInfo.attachments.length,
        2
      );
    });

    it('first att is innerMsgContent', function () {
      assert.strictEqual(
        testMsgInfo.attachments[0].innerMsgContent,
        true
      );
    });

    it('second att is not innerMsgContent', function () {
      assert.strictEqual(
        testMsgInfo.attachments[1].innerMsgContent,
        undefined
      );
    });

    it('first sub msg has 2 attachments', function () {
      assert.strictEqual(
        testMsgInfo.attachments[0].innerMsgContentFields.attachments.length,
        2
      );
    });

    it('first sub msg: first att is innerMsgContent', function () {
      assert.strictEqual(
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[0].innerMsgContent,
        true
      );
    });

    it('first sub msg: second att is not innerMsgContent', function () {
      assert.strictEqual(
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[1].innerMsgContent,
        undefined
      );
    });

    it('first sub msg: first msg has no attachment', function () {
      assert.strictEqual(
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[0].innerMsgContentFields.attachments.length,
        0
      );
    });

  });

  describe('Subject.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/Subject.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('has 3 recipients', function () {
      assert.deepStrictEqual(
        testMsgInfo.recipients,
        [
          { dataType: "recipient", name: 'ToUser', email: 'to@example.com', recipType: 'to' },
          { dataType: "recipient", name: 'ToCc', email: 'cc@example.com', recipType: 'cc' },
          { dataType: "recipient", name: 'ToBcc', email: 'bcc@example.com', recipType: 'bcc' }
        ]
      );
    });
  });

  describe('sent.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/sent.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();

    it('dates', function () {
      assert.deepStrictEqual(testMsgInfo.creationTime, "Mon, 15 Feb 2021 08:19:21 GMT");
      assert.deepStrictEqual(testMsgInfo.lastModificationTime, "Mon, 15 Feb 2021 08:19:21 GMT");
      assert.deepStrictEqual(testMsgInfo.clientSubmitTime, "Mon, 15 Feb 2021 08:19:04 GMT");
      assert.deepStrictEqual(testMsgInfo.messageDeliveryTime, "Mon, 15 Feb 2021 08:19:00 GMT");
    });
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
});
