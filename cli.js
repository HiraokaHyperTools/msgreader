const program = require('commander');

const MsgReader = require('./lib/MsgReader').default;
const { props, typeNames } = require('./lib/Defs');
const { Store } = require('./lib/CFBF');

const fs = require('fs');
const path = require('path');
const { decompressRTF } = require('@kenjiuno/decompressrtf');

program
  .command('parse <msgFilePath>')
  .description('Parse msg file and print parsed structure')
  .option('-f, --full-json', 'print full JSON')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    const testMsgInfo = testMsg.getFileData()
    console.log(
      options.fullJson
        ? JSON.stringify(testMsgInfo, null, 2)
        : testMsgInfo
    );
  });

program
  .command('rtf <msgFilePath> [saveToRtfFilePath]')
  .description('Parse msg file and print decompressed rtf')
  .action((msgFilePath, saveToRtfFilePath) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    const testMsgInfo = testMsg.getFileData()

    const body = Buffer.from(decompressRTF(testMsgInfo.compressedRtf))

    if (typeof saveToRtfFilePath === "string" && saveToRtfFilePath.length >= 1) {
      fs.writeFileSync(saveToRtfFilePath, body);
    }
    else {
      console.log(body.toString("utf8"));
    }
  });

function listAttachmentsRecursively(fieldsData, delimiter) {
  const attachments = []

  const walk = (fieldsData, prefix, attachments) => {
    for (const att of fieldsData.attachments) {
      if (att.innerMsgContent) {
        walk(att.innerMsgContentFields, att.name + delimiter, attachments);
      }
      else {
        attachments.push({
          fileName: prefix + att.fileName,
          attachmentRef: att,
        })
      }
    }
  }

  walk(fieldsData, "", attachments)

  return attachments
}

program
  .command('list-att <msgFilePath>')
  .description('Parse msg file and list attachment file names')
  .action((msgFilePath) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    const testMsgInfo = testMsg.getFileData()

    const attachments = listAttachmentsRecursively(testMsgInfo, "_");
    for (let attachment of attachments) {
      console.log(attachment.fileName)
    }
  });

program
  .command('save-att <msgFilePath> <saveToDir>')
  .description('Parse msg file and write all attachment files')
  .action((msgFilePath, saveToDir) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    const testMsgInfo = testMsg.getFileData()

    fs.mkdirSync(path.resolve(saveToDir), { recursive: true })

    const attachments = listAttachmentsRecursively(testMsgInfo, "_");
    for (let attachment of attachments) {
      const attFilePath = path.resolve(saveToDir, attachment.fileName);
      fs.writeFileSync(attFilePath, testMsg.getAttachment(attachment.attachmentRef).content)
    }
  });

program
  .command('dump <msgFilePath>')
  .description('Dump msg file and print data')
  .option('-p, --print-raw-data', 'print raw data')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    let msgIndex = 0
    testMsg.parserConfig = {
      propertyObserver: (fields, tag, raw) => {
        if (fields.msgIndex === undefined) {
          fields.msgIndex = msgIndex++;
        }
        if (fields.dataType === "msg") {
          const key = tag.toString(16).padStart(8, "0").toUpperCase();
          const prop = props.filter(it => it.key === key).shift();
          const type = typeNames[parseInt(key.substr(4), 16)];
          console.info(
            "msgIdx:", fields.msgIndex,
            "tag:", `0x${key}`,
            "name:", prop && prop.name || null,
            "type:", type && type || null,
            "size:", raw && raw.byteLength,
            "data:", options.printRawData ? raw : undefined,
          )
        }
      }
    }
    const testMsgInfo = testMsg.getFileData()
  });

program
  .command('try <msgFilePath>')
  .description('Test CFBF')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath);
    const store = new Store(msgFileBuffer);
    store.parse();
    console.log(store.propertyData);
    store.readProperty(store.propertyData[2]);
    store.readProperty(store.propertyData[27]);
    store.readProperty(store.propertyData[32]);
  });

program
  .parse(process.argv);
