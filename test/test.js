const fs = require('fs');

var assert = require('assert');
describe('MsgReader', function () {
  var MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    var msgFileBuffer = fs.readFileSync('test/test1.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();
    it('has no attachments', function () {
      assert.deepStrictEqual(testMsgInfo.attachments, []);
    });
    it('has 2 recipients', function () {
      assert.deepStrictEqual(testMsgInfo.recipients, [
        {
          name: 'to@example.com', email: 'to@example.com', recipType: "to"
        },
        {
          name: 'cc@example.com', email: 'cc@example.com', recipType: "cc"
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
    var msgFileBuffer = fs.readFileSync('test/test2.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    testMsg.getFileData();
    var testMsgAttachment0 = testMsg.getAttachment(0);

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
    var msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();

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
    var msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();

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
    var msgFileBuffer = fs.readFileSync('test/Subject.msg');
    var testMsg = new MsgReader(msgFileBuffer);
    var testMsgInfo = testMsg.getFileData();

    it('has 3 recipients', function () {
      it('has 2 recipients', function () {
        assert.deepStrictEqual(
          testMsgInfo.recipients,
          [
            { name: 'ToUser', email: 'to@example.com', recipType: 'to' },
            { name: 'ToCc', email: 'cc@example.com', recipType: 'cc' },
            { name: 'ToBcc', email: 'bcc@example.com', recipType: 'bcc' }
          ]
        );
      });
    });
  });
});
