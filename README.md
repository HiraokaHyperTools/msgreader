# msgreader
Outlook Item File (.msg) reader in JavaScript Npm Module

Original project: https://github.com/ykarpovich/msg.reader

Online demo: http://ykarpovich.github.io/msg.reader/examples/example.html

This repo contains the core of the original project as npm package.
## How to use
```javascript
import fs from 'fs'
import MsgReader from '@freiraum/msgreader'

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
