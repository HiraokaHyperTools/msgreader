const { Command } = require('commander');
const program = new Command();

const MsgReader = require('./lib/MsgReader').default;
const { props, typeNames } = require('./lib/Defs');
const { Reader, TypeEnum } = require('./lib/Reader');
const { burn } = require('./lib/Burner');

const fs = require('fs');
const path = require('path');
const { decompressRTF } = require('@kenjiuno/decompressrtf');

program
  .command('parse <msgFilePath>')
  .description('Parse msg file and print parsed structure')
  .option('-f, --full-json', 'print full JSON')
  .option('-i, --include-raw-props', 'include raw (and also unknown) props')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath)
    const testMsg = new MsgReader(msgFileBuffer)
    testMsg.parserConfig = testMsg.parserConfig || {};
    if (options.includeRawProps) {
      testMsg.parserConfig.includeRawProps = true;
    }
    const testMsgInfo = testMsg.getFileData();
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
        attachments.push({
          fileName: prefix + att.name + ".msg",
          attachmentRef: att,
        })
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
        {
          const key = tag.toString(16).padStart(8, "0").toUpperCase();
          const prop = props.filter(it => it.key === key).shift();
          const type = typeNames[parseInt(key.substr(4), 16)];
          console.info(
            "msgIdx:", fields.msgIndex,
            "dataType:", `'${fields.dataType}'`,
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
  .command('expose <msgFilePath> <exportToDir>')
  .description('Expose files/folders in Compound File Binary Format (CFBF)')
  .action((msgFilePath, exportToDir, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath);
    const store = new Reader(msgFileBuffer);
    store.parse();
    function expose(folder, saveTo) {
      fs.mkdir(saveTo, { recursive: true }, (err) => {
        if (err) {
          return;
        }
        for (let fileName of folder.fileNames()) {
          const array = folder.readFile(fileName);
          const path = saveTo + "/" + fileName;
          console.info(path);
          fs.writeFileSync(path, (array === null) ? [] : array);
        }
        for (let subFolder of folder.subFolders()) {
          expose(subFolder, saveTo + "/" + subFolder.name);
        }
      });
    }
    expose(store.rootFolder(), exportToDir);
  });


program
  .command('makecfbf <msgFilePath> <importFromDir>')
  .description('Create a Compound File Binary Format (CFBF) from files/folders')
  .action((msgFilePath, importFromDir, options) => {
    const entries = [
      {
        name: "Root Entry",
        type: TypeEnum.ROOT,
        children: [],
        length: 0,
      }
    ];

    function addFolder(dir, parentIndex) {
      for (const fileName of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, fileName);
        const stat = fs.statSync(fullPath);
        const index = entries.length;
        entries[parentIndex].children.push(index);
        if (stat.isDirectory()) {
          entries.push({
            name: fileName,
            type: TypeEnum.DIRECTORY,
            children: [],
            length: 0,
          });
          addFolder(fullPath, index);
        }
        else {
          entries.push({
            name: fileName,
            type: TypeEnum.DOCUMENT,
            binaryProvider: () => {
              const b = fs.readFileSync(fullPath);
              const a = new Uint8Array(b, b.byteOffset, b.byteLength);
              a.set(b);
              return a;
            },
            length: stat.size,
          });
        }
      }
    }

    addFolder(importFromDir, 0);

    const array = burn(entries);
    fs.writeFileSync(msgFilePath, array);
  });

program
  .command('html <msgFilePath>')
  .description('Parse msg file and display 1013001f:bodyHtml or 10130102:html')
  .option('-e, --encoding <encoding>', 'The encoding type to decode binary html.', 'utf8')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath);
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    if (testMsgInfo.html !== undefined) {
      console.log(Buffer.from(testMsgInfo.html).toString(options.encoding));
    }
    else if (testMsgInfo.bodyHtml !== undefined) {
      console.log(testMsgInfo.bodyHtml);
    }
    else {
      console.warn("no html is contained.");
    }
  });

program
  .command('walk <msgFilePath>')
  .description('Walk entire msg file as a raw CFBF')
  .action((msgFilePath, options) => {
    const msgFileBuffer = fs.readFileSync(msgFilePath);
    const reader = new Reader(msgFileBuffer);
    reader.parse();

    function walk(folder, prefix) {
      console.info("Walking folder:", prefix);
      for (let fileSet of folder.fileNameSets()) {
        const contents = fileSet.provider();
        console.info("Verify file:", fileSet.name, "(", fileSet.length, ")", "read", contents.length, "bytes");
        if (fileSet.length != contents.length) {
          throw new Error();
        }
      }
      for (let subFolder of folder.subFolders()) {
        walk(subFolder, `${prefix}${subFolder.name}/`);
      }
    }

    walk(reader.rootFolder(), "/");
  });

program
  .command('dummy1')
  .action(() => {
    const msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer);
    const testMsgInfo = testMsg.getFileData();
    const testMsgAttachment0 = testMsg.getAttachment(0);
    console.log(testMsgAttachment0);
  });

program
  .command('dummy2')
  .action(() => {
    const msgFileBuffer = fs.readFileSync('test/msgInMsg.msg');
    const testMsg = new MsgReader(msgFileBuffer)
    const testMsgInfo = testMsg.getFileData()

    for (const att of testMsgInfo.attachments) {
      const attachment = testMsg.getAttachment(att);
      console.log(attachment.fileName);

      //console.log(Buffer.from(attachment.content).toString('base64'));
      fs.writeFileSync("save-" + attachment.fileName, attachment.content);
    }
  });

program
  .parse(process.argv);
