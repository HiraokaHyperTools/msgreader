const fs = require('fs');

function removeCompressedRtf(msg) {
  msg.compressedRtf = undefined;

  msg.attachments.forEach(
    it => {
      if (it.innerMsgContentFields) {
        removeCompressedRtf(it.innerMsgContentFields);
      }
    }
  );

  return msg;
}


const assert = require('assert');
describe('MsgReader', function () {
  const MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test1.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);
    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "dataType": "recipient",
              "name": "to@example.com",
              "email": "to@example.com",
              "recipType": "to"
            },
            {
              "dataType": "recipient",
              "name": "cc@example.com",
              "email": "cc@example.com",
              "recipType": "cc"
            }
          ],
          "compressedRtf": undefined,
          "subject": "title",
          "body": "body\r\n",
          "creationTime": "Tue, 05 Mar 2019 07:22:33 GMT",
          "lastModificationTime": "Tue, 05 Mar 2019 07:22:33 GMT",
          "messageDeliveryTime": "Tue, 05 Mar 2019 07:22:17 GMT"
        },
        testMsgInfo
      );
    });
  });

  describe('test2.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test2.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);
    const testMsgAttachment0 = testMsg.getAttachment(0);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [{
            "dataType": "attachment",
            "name": "A.txt",
            "fileNameShort": "A.txt",
            "dataId": 40,
            "contentLength": 11,
            "extension": ".txt",
            "fileName": "A.txt"
          }],
          "compressedRtf": undefined,
          "recipients": [],
          "body": " \r\n",
          "subject": null,
          "creationTime": "Tue, 05 Mar 2019 07:41:09 GMT",
          "lastModificationTime": "Tue, 05 Mar 2019 07:41:09 GMT",
          "messageDeliveryTime": "Tue, 05 Mar 2019 07:41:04 GMT"
        },
        testMsgInfo
      );
    });

    it('verify attachment: A.txt', function () {
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
    removeCompressedRtf(testMsgInfo);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "name": "Microsoft Outlook テスト メッセージ",
              "innerMsgContentFields": {
                "dataType": "msg",
                "attachments": [],
                "recipients": [
                  {
                    "dataType": "recipient",
                    "name": "xmailuser",
                    "email": "xmailuser@xmailserver.test",
                    "recipType": "to"
                  }
                ],
                "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
                "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
                "subject": "Microsoft Outlook テスト メッセージ",
                "senderName": "Microsoft Outlook",
                "senderEmail": "xmailuser@xmailserver.test",
                "compressedRtf": undefined,
              },
              "innerMsgContent": true
            },
            {
              "dataType": "attachment",
              "name": "green.png",
              "fileNameShort": "green.png",
              "dataId": 90,
              "contentLength": 134,
              "extension": ".png",
              "fileName": "green.png"
            }
          ],
          "recipients": [],
          "compressedRtf": undefined,
          "subject": "I have attachments!",
          "body": "I have attachments!\r\n",
          "creationTime": "Thu, 10 Sep 2020 10:18:11 GMT",
          "lastModificationTime": "Thu, 10 Sep 2020 10:18:11 GMT",
          "messageDeliveryTime": "Thu, 10 Sep 2020 10:18:08 GMT"
        },
        testMsgInfo
      );
    });

  });


  describe('msgInMsgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "name": "I have attachments!",
              "innerMsgContentFields": {
                "dataType": "msg",
                "attachments": [
                  {
                    "dataType": "attachment",
                    "name": "Microsoft Outlook テスト メッセージ",
                    "innerMsgContentFields": {
                      "dataType": "msg",
                      "attachments": [],
                      "recipients": [
                        {
                          "dataType": "recipient",
                          "name": "xmailuser",
                          "email": "xmailuser@xmailserver.test",
                          "recipType": "to"
                        }
                      ],
                      "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
                      "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
                      "subject": "Microsoft Outlook テスト メッセージ",
                      "senderName": "Microsoft Outlook",
                      "senderEmail": "xmailuser@xmailserver.test",
                      "compressedRtf": undefined
                    },
                    "innerMsgContent": true
                  },
                  {
                    "dataType": "attachment",
                    "name": "green.png",
                    "fileNameShort": "green.png",
                    "dataId": 112,
                    "contentLength": 134,
                    "extension": ".png",
                    "fileName": "green.png"
                  }
                ],
                "recipients": [],
                "subject": "I have attachments!",
                "body": "I have attachments!\r\n",
                "compressedRtf": undefined
              },
              "innerMsgContent": true
            },
            {
              "dataType": "attachment",
              "name": "blue.png",
              "fileNameShort": "blue.png",
              "dataId": 125,
              "contentLength": 134,
              "extension": ".png",
              "fileName": "blue.png"
            }
          ],
          "recipients": [],
          "compressedRtf": undefined,
          "subject": "I have sub attachments!",
          "body": "I have sub attachments!\r\n",
          "creationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "lastModificationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "messageDeliveryTime": "Thu, 10 Sep 2020 10:21:41 GMT"
        },
        testMsgInfo
      );
    });

  });

  describe('Subject.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/Subject.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "dataType": "recipient",
              "name": "ToUser",
              "email": "to@example.com",
              "recipType": "to"
            },
            {
              "dataType": "recipient",
              "name": "ToCc",
              "email": "cc@example.com",
              "recipType": "cc"
            },
            {
              "dataType": "recipient",
              "name": "ToBcc",
              "email": "bcc@example.com",
              "recipType": "bcc"
            }
          ],
          "compressedRtf": undefined,
          "subject": "Subject",
          "body": "Message\r\n",
          "creationTime": "Mon, 28 Sep 2020 11:28:52 GMT",
          "lastModificationTime": "Mon, 28 Sep 2020 11:28:52 GMT",
          "messageDeliveryTime": "Mon, 28 Sep 2020 11:28:39 GMT"
        }
        ,
        testMsgInfo
      );
    });
  });

  describe('sent.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/sent.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "dataType": "recipient",
              "name": "'xmailuser@xmailserver.test'",
              "email": "xmailuser@xmailserver.test",
              "recipType": "to"
            }
          ],
          "senderEmail": "xmailuser@xmailserver.test",
          "subject": "Sent time",
          "body": "Test mail\r\n\r\n",
          "senderName": "xmailuser",
          "compressedRtf": undefined,
          "creationTime": "Mon, 15 Feb 2021 08:19:21 GMT",
          "lastModificationTime": "Mon, 15 Feb 2021 08:19:21 GMT",
          "clientSubmitTime": "Mon, 15 Feb 2021 08:19:04 GMT",
          "messageDeliveryTime": "Mon, 15 Feb 2021 08:19:00 GMT"
        },
        testMsgInfo
      );
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
