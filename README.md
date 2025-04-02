# msgreader

[![npm](https://img.shields.io/npm/v/@alisarioglu/msgreader)](https://www.npmjs.com/package/@alisarioglu/msgreader)
[![Build Status](https://dev.azure.com/HiraokaHyperTools/msgreader/_apis/build/status/HiraokaHyperTools.msgreader?branchName=master)](https://dev.azure.com/HiraokaHyperTools/msgreader/_build/latest?definitionId=7&branchName=master)

Outlook Item File (.msg) reader in JavaScript npm Module

Original projects:

- https://github.com/FreiraumIO/msgreader
- https://github.com/ykarpovich/msg.reader

This repo contains the code of the modified project.
And also it is published as a [npm package](https://www.npmjs.com/package/@kenjiuno/msgreader).

Links: [_typedoc documentation_](https://hiraokahypertools.github.io/msgreader/typedoc/) | [_online demo_](https://hiraokahypertools.github.io/msgreader_demo/) | [_online demo 2_](https://hiraokahypertools.github.io/msgreader_demo2/) | [_online demo 3_](https://hiraokahypertools.github.io/msgreader_demo3/)

## How to use

```javascript
import fs from 'fs'
import MsgReader from '@kenjiuno/msgreader'

const msgFileBuffer = fs.readFileSync('./data/test.msg')
const testMsg = new MsgReader(msgFileBuffer)
const testMsgInfo = testMsg.getFileData()
/**
  testMsgInfo contains:
  {
    attachments:[
      {
        dataId:62,
        contentLength:122784,
        fileName:'5AAoPFgV-nJ965R7o-98C38840-4454-4750-9AEF-F53DB3E37548.jpg',
        fileNameShort:'5AAOPF~1.JPG'
      }
    ],
    recipients:[
      {
        name:'christoph@freiraum.xyz'
      }
    ],
    senderName:'christoph@freiraum.xyz',
    body:' \r\n\r\n',
    headers:'Return-Path: <christoph@freiraum.xyz>\r\nReceived: from DESKTOPGBT9Q6P (HSI-KBW-109-193-162-142.hsi7.kabel-badenwuerttemberg.de. [109.193.162.142])\r\n        by smtp.gmail.com with ESMTPSA id q81sm10535131wmg.8.2018.03.23.09.06.30\r\n        for <christoph@freiraum.xyz>\r\n        (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);\r\n        Fri, 23 Mar 2018 09:06:30 -0700 (PDT)\r\nFrom: <christoph@freiraum.xyz>\r\nTo: <christoph@freiraum.xyz>\r\nSubject: asdf\r\nDate: Fri, 23 Mar 2018 17:06:29 +0100\r\nMessage-ID: <000001d3c2c0$e7ca4aa0$b75edfe0$@freiraum.xyz>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed;\r\n\tboundary="----=_NextPart_000_0001_01D3C2C9.498F75F0"\r\nX-Mailer: Microsoft Outlook 16.0\r\nThread-Index: AdPCwN90aOYoV24DTGKfv8JaCuci0g==\r\nContent-Language: de\r\n\r\n',
    subject:'asdf'
  }
**/
const testMsgAttachment0 = testMsg.getAttachment(testMsgInfo.attachments[0])
/**
  testMsgAttachment0 === testMsg.getAttachment[0] and both contain:
  { 
    fileName: '5AAoPFgV-nJ965R7o-98C38840-4454-4750-9AEF-F53DB3E37548.jpg',
    content: <Uint8Array> //content removed
  }
**/
```

### List attachment files

```javascript
  const msgFileBuffer = fs.readFileSync(msgFilePath)
  const testMsg = new MsgReader(msgFileBuffer)
  const testMsgInfo = testMsg.getFileData()

  for (const att of testMsgInfo.attachments) {
    console.log(att.fileName);
    // testMsg.getAttachment(att).content
  }
```

## Build msgreader locally

```bat
yarn
```

## Optional command line tool

This can be used for testing this tool.

```bat
C:\Proj\msgreader>node cli -h
Usage: cli [options] [command]

Options:
  -h, --help                             output usage information

Commands:
  parse [options] <msgFilePath>          Parse msg file and print parsed structure
  rtf <msgFilePath> [saveToRtfFilePath]  Parse msg file and print decompressed rtf
  list-att <msgFilePath>                 Parse msg file and list attachment file names
  save-att <msgFilePath> <saveToDir>     Parse msg file and write all attachment files
```

Obtain decompressed RTF file from `test/test1.msg`:

```bat
C:\Proj\msgreader>node cli rtf test\test1.msg test1.rtf

C:\Proj\msgreader>type test1.rtf
{\rtf1\ansi\ansicpg1252\fromtext \fbidis \deff0{\fonttbl
{\f0\fswiss Arial;}
{\f1\fmodern Courier New;}
{\f2\fnil\fcharset2 Symbol;}
{\f3\fmodern\fcharset0 Courier New;}}
{\colortbl\red0\green0\blue0;\red0\green0\blue255;}
\uc1\pard\plain\deftab360 \f0\fs20 body\par
}
```

List attachment files in `test/test2.msg`:

```bat
C:\Proj\msgreader>node cli list-att test\test2.msg
A.txt
```

Extract attacument files into folder `test2`:

```bat
C:\Proj\msgreader>node cli save-att test\test2.msg test2
```

```bat
C:\Proj\msgreader>dir test2
 Volume in drive C has no label.
 Volume Serial Number is CA6D-4F59

 Directory of C:\Proj\msgreader\test2

2020/03/19  19:40    <DIR>          .
2020/03/19  19:40    <DIR>          ..
2020/03/19  19:40                11 A.txt
               1 File(s)             11 bytes
               2 Dir(s)   9,542,762,496 bytes free
```

```bat
C:\Proj\msgreader>type test2\A.txt
attach test
```

Checking date times from `sent.msg`:

```bat
node cli parse test\sent.msg

{
  dataType: 'msg',
  attachments: [],
  recipients: [
    {
      dataType: 'recipient',
      name: "'xmailuser@xmailserver.test'",
      email: 'xmailuser@xmailserver.test',
      recipType: 'to'
    }
  ],
  senderEmail: 'xmailuser@xmailserver.test',
  subject: 'Sent time',
  body: 'Test mail\r\n\r\n',
  senderName: 'xmailuser',
  compressedRtf: Uint8Array(1409) [
    ...
  ],
  creationTime: 'Mon, 15 Feb 2021 08:19:21 GMT',
  lastModificationTime: 'Mon, 15 Feb 2021 08:19:21 GMT',
  clientSubmitTime: 'Mon, 15 Feb 2021 08:19:04 GMT',
  messageDeliveryTime: 'Mon, 15 Feb 2021 08:19:00 GMT'
}
```
