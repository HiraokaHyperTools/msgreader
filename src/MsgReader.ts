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

import { arraysEqual } from './utils'
import CONST from './const'
import DataStream from './DataStream'

// MSG Reader implementation

class ParserConfig {
  propertyObserver?: (fields: FieldsData, tag: number, raw: Uint8Array | null) => void;
}

// check MSG file header
function isMSGFile(ds: DataStream): boolean {
  ds.seek(0);
  return arraysEqual(CONST.FILE_HEADER, ds.readInt8Array(CONST.FILE_HEADER.length));
}

// FAT utils
function getBlockOffsetAt(msgData: MsgData, offset: number): number {
  return (offset + 1) * msgData.bigBlockSize;
}

function getBlockAt(ds: DataStream, msgData: MsgData, offset: number): Int32Array {
  const startOffset = getBlockOffsetAt(msgData, offset);
  ds.seek(startOffset);
  return ds.readInt32Array(msgData.bigBlockLength);
}

function getNextBlockInner(ds: DataStream, msgData: MsgData, offset: number, blockOffsetData: any[]): number {
  const currentBlock = Math.floor(offset / msgData.bigBlockLength);
  const currentBlockIndex = offset % msgData.bigBlockLength;

  const startBlockOffset = blockOffsetData[currentBlock];
  if (typeof startBlockOffset == "undefined")
    return CONST.MSG.END_OF_CHAIN;

  return getBlockAt(ds, msgData, startBlockOffset)[currentBlockIndex];
}

function getNextBlock(ds: DataStream, msgData: MsgData, offset: number): number {
  return getNextBlockInner(ds, msgData, offset, msgData.batData);
}

function getNextBlockSmall(ds: DataStream, msgData: MsgData, offset: number): number {
  return getNextBlockInner(ds, msgData, offset, msgData.sbatData);
}

// convert binary data to dictionary
function parseMsgData(ds: DataStream, parserConfig: ParserConfig): MsgData {
  const msgData: MsgData = headerData(ds);
  msgData.batData = batData(ds, msgData);
  msgData.sbatData = sbatData(ds, msgData);
  if (msgData.xbatCount > 0) {
    xbatData(ds, msgData);
  }
  msgData.propertyData = propertyData(ds, msgData);
  msgData.fieldsData = fieldsData(ds, msgData, parserConfig);

  return msgData;
}

interface MsgData {
  bigBlockSize: number;
  bigBlockLength: number;
  xBlockLength: number;
  batCount: number;
  propertyStart: number;
  sbatStart: number;
  sbatCount: number;
  xbatStart: number;
  xbatCount: number;

  fieldsData?: FieldsData;
  propertyData?: Property[];
  sbatData?: any[];
  batData?: any[];
}

// extract header data
function headerData(ds): MsgData {
  const bigBlockSize =
    ds.readByte(/*const position*/30) == CONST.MSG.L_BIG_BLOCK_MARK ? CONST.MSG.L_BIG_BLOCK_SIZE : CONST.MSG.S_BIG_BLOCK_SIZE;
  const bigBlockLength = bigBlockSize / 4;

  return {
    // system data
    bigBlockSize,
    bigBlockLength,
    xBlockLength: bigBlockLength - 1,

    // header data
    batCount: ds.readInt(CONST.MSG.HEADER.BAT_COUNT_OFFSET),
    propertyStart: ds.readInt(CONST.MSG.HEADER.PROPERTY_START_OFFSET),
    sbatStart: ds.readInt(CONST.MSG.HEADER.SBAT_START_OFFSET),
    sbatCount: ds.readInt(CONST.MSG.HEADER.SBAT_COUNT_OFFSET),
    xbatStart: ds.readInt(CONST.MSG.HEADER.XBAT_START_OFFSET),
    xbatCount: ds.readInt(CONST.MSG.HEADER.XBAT_COUNT_OFFSET),
  };
}

function batCountInHeader(msgData: MsgData): number {
  const maxBatsInHeader = (CONST.MSG.S_BIG_BLOCK_SIZE - CONST.MSG.HEADER.BAT_START_OFFSET) / 4;
  return Math.min(msgData.batCount, maxBatsInHeader);
}

function batData(ds: DataStream, msgData: MsgData): number[] {
  const result = new Array(batCountInHeader(msgData));
  ds.seek(CONST.MSG.HEADER.BAT_START_OFFSET);
  for (let i = 0; i < result.length; i++) {
    result[i] = ds.readInt32()
  }
  return result;
}

function sbatData(ds: DataStream, msgData: MsgData): number[] {
  const result = [];
  let startIndex = msgData.sbatStart;

  for (let i = 0; i < msgData.sbatCount && startIndex && startIndex != CONST.MSG.END_OF_CHAIN; i++) {
    result.push(startIndex);
    startIndex = getNextBlock(ds, msgData, startIndex);
  }
  return result;
}

function xbatData(ds: DataStream, msgData: MsgData): void {
  const batCount = batCountInHeader(msgData);
  const batCountTotal = msgData.batCount;
  let remainingBlocks = batCountTotal - batCount;

  let nextBlockAt = msgData.xbatStart;
  for (let i = 0; i < msgData.xbatCount; i++) {
    let xBatBlock = getBlockAt(ds, msgData, nextBlockAt);

    const blocksToProcess = Math.min(remainingBlocks, msgData.xBlockLength);
    for (let j = 0; j < blocksToProcess; j++) {
      const blockStartAt = xBatBlock[j];
      if (blockStartAt == CONST.MSG.UNUSED_BLOCK || blockStartAt == CONST.MSG.END_OF_CHAIN) {
        break;
      }
      msgData.batData.push(blockStartAt);
    }
    remainingBlocks -= blocksToProcess;

    nextBlockAt = xBatBlock[msgData.xBlockLength];
    if (nextBlockAt == CONST.MSG.UNUSED_BLOCK || nextBlockAt == CONST.MSG.END_OF_CHAIN)
      break;
  }
}

// extract property data and property hierarchy
function propertyData(ds: DataStream, msgData: MsgData): Property[] {
  const props: Property[] = [];

  let currentOffset = msgData.propertyStart;

  while (currentOffset != CONST.MSG.END_OF_CHAIN) {
    convertBlockToProperties(ds, msgData, currentOffset, props);
    currentOffset = getNextBlock(ds, msgData, currentOffset);
  }
  createPropertyHierarchy(props, /*property with index 0 (zero) always as root*/props[0]);
  return props;
}

function convertName(ds: DataStream, offset: number): string {
  const nameLength = ds.readShort(offset + CONST.MSG.PROP.NAME_SIZE_OFFSET);
  if (nameLength < 1) {
    return '';
  } else {
    return ds.readStringAt(offset, nameLength / 2);
  }
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

function convertProperty(ds: DataStream, index: number, offset: number): Property {
  return {
    index: index,
    type: ds.readByte(offset + CONST.MSG.PROP.TYPE_OFFSET),
    name: convertName(ds, offset),
    // hierarchy
    previousProperty: ds.readInt(offset + CONST.MSG.PROP.PREVIOUS_PROPERTY_OFFSET),
    nextProperty: ds.readInt(offset + CONST.MSG.PROP.NEXT_PROPERTY_OFFSET),
    childProperty: ds.readInt(offset + CONST.MSG.PROP.CHILD_PROPERTY_OFFSET),
    // data offset
    startBlock: ds.readInt(offset + CONST.MSG.PROP.START_BLOCK_OFFSET),
    sizeBlock: ds.readInt(offset + CONST.MSG.PROP.SIZE_OFFSET)
  };
}

function convertBlockToProperties(ds: DataStream, msgData: MsgData, propertyBlockOffset: number, props: Property[]): void {

  const propertyCount = msgData.bigBlockSize / CONST.MSG.PROP.PROPERTY_SIZE;
  let propertyOffset = getBlockOffsetAt(msgData, propertyBlockOffset);

  for (let i = 0; i < propertyCount; i++) {
    if (ds.byteLength < propertyOffset + CONST.MSG.PROP.TYPE_OFFSET)
      break;

    const propertyType = ds.readByte(propertyOffset + CONST.MSG.PROP.TYPE_OFFSET);
    switch (propertyType) {
      case CONST.MSG.PROP.TYPE_ENUM.ROOT:
      case CONST.MSG.PROP.TYPE_ENUM.DIRECTORY:
      case CONST.MSG.PROP.TYPE_ENUM.DOCUMENT:
        props.push(convertProperty(ds, props.length, propertyOffset));
        break;
      default:
        /* unknown property types */
        props.push(null);
    }

    propertyOffset += CONST.MSG.PROP.PROPERTY_SIZE;
  }
}

function createPropertyHierarchy(props: Property[], nodeProperty: Property): void {

  if (!nodeProperty || nodeProperty.childProperty == CONST.MSG.PROP.NO_INDEX) {
    return;
  }
  nodeProperty.children = [];

  const children = [nodeProperty.childProperty];
  while (children.length != 0) {
    const currentIndex = children.shift();
    const current = props[currentIndex];
    if (current == null) {
      continue;
    }
    nodeProperty.children.push(currentIndex);

    if (current.type == CONST.MSG.PROP.TYPE_ENUM.DIRECTORY) {
      createPropertyHierarchy(props, current);
    }
    if (current.previousProperty != CONST.MSG.PROP.NO_INDEX) {
      children.push(current.previousProperty);
    }
    if (current.nextProperty != CONST.MSG.PROP.NO_INDEX) {
      children.push(current.nextProperty);
    }
  }
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
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0037-PidTagSubject.md
   */
  subject?: string;

  /**
   * Contains the display name of the sending mailbox owner.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1A-PidTagSenderName.md
   */
  senderName?: string;

  /**
   * Contains the email address of the sending mailbox owner.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1F-PidTagSenderEmailAddress.md
   */
  senderEmail?: string;

  /**
   * Contains message body text in plain text format.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1000-PidTagBody.md
   */
  body?: string;

  /**
   * Contains transport-specific message envelope information for email.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/007D-PidTagTransportMessageHeaders.md
   */
  headers?: string;

  /**
   * Contains message body text in compressed RTF format.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1009-PidTagRtfCompressed.md
   */
  compressedRtf?: Uint8Array;

  /**
   * Contains a file name extension that indicates the document type of an attachment.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3703-PidTagAttachExtension.md
   */
  extension?: string;

  fileNameShort?: string;

  /**
   * Contains the full filename and extension of the Attachment object.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3707-PidTagAttachLongFilename.md
   */
  fileName?: string;

  /**
   * Contains a content identifier unique to the Message object that matches a
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3712-PidTagAttachContentId.md
   */
  pidContentId?: string;

  /**
   * Contains the display name of the folder.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3001-PidTagDisplayName.md
   */
  name?: string;

  /**
   * Contains the email address of a Message object.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3003-PidTagEmailAddress.md
   */
  email?: string;

  /**
   * Contains the time, in UTC, that the object was created.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3007-PidTagCreationTime.md
   */
  creationTime?: string;

  /**
   * Contains the time, in UTC, of the last modification to the object.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3008-PidTagLastModificationTime.md
   */
  lastModificationTime?: string;

  /**
   * Contains the current time, in UTC, when the email message is submitted.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0039-PidTagClientSubmitTime.md
   */
  clientSubmitTime?: string;

  /**
   * Specifies the time (in UTC) when the server received the message.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0E06-PidTagMessageDeliveryTime.md
   */
  messageDeliveryTime?: string;
}

interface SomeParsedOxProps {
  recipType?: "to" | "cc" | "bcc";
}

interface FieldsData extends SomeOxProps, SomeParsedOxProps {
  dataType: null | "msg" | "attachment" | "recipient";
  contentLength?: number;
  dataId?: any;
  innerMsgContent?: true;
  innerMsgContentFields?: FieldsData;
  attachments?: FieldsData[];
  recipients?: FieldsData[];
  error?: string;
}

// extract real fields
function fieldsData(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig): FieldsData {
  const fields: FieldsData = {
    dataType: "msg",
    attachments: [],
    recipients: []
  };
  fieldsDataDir(ds, msgData, parserConfig, msgData.propertyData[0], fields, "root");
  return fields;
}

function fieldsDataDir(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig, dirProperty: Property, fields: FieldsData, subClass?: string) {
  if (dirProperty && dirProperty.children && dirProperty.children.length > 0) {
    for (let i = 0; i < dirProperty.children.length; i++) {
      const childProperty = msgData.propertyData[dirProperty.children[i]];

      if (subClass === "nameid") {
        // skip normal processing
      } else if (childProperty.type == CONST.MSG.PROP.TYPE_ENUM.DIRECTORY) {
        fieldsDataDirInner(ds, msgData, parserConfig, childProperty, fields)
      } else if (childProperty.type == CONST.MSG.PROP.TYPE_ENUM.DOCUMENT
        && childProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.DOCUMENT) == 0) {

        fieldsDataDocument(ds, msgData, parserConfig, childProperty, fields);
      } else if (childProperty.type == CONST.MSG.PROP.TYPE_ENUM.DOCUMENT
        && childProperty.name.split("\0")[0] === "__properties_version1.0") {
        if (subClass === "recip") {
          fieldsRecipProperties(ds, msgData, parserConfig, childProperty, fields);
        }
        else if (subClass === "root") {
          fieldsRootProperties(ds, msgData, parserConfig, childProperty, fields);
        }
      }
    }
  }
}

function fieldsDataDirInner(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig, dirProperty: Property, fields: FieldsData): void {
  if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.ATTACHMENT) == 0) {

    // attachment
    const attachmentField: FieldsData = {
      dataType: "attachment",
    };
    fields.attachments.push(attachmentField);
    fieldsDataDir(ds, msgData, parserConfig, dirProperty, attachmentField, "attachment");
  } else if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.RECIPIENT) == 0) {

    // recipient
    const recipientField: FieldsData = {
      dataType: "recipient",
    };
    fields.recipients.push(recipientField);
    fieldsDataDir(ds, msgData, parserConfig, dirProperty, recipientField, "recip");
  } else if (dirProperty.name.indexOf(CONST.MSG.FIELD.PREFIX.NAMEID) == 0) {
    // unknown, read
    fieldsDataDir(ds, msgData, parserConfig, dirProperty, fields, "nameid");
  } else {

    // other dir
    const childFieldType = getFieldType(dirProperty);
    if (childFieldType != CONST.MSG.FIELD.DIR_TYPE.INNER_MSG) {
      // ignore
    } else {
      const innerMsgContentFields: FieldsData = {
        dataType: "msg",
        attachments: [],
        recipients: [],
      }
      fieldsDataDir(ds, msgData, parserConfig, dirProperty, innerMsgContentFields, "sub");
      fields.innerMsgContentFields = innerMsgContentFields;
      fields.innerMsgContent = true;
    }
  }
}

function fieldsDataDocument(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig, documentProperty: Property, fields: FieldsData): void {
  const value = documentProperty.name.substring(12).toLowerCase();
  const fieldClass = value.substring(0, 4);
  const fieldType = value.substring(4, 8);

  parserConfig.propertyObserver(
    fields,
    parseInt(value.substring(0, 8), 16),
    getFieldRawData(ds, msgData, documentProperty)
  )

  const fieldName = CONST.MSG.FIELD.NAME_MAPPING[fieldClass];

  if (fieldName) {
    fields[fieldName] = getFieldValue(ds, msgData, documentProperty, fieldType);
  }
  if (fieldClass == CONST.MSG.FIELD.CLASS_MAPPING.ATTACHMENT_DATA) {

    // attachment specific info
    fields.dataId = documentProperty.index;
    fields.contentLength = documentProperty.sizeBlock;
  }
}

function fileTimeToUnixEpoch(time: number) {
  return (time - 116444736000000000) / 10000;
}

function fieldsRootProperties(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig, documentProperty: Property, fields: FieldsData): void {
  const propertiesBinary: Uint8Array = getFieldRawData(ds, msgData, documentProperty);
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

function fieldsRecipProperties(ds: DataStream, msgData: MsgData, parserConfig: ParserConfig, documentProperty: Property, fields: FieldsData): void {
  const propertiesBinary: Uint8Array = getFieldRawData(ds, msgData, documentProperty);
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

function getFieldType(fieldProperty: Property): string {
  const value = fieldProperty.name.substring(12).toLowerCase();
  return value.substring(4, 8);
}

// extractor structure to manage bat/sbat block types and different data types
const extractorFieldValue = {
  sbat: {
    'extractor': function extractDataViaSbat(ds: DataStream, msgData: MsgData, fieldProperty: Property, dataTypeExtractor: (ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) => any) {
      const chain = getChainByBlockSmall(ds, msgData, fieldProperty);
      if (chain.length == 1) {
        return readDataByBlockSmall(ds, msgData, fieldProperty.startBlock, fieldProperty.sizeBlock, dataTypeExtractor);
      } else if (chain.length > 1) {
        return readChainDataByBlockSmall(ds, msgData, fieldProperty, chain, dataTypeExtractor);
      }
      return null;
    },
    dataType: {
      'string': function extractBatString(ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) {
        ds.seek(blockStartOffset + bigBlockOffset);
        return ds.readString(blockSize);
      },
      'unicode': function extractBatUnicode(ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) {
        ds.seek(blockStartOffset + bigBlockOffset);
        return ds.readUCS2String(blockSize / 2);
      },
      'binary': function extractBatBinary(ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) {
        ds.seek(blockStartOffset + bigBlockOffset);
        return ds.readUint8Array(blockSize);
      }
    }
  },
  bat: {
    'extractor': function extractDataViaBat(ds: DataStream, msgData: MsgData, fieldProperty: Property, dataTypeExtractor: (ds: DataStream, fieldProperty: Property) => any) {
      const offset = getBlockOffsetAt(msgData, fieldProperty.startBlock);
      ds.seek(offset);
      return dataTypeExtractor(ds, fieldProperty);
    },
    dataType: {
      'string': function extractSbatString(ds: DataStream, fieldProperty: Property) {
        return ds.readString(fieldProperty.sizeBlock);
      },
      'unicode': function extractSbatUnicode(ds: DataStream, fieldProperty: Property) {
        return ds.readUCS2String(fieldProperty.sizeBlock / 2);
      },
      'binary': function extractSbatBinary(ds: DataStream, fieldProperty: Property) {
        return ds.readUint8Array(fieldProperty.sizeBlock);
      }
    }
  }
};

function readDataByBlockSmall(ds: DataStream, msgData: MsgData, startBlock: number, blockSize: number, dataTypeExtractor: (ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) => any) {
  const byteOffset = startBlock * CONST.MSG.SMALL_BLOCK_SIZE;
  const bigBlockNumber = Math.floor(byteOffset / msgData.bigBlockSize);
  const bigBlockOffset = byteOffset % msgData.bigBlockSize;

  const rootProp = msgData.propertyData[0];

  let nextBlock = rootProp.startBlock;
  for (let i = 0; i < bigBlockNumber; i++) {
    nextBlock = getNextBlock(ds, msgData, nextBlock);
  }
  const blockStartOffset = getBlockOffsetAt(msgData, nextBlock);

  return dataTypeExtractor(ds, msgData, blockStartOffset, bigBlockOffset, blockSize);
}

function readChainDataByBlockSmall(ds: DataStream, msgData: MsgData, fieldProperty: Property, chain: number[], dataTypeExtractor: (ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) => any) {
  const resultData = new Int8Array(fieldProperty.sizeBlock);

  for (let i = 0, idx = 0; i < chain.length; i++) {
    const data = readDataByBlockSmall(ds, msgData, chain[i], CONST.MSG.SMALL_BLOCK_SIZE, extractorFieldValue.sbat.dataType.binary);
    for (let j = 0; j < data.length; j++) {
      resultData[idx++] = data[j];
    }
  }
  const localDs = new DataStream(resultData, 0, DataStream.LITTLE_ENDIAN);
  return dataTypeExtractor(localDs, msgData, 0, 0, fieldProperty.sizeBlock);
}

function getChainByBlockSmall(ds: DataStream, msgData: MsgData, fieldProperty: Property): number[] {
  const blockChain = [];
  let nextBlockSmall = fieldProperty.startBlock;
  while (nextBlockSmall != CONST.MSG.END_OF_CHAIN) {
    blockChain.push(nextBlockSmall);
    nextBlockSmall = getNextBlockSmall(ds, msgData, nextBlockSmall);
  }
  return blockChain;
}

function getFieldValue(ds: DataStream, msgData: MsgData, fieldProperty: Property, type: string): any {
  let value = null;

  if (fieldProperty.sizeBlock < CONST.MSG.BIG_BLOCK_MIN_DOC_SIZE) {
    const valueExtractor
      = extractorFieldValue.sbat;
    const dataTypeExtractor: (ds: DataStream, msgData: MsgData, blockStartOffset: number, bigBlockOffset: number, blockSize: number) => any
      = valueExtractor.dataType[CONST.MSG.FIELD.TYPE_MAPPING[type]];

    if (dataTypeExtractor) {
      value = valueExtractor.extractor(ds, msgData, fieldProperty, dataTypeExtractor);
    }
    return value;
  }
  else {
    const valueExtractor
      = extractorFieldValue.bat;
    const dataTypeExtractor: (ds: DataStream, fieldProperty: Property) => any
      = valueExtractor.dataType[CONST.MSG.FIELD.TYPE_MAPPING[type]];

    if (dataTypeExtractor) {
      value = valueExtractor.extractor(ds, msgData, fieldProperty, dataTypeExtractor);
    }
  }
  return value;
}

function getFieldRawData(ds: DataStream, msgData: MsgData, fieldProperty: Property): Uint8Array {
  return getFieldValue(ds, msgData, fieldProperty, '0102');
}

export default class MsgReader {
  ds: DataStream;
  fileData: MsgData;
  parserConfig: ParserConfig

  constructor(arrayBuffer: ArrayBuffer | DataView) {
    this.ds = new DataStream(arrayBuffer, 0, DataStream.LITTLE_ENDIAN);
  }

  getFileData(): FieldsData {
    if (!isMSGFile(this.ds)) {
      return { dataType: null, error: 'Unsupported file type!' };
    }
    if (this.fileData == null) {
      this.fileData = parseMsgData(
        this.ds,
        {
          propertyObserver: (this.parserConfig?.propertyObserver) || (() => { }),
        }
      );
    }
    return this.fileData.fieldsData;
  }

  /**
   Reads an attachment content by key/ID

    @return {Object} The attachment for specific attachment key
    */
  getAttachment(attach: number | FieldsData): { fileName: string; content: Uint8Array } {
    const attachData = typeof attach === 'number' ? this.fileData.fieldsData.attachments[attach] : attach;
    const fieldProperty = this.fileData.propertyData[attachData.dataId];
    const fieldData = getFieldValue(this.ds, this.fileData, fieldProperty, getFieldType(fieldProperty));

    return { fileName: attachData.fileName, content: fieldData };
  }
}
