/* Copyright 2016 Yury Karpovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 MSG Reader
 */

import CONST from './const'
import DataStream from './DataStream'
import { CFileSet, CFolder, Reader } from './Reader';
import { burn, Entry } from './Burner';

// MSG Reader implementation

class ParserConfig {
  propertyObserver?: (fields: FieldsData, tag: number, raw: Uint8Array | null) => void;
}

interface MsgData {
  fieldsData?: FieldsData;
  propertyData?: Property[];
}

/**
 * CONST.MSG.PROP.TYPE_ENUM
 */
enum TypeEnum {
  DIRECTORY = 1,
  DOCUMENT = 2,
  ROOT = 5,
}

interface Property {
  index: number;

  type: TypeEnum;
  name: string;
  previousProperty: number;
  nextProperty: number;
  childProperty: number;
  startBlock: number;
  sizeBlock: number;
  children?: number[];
}

/**
 * Some OXPROPS
 * 
 * Note that please sync with: CONST.MSG.FIELD.NAME_MAPPING
 */
interface SomeOxProps {
  /**
   * Contains the subject of the email message.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0037-PidTagSubject.md
   */
  subject?: string;

  /**
   * Contains the display name of the sending mailbox owner.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1A-PidTagSenderName.md
   */
  senderName?: string;

  /**
   * Contains the email address of the sending mailbox owner.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1F-PidTagSenderEmailAddress.md
   */
  senderEmail?: string;

  /**
   * Contains message body text in plain text format.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1000-PidTagBody.md
   */
  body?: string;

  /**
   * Contains transport-specific message envelope information for email.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/007D-PidTagTransportMessageHeaders.md
   */
  headers?: string;

  /**
   * Contains message body text in compressed RTF format.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1009-PidTagRtfCompressed.md
   */
  compressedRtf?: Uint8Array;

  /**
   * Contains a file name extension that indicates the document type of an attachment.
   * 
   * Target dataType = 'attachment'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3703-PidTagAttachExtension.md
   */
  extension?: string;

  /**
   * Contains an attachment's base file name and extension, excluding path.
   * 
   * Target dataType = 'attachment'.
   * 
   * @see https://docs.microsoft.com/en-US/office/client-developer/outlook/mapi/pidtagattachfilename-canonical-property
   */
  fileNameShort?: string;

  /**
   * Contains an attachment's long filename and extension, excluding path.
   * 
   * Target dataType = 'attachment'.
   * 
   * @see https://docs.microsoft.com/en-US/office/client-developer/outlook/mapi/pidtagattachlongfilename-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3707-PidTagAttachLongFilename.md
   */
  fileName?: string;

  /**
   * Contains a content identifier unique to the Message object that matches a

   * Target dataType = 'attachment'.
  * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3712-PidTagAttachContentId.md
   */
  pidContentId?: string;

  /**
   * Contains the display name of the folder.
   * 
   * Target dataType = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3001-PidTagDisplayName.md
   */
  name?: string;

  /**
   * Contains the email address of a Message object.
   * 
   * Target dataType = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3003-PidTagEmailAddress.md
   */
  email?: string;

  /**
   * Contains the time, in UTC, that the object was created.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3007-PidTagCreationTime.md
   */
  creationTime?: string;

  /**
   * Contains the time, in UTC, of the last modification to the object.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3008-PidTagLastModificationTime.md
   */
  lastModificationTime?: string;

  /**
   * Contains the current time, in UTC, when the email message is submitted.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0039-PidTagClientSubmitTime.md
   */
  clientSubmitTime?: string;

  /**
   * Specifies the time (in UTC) when the server received the message.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0E06-PidTagMessageDeliveryTime.md
   */
  messageDeliveryTime?: string;

  /**
   * This undocumented `creatorSMTPAddress` will be attached
   * when you send a mail via Exchange Online server.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://social.microsoft.com/Forums/partner/en-US/8e15ac6d-0404-41c0-9af7-26a06ca797bf/meaning-of-mapi-identifiers-0x5d0a-and-0x5d0b?forum=os_exchangeprotocols
   */
  creatorSMTPAddress?: string;

  /**
   * This undocumented `lastModifierSMTPAddress` will be attached
   * when you send a mail via Exchange Online server.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://social.microsoft.com/Forums/partner/en-US/8e15ac6d-0404-41c0-9af7-26a06ca797bf/meaning-of-mapi-identifiers-0x5d0a-and-0x5d0b?forum=os_exchangeprotocols
   */
  lastModifierSMTPAddress?: string;

  /**
   * Contains the SMTP address of the Message object.
   * 
   * Target dataType = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/39FE-PidTagSmtpAddress.md
   */
  smtpAddress?: string;

  /**
   * Contains the name of the last mail user to change the Message object.
   * 
   * A email address may be stored in `lastModifierName`, if it was sent through Exchange Server.
   * 
   * `lastModifierSMTPAddress` or `smtpAddress` may not be stored in some cases.
   * 
   * Target dataType = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3FFA-PidTagLastModifierName.md
   */
  lastModifierName?: string;
}

interface SomeParsedOxProps {
  recipType?: "to" | "cc" | "bcc";
}

interface FieldsData extends SomeOxProps, SomeParsedOxProps {
  dataType: null | "msg" | "attachment" | "recipient";
  contentLength?: number;
  dataId?: number;
  innerMsgContent?: true;
  innerMsgContentFields?: FieldsData;
  attachments?: FieldsData[];
  recipients?: FieldsData[];
  error?: string;
}

function fileTimeToUnixEpoch(time: number) {
  return (time - 116444736000000000) / 10000;
}

export default class MsgReader {
  reader: Reader;
  fieldsData: FieldsData;
  parserConfig: ParserConfig;
  innerMsgBurners: { [key: number]: () => Uint8Array };

  constructor(arrayBuffer: ArrayBuffer | DataView) {
    this.reader = new Reader(arrayBuffer);
  }

  private getFieldValue(fieldProperty: CFileSet, type: string): string | Uint8Array {
    const array = fieldProperty.provider();
    const ds = new DataStream(array, 0, DataStream.LITTLE_ENDIAN);

    const decodeAs = CONST.MSG.FIELD.TYPE_MAPPING[type];
    if (0) { }
    else if (decodeAs === "string") {
      return ds.readString(fieldProperty.length);
    }
    else if (decodeAs === "unicode") {
      return ds.readUCS2String(fieldProperty.length / 2);
    }

    return array;
  }

  private fieldsDataDocument(parserConfig: ParserConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const value = documentProperty.name.substring(12).toLowerCase();
    const fieldClass = value.substring(0, 4);
    const fieldType = value.substring(4, 8);

    parserConfig.propertyObserver(
      fields,
      parseInt(value.substring(0, 8), 16),
      documentProperty.provider()
    )

    const fieldName = CONST.MSG.FIELD.NAME_MAPPING[fieldClass];

    if (fieldName) {
      fields[fieldName] = this.getFieldValue(documentProperty, fieldType);
    }
    if (fieldClass == CONST.MSG.FIELD.CLASS_MAPPING.ATTACHMENT_DATA) {

      // attachment specific info
      fields.dataId = documentProperty.dataId;
      fields.contentLength = documentProperty.length;
    }
  }

  private getFieldType(fieldProperty: CFolder): string {
    const value = fieldProperty.name.substring(12).toLowerCase();
    return value.substring(4, 8);
  }

  private fieldsDataDirInner(parserConfig: ParserConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData): void {
    if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.ATTACHMENT) == 0) {
      // attachment
      const attachmentField: FieldsData = {
        dataType: "attachment",
      };
      fields.attachments.push(attachmentField);
      this.fieldsDataDir(parserConfig, dirProperty, rootFolder, attachmentField, "attachment");
    } else if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.RECIPIENT) == 0) {
      // recipient
      const recipientField: FieldsData = {
        dataType: "recipient",
      };
      fields.recipients.push(recipientField);
      this.fieldsDataDir(parserConfig, dirProperty, rootFolder, recipientField, "recip");
    } else if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.NAMEID) == 0) {
      // unknown, read
      this.fieldsDataDir(parserConfig, dirProperty, rootFolder, fields, "nameid");
    } else {
      // other dir
      const childFieldType = this.getFieldType(dirProperty);
      if (childFieldType != CONST.MSG.FIELD.DIR_TYPE.INNER_MSG) {
        // ignore
      } else {
        const innerMsgContentFields: FieldsData = {
          dataType: "msg",
          attachments: [],
          recipients: [],
        }
        this.fieldsDataDir(parserConfig, dirProperty, rootFolder, innerMsgContentFields, "sub");
        fields.innerMsgContentFields = innerMsgContentFields;
        fields.innerMsgContent = true;
        fields.dataId = dirProperty.dataId;

        this.innerMsgBurners[dirProperty.dataId] = () => this.burnMsg(dirProperty, rootFolder);
      }
    }
  }

  private burnMsg(folder: CFolder, rootFolder: CFolder): Uint8Array {
    const entries: Entry[] = [
      {
        name: "Root Entry",
        type: TypeEnum.ROOT,
        children: [],
        length: 0,
      }
    ];
    this.registerFolder(entries, 0, folder, rootFolder, 0);
    return burn(entries);
  }

  private registerFolder(entries: Entry[], index: number, folder: CFolder, rootFolder: CFolder, depth: number): void {
    for (let set of folder.fileNameSets()) {
      let { provider } = set;
      if (depth === 0 && set.name === "__properties_version1.0") {
        const src = provider();
        const dst = new Uint8Array(src.length + 8);
        dst.set(src.subarray(0, 24), 0);
        dst.set(src.subarray(24), 32);
        provider = () => dst;
      }
      const subIndex = entries.length;
      entries[index].children.push(subIndex);
      entries.push(
        {
          name: set.name,
          type: TypeEnum.DOCUMENT,
          binaryProvider: provider,
          length: set.length,
        }
      );
    }
    if (depth === 0) {
      // include root `__nameid_version1.0` folder.
      const sources = rootFolder.subFolders()
        .filter(it => it.name === "__nameid_version1.0");
      for (let source of sources) {
        const subIndex = entries.length;
        entries[index].children.push(subIndex);
        entries.push(
          {
            name: source.name,
            type: TypeEnum.DIRECTORY,
            children: [],
            length: 0,
          }
        );
        this.registerFolder(entries, subIndex, source, rootFolder, depth + 1);
      }
    }
    for (let subFolder of folder.subFolders()) {
      const subIndex = entries.length;
      entries[index].children.push(subIndex);
      entries.push(
        {
          name: subFolder.name,
          type: TypeEnum.DIRECTORY,
          children: [],
          length: 0,
        }
      );
      this.registerFolder(entries, subIndex, subFolder, rootFolder, depth + 1);
    }
  }

  private fieldsRecipProperties(parserConfig: ParserConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const propertiesBinary: Uint8Array = documentProperty.provider();
    const propertiesDs = new DataStream(propertiesBinary, 8, DataStream.LITTLE_ENDIAN);

    // See: [MS-OXMSG]: Outlook Item (.msg) File Format, 2.4 Property Stream
    // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/20c1125f-043d-42d9-b1dc-cb9b7e5198ef

    const PtypInteger32 = 0x0003;
    const PidTagRecipientType = 0x0C150003;

    while (!propertiesDs.isEof()) {
      const propertyTag = propertiesDs.readUint32();
      const flags = propertiesDs.readUint32();

      const ptyp = propertyTag & 0xFFFF;
      let value = undefined;
      if (ptyp === PtypInteger32) {
        value = propertiesDs.readUint32();
        propertiesDs.readUint32();
      } else {
        propertiesDs.readUint32();
        propertiesDs.readUint32();
      }

      parserConfig.propertyObserver(fields, propertyTag, new Uint8Array(8));

      if (propertyTag === PidTagRecipientType) {
        const MAPI_TO = 1;
        const MAPI_CC = 2;
        const MAPI_BCC = 3;
        if (value === MAPI_TO) {
          fields["recipType"] = "to";
        }
        else if (value === MAPI_CC) {
          fields["recipType"] = "cc";
        }
        else if (value === MAPI_BCC) {
          fields["recipType"] = "bcc";
        }
      }
    }
  }

  private fieldsRootProperties(parserConfig: ParserConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const propertiesBinary: Uint8Array = documentProperty.provider();
    const propertiesDs = new DataStream(propertiesBinary, 32, DataStream.LITTLE_ENDIAN);

    // See: [MS-OXMSG]: Outlook Item (.msg) File Format, 2.4 Property Stream
    // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/20c1125f-043d-42d9-b1dc-cb9b7e5198ef

    const typeConverters = {
      0x0040: (dataView: DataView) => {
        const fileTime = dataView.getUint32(0, true) + (4294967296.0 * dataView.getUint32(4, true));
        return new Date(fileTimeToUnixEpoch(fileTime)).toUTCString();
      },
    };
    const names = {
      0x0039: 'clientSubmitTime',
      0x0E06: 'messageDeliveryTime',
      0x3007: 'creationTime',
      0x3008: 'lastModificationTime',
    };

    while (!propertiesDs.isEof()) {
      const propertyTag = propertiesDs.readUint32();
      const flags = propertiesDs.readUint32();

      const arr = propertiesDs.readUint8Array(8);
      const dataView = new DataView(arr.buffer);

      parserConfig.propertyObserver(fields, propertyTag, arr);

      const typeConverter = typeConverters[propertyTag & 0xFFFF];
      if (typeConverter) {
        const name = names[(propertyTag / 65536) & 0xFFFF];
        if (name) {
          fields[name] = typeConverter(dataView);
        }
      }
    }
  }

  private fieldsDataDir(parserConfig: ParserConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData, subClass?: string) {
    if (subClass === "nameid") {
      // skip normal processing
      return;
    }

    for (let subFolder of dirProperty.subFolders()) {
      this.fieldsDataDirInner(parserConfig, subFolder, rootFolder, fields);
    }

    for (let fileSet of dirProperty.fileNameSets()) {
      if (0) { }
      else if (fileSet.name.indexOf(CONST.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
        this.fieldsDataDocument(parserConfig, fileSet, fields);
      }
      else if (fileSet.name === "__properties_version1.0") {
        if (subClass === "recip") {
          this.fieldsRecipProperties(parserConfig, fileSet, fields);
        }
        else if (subClass === "root") {
          this.fieldsRootProperties(parserConfig, fileSet, fields);
        }
      }
    }
  }

  /**
   * extract real fields
   */
  private fieldsDataReader(parserConfig: ParserConfig): FieldsData {
    const fields: FieldsData = {
      dataType: "msg",
      attachments: [],
      recipients: []
    };
    this.fieldsDataDir(parserConfig, this.reader.rootFolder(), this.reader.rootFolder(), fields, "root");
    return fields;
  }

  /**
   * convert binary data to dictionary
   */
  private parseMsgData(parserConfig: ParserConfig): FieldsData {
    this.reader.parse();
    return this.fieldsDataReader(parserConfig);
  }

  getFileData(): FieldsData {
    if (this.fieldsData === undefined) {
      if (!this.reader.isMSGFile()) {
        return {
          dataType: null,
          error: 'Unsupported file type!'
        };
      }
      this.innerMsgBurners = {};
      this.fieldsData = this.parseMsgData(
        {
          propertyObserver: (this.parserConfig?.propertyObserver) || (() => { }),
        }
      );
    }
    return this.fieldsData;
  }

  /**
   Reads an attachment content by key/ID
  
    @return {Object} The attachment for specific attachment key
    */
  getAttachment(attach: number | FieldsData): { fileName: string; content: Uint8Array } {
    const attachData = typeof attach === 'number' ? this.fieldsData.attachments[attach] : attach;
    if (attachData.innerMsgContent === true && typeof attachData.dataId === "number") {
      // inner msg
      return { fileName: attachData.fileName, content: this.innerMsgBurners[attachData.dataId]() };
    }
    else {
      // raw attachment file
      const fieldData = this.reader.readFileOf(attachData.dataId);

      return { fileName: attachData.fileName, content: fieldData };
    }
  }
}
