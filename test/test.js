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
const { TypeEnum } = require('../lib/Reader');
describe('MsgReader', function () {
  const MsgReader = require('../lib/MsgReader').default;

  describe('test1.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/test1.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);
    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        testMsgInfo,
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "to@example.com",
              "email": "to@example.com",
              "recipType": "to"
            },
            {
              "addressType": "SMTP",
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
        }
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
        testMsgInfo,
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
          "subject": "",
          "creationTime": "Tue, 05 Mar 2019 07:41:09 GMT",
          "lastModificationTime": "Tue, 05 Mar 2019 07:41:09 GMT",
          "messageDeliveryTime": "Tue, 05 Mar 2019 07:41:04 GMT"
        }
      );
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
  });

  describe('msgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);
    const testMsgAttachment0 = testMsg.getAttachment(0);
    const testMsgAttachments0 = testMsg.getAttachment(testMsgInfo.attachments[0]);

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        testMsgInfo,
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "folderId": 38,
              "name": "Microsoft Outlook テスト メッセージ",
              "innerMsgContentFields": {
                "dataType": "msg",
                "attachments": [],
                "recipients": [
                  {
                    "addressType": "SMTP",
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
                "senderAddressType": "SMTP",
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
        }
      );
    });

    it('testMsgAttachment0 === testMsgAttachments0', function () {
      assert.deepStrictEqual(testMsgAttachment0, testMsgAttachments0);
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();
      removeCompressedRtf(subInfo);

      assert.deepStrictEqual(
        subInfo,
        {
          "dataType": "msg",
          "attachments": [],
          "compressedRtf": undefined,
          "recipients": [
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "xmailuser",
              "email": "xmailuser@xmailserver.test",
              "recipType": "to"
            }
          ],
          "subject": "Microsoft Outlook テスト メッセージ",
          "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
          "senderAddressType": "SMTP",
          "senderName": "Microsoft Outlook",
          "senderEmail": "xmailuser@xmailserver.test",
          "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
          "creationTime": "Thu, 10 Sep 2020 10:18:11 GMT",
          "lastModificationTime": "Thu, 10 Sep 2020 10:18:11 GMT",
          "messageDeliveryTime": "Tue, 12 May 2020 05:45:17 GMT"
        }
      );
    });

  });


  describe('msgInMsgInMsg.msg', function () {
    const msgFileBuffer = fs.readFileSync('test/msgInMsgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    removeCompressedRtf(testMsgInfo);
    const testMsgAttachments0 = testMsg.getAttachment(
      testMsgInfo.attachments[0]
    );
    const testMsgAttachments0AndItsAttachments0 = testMsg.getAttachment(
      testMsgInfo.attachments[0].innerMsgContentFields.attachments[0]
    );

    it('exact match with pre rendered data (except on compressedRtf)', function () {
      assert.deepStrictEqual(
        testMsgInfo,
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "folderId": 38,
              "name": "I have attachments!",
              "innerMsgContentFields": {
                "dataType": "msg",
                "attachments": [
                  {
                    "dataType": "attachment",
                    "folderId": 60,
                    "name": "Microsoft Outlook テスト メッセージ",
                    "innerMsgContentFields": {
                      "dataType": "msg",
                      "attachments": [],
                      "recipients": [
                        {
                          "addressType": "SMTP",
                          "dataType": "recipient",
                          "name": "xmailuser",
                          "email": "xmailuser@xmailserver.test",
                          "recipType": "to"
                        }
                      ],
                      "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
                      "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
                      "subject": "Microsoft Outlook テスト メッセージ",
                      "senderAddressType": "SMTP",
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
        }
      );
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0.content);
      const subInfo = subReader.getFileData();
      removeCompressedRtf(subInfo);

      assert.deepStrictEqual(
        subInfo,
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "innerMsgContentFields": {
                "dataType": "msg",
                "attachments": [],
                "recipients": [
                  {
                    "addressType": "SMTP",
                    "dataType": "recipient",
                    "name": "xmailuser",
                    "email": "xmailuser@xmailserver.test",
                    "recipType": "to"
                  }
                ],
                "subject": "Microsoft Outlook テスト メッセージ",
                "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
                "senderAddressType": "SMTP",
                "senderName": "Microsoft Outlook",
                "senderEmail": "xmailuser@xmailserver.test",
                "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
                "compressedRtf": undefined
              },
              "innerMsgContent": true,
              "folderId": 41,
              "name": "Microsoft Outlook テスト メッセージ"
            },
            {
              "dataType": "attachment",
              "name": "green.png",
              "dataId": 92,
              "contentLength": 134,
              "extension": ".png",
              "fileNameShort": "green.png",
              "fileName": "green.png"
            }
          ],
          "recipients": [],
          "subject": "I have attachments!",
          "body": "I have attachments!\r\n",
          "compressedRtf": undefined,
          "creationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "lastModificationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "messageDeliveryTime": "Thu, 10 Sep 2020 10:18:08 GMT"
        }
      );
    });

    it('re-parse and verify rebuilt inner testMsgAttachments0AndItsAttachments0', function () {
      const subReader = new MsgReader(testMsgAttachments0AndItsAttachments0.content);
      const subInfo = subReader.getFileData();
      removeCompressedRtf(subInfo);

      assert.deepStrictEqual(
        subInfo,
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "xmailuser",
              "email": "xmailuser@xmailserver.test",
              "recipType": "to"
            }
          ],
          "subject": "Microsoft Outlook テスト メッセージ",
          "headers": "Return-Path: <xmailuser@xmailserver.test>\r\nDelivered-To: xmailuser@xmailserver.test\r\nX-AuthUser: xmailuser@xmailserver.test\r\nReceived: from H270 ([127.0.0.1]:56695)\r\n\tby xmailserver.test with [XMail 1.27 ESMTP Server]\r\n\tid <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;\r\n\tTue, 12 May 2020 14:45:17 +0900\r\nFrom: Microsoft Outlook <xmailuser@xmailserver.test>\r\nTo: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>\r\nSubject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=\r\nMIME-Version: 1.0\r\nContent-Type: text/html;\r\n    charset=\"utf-8\"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n",
          "senderAddressType": "SMTP",
          "senderName": "Microsoft Outlook",
          "senderEmail": "xmailuser@xmailserver.test",
          "body": "この電子メール メッセージは、アカウントの設定のテスト中に、Microsoft Outlook から自動送信されたものです。 \r\n",
          "compressedRtf": undefined,
          "creationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "lastModificationTime": "Thu, 10 Sep 2020 10:21:42 GMT",
          "messageDeliveryTime": "Tue, 12 May 2020 05:45:17 GMT"
        }
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
        testMsgInfo,
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "ToUser",
              "email": "to@example.com",
              "recipType": "to"
            },
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "ToCc",
              "email": "cc@example.com",
              "recipType": "cc"
            },
            {
              "addressType": "SMTP",
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
        testMsgInfo,
        {
          "dataType": "msg",
          "attachments": [],
          "recipients": [
            {
              "addressType": "SMTP",
              "dataType": "recipient",
              "name": "'xmailuser@xmailserver.test'",
              "email": "xmailuser@xmailserver.test",
              "recipType": "to"
            }
          ],
          "senderAddressType": "SMTP",
          "senderEmail": "xmailuser@xmailserver.test",
          "subject": "Sent time",
          "body": "Test mail\r\n\r\n",
          "senderName": "xmailuser",
          "compressedRtf": undefined,
          "creationTime": "Mon, 15 Feb 2021 08:19:21 GMT",
          "lastModificationTime": "Mon, 15 Feb 2021 08:19:21 GMT",
          "clientSubmitTime": "Mon, 15 Feb 2021 08:19:04 GMT",
          "messageDeliveryTime": "Mon, 15 Feb 2021 08:19:00 GMT"
        }
      );
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
      removeCompressedRtf(subInfo);

      assert.deepStrictEqual(
        subInfo,
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "name": "64KB.bin",
              "dataId": 35,
              "contentLength": 65536,
              "extension": ".bin",
              "fileNameShort": "64KB.bin",
              "fileName": "64KB.bin"
            }
          ],
          "recipients": [],
          "subject": "Has 64KB.bin",
          "body": " \r\n",
          "compressedRtf": undefined,
          "creationTime": "Thu, 15 Jul 2021 13:31:27 GMT",
          "lastModificationTime": "Thu, 15 Jul 2021 13:31:27 GMT",
          "messageDeliveryTime": "Thu, 15 Jul 2021 13:30:21 GMT"
        }
      );
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
      removeCompressedRtf(subInfo);

      assert.deepStrictEqual(
        subInfo,
        {
          "dataType": "msg",
          "attachments": [
            {
              "dataType": "attachment",
              "name": "8MiB.bin",
              "dataId": 37,
              "contentLength": 8388608,
              "extension": ".bin",
              "fileNameShort": "8MiB.bin",
              "fileName": "8MiB.bin"
            }
          ],
          "recipients": [],
          "subject": "Has 8MiB.bin",
          "body": " \r\n",
          "compressedRtf": undefined,
          "creationTime": "Thu, 15 Jul 2021 13:42:25 GMT",
          "lastModificationTime": "Thu, 15 Jul 2021 13:42:25 GMT",
          "messageDeliveryTime": "Thu, 15 Jul 2021 13:41:55 GMT"
        }
      );
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

  it.skip('sequential boundary tests', function () {
    this.timeout(1000 * 60 * 60);
    //64513
    //129537
    // 129K 6sec
    //   1M 4min
    for (let x = 1024 * 1024; x < 9 * 1024 * 1024; x++) {
      try {
        test(x);
      }
      catch (ex) {
        throw new Error(`${x}`);
      }
    }
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
