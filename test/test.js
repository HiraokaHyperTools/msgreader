const fs = require('fs');

var assert = require('assert');
describe('MsgReader', function () {
  var MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    var msgFileBuffer = fs.readFileSync('test/test1.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();
    it('has no attachments', function () {
      assert.deepEqual(testMsgInfo.attachments, []);
    });
    it('has 2 recipients', function () {
      assert.deepEqual(testMsgInfo.recipients, [
        { name: 'to@example.com', email: 'to@example.com' },
        { name: 'cc@example.com', email: 'cc@example.com' }
      ]);
    });
    it('has a title', function () {
      assert.equal(testMsgInfo.subject, "title");
    });
    it('has a body', function () {
      assert.equal(testMsgInfo.body, "body\r\n");
    });
  });

  describe('test2.msg', function () {
    var msgFileBuffer = fs.readFileSync('test/test2.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    testMsg.getFileData();
    var testMsgAttachment0 = testMsg.getAttachment(0);

    it('has one attachment: A.txt', function () {
      assert.deepEqual(
        testMsgAttachment0,
        {
          fileName: 'A.txt',
          content: new Uint8Array([97, 116, 116, 97, 99, 104, 32, 116, 101, 115, 116])
        }
      );
    });
  });

  describe('msgInMsg.msg', function () {
    var msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();

    it('2 attachments', function () {
      assert.strictEqual(2, testMsgInfo.attachments.length);
    });

    it('first is innerMsgContent', function () {
      assert.strictEqual(true, testMsgInfo.attachments[0].innerMsgContent);
    });

    it('second is not innerMsgContent', function () {
      assert.strictEqual(undefined, testMsgInfo.attachments[1].innerMsgContent);
    });

    it('first sub msg has no attachment', function () {
      assert.strictEqual(0, testMsgInfo.attachments[0].innerMsgContentFields.attachments.length);
    });

  });


  describe('msgInMsgInMsg.msg', function () {
    var msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();

    it('2 attachments', function () {
      assert.strictEqual(2, testMsgInfo.attachments.length);
    });

    it('first att is innerMsgContent', function () {
      assert.strictEqual(true,
        testMsgInfo.attachments[0].innerMsgContent);
    });

    it('second att is not innerMsgContent', function () {
      assert.strictEqual(undefined,
        testMsgInfo.attachments[1].innerMsgContent);
    });

    it('first sub msg has 2 attachments', function () {
      assert.strictEqual(2,
        testMsgInfo.attachments[0].innerMsgContentFields.attachments.length);
    });

    it('first sub msg: first att is innerMsgContent', function () {
      assert.strictEqual(true,
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[0].innerMsgContent);
    });

    it('first sub msg: second att is not innerMsgContent', function () {
      assert.strictEqual(undefined,
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[1].innerMsgContent);
    });

    it('first sub msg: first msg has no attachment', function () {
      assert.strictEqual(0,
        testMsgInfo.attachments[0].innerMsgContentFields.attachments[0].innerMsgContentFields.attachments.length);
    });

  });
});
