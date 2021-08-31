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
import { msftUuidStringify, toHex2, toHex4 } from './utils';
import { parse as entryStreamParser } from './EntryStreamParser';
import { parse as parseVerbStream } from './VerbStreamParser';

// MSG Reader implementation

export interface ParserConfig {
  /**
   * Observe property writing (this is not complete solution!)
   */
  propertyObserver?: (fields: FieldsData, tag: number, raw: Uint8Array | null) => void;

  /**
   * Include {@link FieldsData.rawProps} while decoding msg.
   */
  includeRawProps?: boolean;
}

/**
 * CONST.MSG.PROP.TYPE_ENUM
 */
enum TypeEnum {
  DIRECTORY = 1,
  DOCUMENT = 2,
  ROOT = 5,
}

/**
 * Some OXPROPS
 * 
 * Note that please sync with: `CONST.MSG.FIELD.NAME_MAPPING`
 * 
 * @see [[MS-OXPROPS]: Exchange Server Protocols Master Property List | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/f6ab1613-aefe-447d-a49c-18217230b148)
 */
export interface SomeOxProps {
  /**
   * Contains the subject of the email message.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0037-PidTagSubject.md
   */
  subject?: string;

  /**
   * Contains the display name of the sending mailbox owner.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1A-PidTagSenderName.md
   */
  senderName?: string;

  /**
   * Contains the email address of the sending mailbox owner.
   * 
   * e.g.
   * 
   * - `xmailuser@xmailserver.test` for {@link senderAddressType} = 'SMTP'
   * - `/O=EXCHANGELABS/OU=EXCHANGE ADMINISTRATIVE GROUP (xxx)/CN=RECIPIENTS/CN=xxx` for {@link senderAddressType} = 'EX'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1F-PidTagSenderEmailAddress.md
   */
  senderEmail?: string;

  /**
   * Contains message body text in plain text format.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1000-PidTagBody.md
   */
  body?: string;

  /**
   * Contains transport-specific message envelope information for email.
   * 
   * e.g.
   * 
   * ```
   * Return-Path: <xmailuser@xmailserver.test>
   * Delivered-To: xmailuser@xmailserver.test
   * X-AuthUser: xmailuser@xmailserver.test
   * Received: from H270 ([127.0.0.1]:56695)
   *     by xmailserver.test with [XMail 1.27 ESMTP Server]
   *     id <S9> for <xmailuser@xmailserver.test> from <xmailuser@xmailserver.test>;
   *     Tue, 12 May 2020 14:45:17 +0900
   * From: Microsoft Outlook <xmailuser@xmailserver.test>
   * To: =?utf-8?B?eG1haWx1c2Vy?= <xmailuser@xmailserver.test>
   * Subject: =?utf-8?B?TWljcm9zb2Z0IE91dGxvb2sg44OG44K544OIIOODoeODg+OCu+ODvOOCuA==?=
   * MIME-Version: 1.0
   * Content-Type: text/html;
   *     charset=\"utf-8\"
   * Content-Transfer-Encoding: 8bit
   * 
   * ```
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/007D-PidTagTransportMessageHeaders.md
   */
  headers?: string;

  /**
   * Contains message body text in compressed RTF format.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1009-PidTagRtfCompressed.md
   */
  compressedRtf?: Uint8Array;

  /**
   * Contains a file name extension that indicates the document type of an attachment.
   * 
   * e.g. `.png`
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3703-PidTagAttachExtension.md
   */
  extension?: string;

  /**
   * Contains an attachment's base file name and extension, excluding path.
   * 
   * e.g. `green.png`
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see https://docs.microsoft.com/en-US/office/client-developer/outlook/mapi/pidtagattachfilename-canonical-property
   */
  fileNameShort?: string;

  /**
   * Contains an attachment's long filename and extension, excluding path.
   * 
   * e.g. `green.png`
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see https://docs.microsoft.com/en-US/office/client-developer/outlook/mapi/pidtagattachlongfilename-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3707-PidTagAttachLongFilename.md
   */
  fileName?: string;

  /**
   * Contains a content identifier unique to the Message object that matches a
   * corresponding "cid" URI schema reference in the HTML body of the Message object.
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3712-PidTagAttachContentId.md
   */
  pidContentId?: string;

  /**
   * Contains the display name of the folder.
   * 
   * e.g.
   * 
   * - `xmailuser` for recipient.
   * - `green.png` for generic attachment.
   * - `I have attachments!` for msg attachment.
   * 
   * Target {@link dataType} = 'recipient' and 'attachment'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3001-PidTagDisplayName.md
   */
  name?: string;

  /**
   * Contains the email address of a Message object.
   * 
   * e.g.
   * 
   * - `xmailuser@xmailserver.test` for {@link addressType} = 'SMTP'
   * - `/o=ExchangeLabs/ou=Exchange Administrative Group (xxx)/cn=Recipients/cn=xxx` for {@link addressType} = 'EX'
   * 
   * Target {@link dataType} = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3003-PidTagEmailAddress.md
   */
  email?: string;

  /**
   * Contains the time, in UTC, that the object was created.
   * 
   * e.g. `Mon, 15 Feb 2021 08:19:21 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3007-PidTagCreationTime.md
   */
  creationTime?: string;

  /**
   * Contains the time, in UTC, of the last modification to the object.
   * 
   * e.g. `Mon, 15 Feb 2021 08:19:21 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3008-PidTagLastModificationTime.md
   */
  lastModificationTime?: string;

  /**
   * Contains the current time, in UTC, when the email message is submitted.
   * 
   * e.g. `Mon, 15 Feb 2021 08:19:04 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0039-PidTagClientSubmitTime.md
   */
  clientSubmitTime?: string;

  /**
   * Specifies the time (in UTC) when the server received the message.
   * 
   * e.g. `Mon, 15 Feb 2021 08:19:00 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0E06-PidTagMessageDeliveryTime.md
   */
  messageDeliveryTime?: string;

  /**
   * This undocumented `creatorSMTPAddress` will be attached
   * when you send a mail via Exchange Online server.
   * 
   * e.g.
   * 
   * - `xxx@xxx.onmicrosoft.com` for {@link senderAddressType} = 'EX'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://social.microsoft.com/Forums/partner/en-US/8e15ac6d-0404-41c0-9af7-26a06ca797bf/meaning-of-mapi-identifiers-0x5d0a-and-0x5d0b?forum=os_exchangeprotocols
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  creatorSMTPAddress?: string;

  /**
   * This undocumented `lastModifierSMTPAddress` will be attached
   * when you send a mail via Exchange Online server.
   * 
   * e.g.
   * 
   * - `xxx@xxx.onmicrosoft.com` for {@link senderAddressType} = 'EX'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://social.microsoft.com/Forums/partner/en-US/8e15ac6d-0404-41c0-9af7-26a06ca797bf/meaning-of-mapi-identifiers-0x5d0a-and-0x5d0b?forum=os_exchangeprotocols
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  lastModifierSMTPAddress?: string;

  /**
   * Contains the SMTP address of the Message object.
   * 
   * e.g.
   * 
   * - `xxx@xxx.onmicrosoft.com` for {@link addressType} = 'EX'
   * 
   * Target {@link dataType} = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/39FE-PidTagSmtpAddress.md
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  smtpAddress?: string;

  /**
   * Contains the name of the last mail user to change the Message object.
   * 
   * A email address may be stored in `lastModifierName`, if it was sent through Exchange Server.
   * 
   * `lastModifierSMTPAddress` or `smtpAddress` may not be stored in some cases.
   * 
   * e.g.
   * 
   * - `UnoKenji` for {@link senderAddressType} = 'EX'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3FFA-PidTagLastModifierName.md
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  lastModifierName?: string;

  /**
   * Contains the email address type of a Message object.
   * 
   * e.g.
   * 
   * - `EX`
   * - `SMTP`
   * 
   * Target {@link dataType} = 'recipient'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3002-PidTagAddressType.md
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  addressType?: string;

  /**
   * Contains the email address type of the sending mailbox owner.
   * 
   * e.g.
   * 
   * - `EX`
   * - `SMTP`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C1E-PidTagSenderAddressType.md
   * @see https://github.com/HiraokaHyperTools/msgreader/issues/10
   */
  senderAddressType?: string;

  /**
   * Indicates whether an attachment is hidden from the end user.
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagattachmenthidden-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/7FFE-PidTagAttachmentHidden.md
   */
  attachmentHidden?: boolean;

  /**
   * VerbResponse (PidLidVerbResponse)
   * 
   * e.g.
   * 
   * - `Yes`
   * - `はい`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/88f982ff-0146-422b-8545-0701b5e7916e
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxomsg/eb67f145-2ceb-4427-bbc1-f67a6dcbd24b
   */
  votingResponse?: string;

  /**
   * Contains message body text in HTML format.
   * 
   * @see https://docs.microsoft.com/ja-jp/office/client-developer/outlook/mapi/pidtagbodyhtml-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1013-PidTagBodyHtml.md
   */
  bodyHtml?: string;

  /**
   * Contains message body text in HTML format.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtaghtml-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/1013-PidTagHtml.md
   */
  html?: Uint8Array;

  /**
   * PidLidInternetAccountName
   * 
   * Specifies the user-visible email account name through which the email message is sent.
   * 
   * The format of this string is implementation dependent. 
   * This property can be used by the client to determine which server to direct the mail to, 
   * but is optional and the value has no meaning to the server.
   * 
   * e.g. `xmailuser@xmailserver.test`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidinternetaccountname-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/00008580-PidLidInternetAccountName.md
   */
  inetAcctName?: string;
}

export interface SomeParsedOxProps {
  /**
   * Contains the recipient type for a message recipient.
   * 
   * Target {@link dataType} = 'recipient'.
   * 
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxomsg/144ae256-8cf2-45a1-a297-221b44f68cfe
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagrecipienttype-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0C15-PidTagRecipientType.md
   */
  recipType?: "to" | "cc" | "bcc";

  /**
   * VerbStream (PidLidVerbStream)
   * 
   * e.g.
   * 
   * - `Yes;No;Maybe`
   * - `はい;いいえ;たぶん`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/e11cc753-cecf-4fdc-bec7-23304d12388a
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxomsg/89a70cdb-28ca-4d63-9deb-6d8c15c2cb47
   */
  votingOptions?: string;
}

export interface FieldsData extends SomeOxProps, SomeParsedOxProps {
  dataType: null | "msg" | "attachment" | "recipient";

  /**
   * The attachment file's contentLength.
   * 
   * Target {@link dataType} = 'attachment'.
   */
  contentLength?: number;

  /**
   * The attachment file's dataId (for internal use).
   * 
   * This is entry index to CFBF stream.
   * 
   * Target {@link dataType} = 'attachment'.
   */
  dataId?: number;

  /**
   * folderId is internal and valid for embedded msg file.
   * 
   * This is entry index to CFBF storage.
   * 
   * Target {@link dataType} = 'attachment'.
   */
  folderId?: number;

  /**
   * innerMsgContent is set to true, if this attachment is embedded msg.
   * 
   * The embedded msg is represented as a CFBF storage (not single CFBF stream).
   * 
   * Target {@link dataType} = 'attachment'.
   */
  innerMsgContent?: true;

  /**
   * The properties defined in embedded msg.
   * 
   * Target {@link dataType} = 'attachment'.
   */
  innerMsgContentFields?: FieldsData;

  /**
   * The collection of attachment files:
   * 
   * ```json
   * {
   *   "dataType": "attachment",
   *   "name": "A.txt",
   *   "fileNameShort": "A.txt",
   *   "dataId": 40,
   *   "contentLength": 11,
   *   "extension": ".txt",
   *   "fileName": "A.txt"
   * }
   * ```
   * 
   * Use with {@link MsgReader.getAttachment}.
   * 
   * Target {@link dataType} = 'msg'.
   */
  attachments?: FieldsData[];

  /**
   * The collection of recipients:
   * 
   * ```json
   * {
   *   "dataType": "recipient",
   *   "name": "to@example.com",
   *   "email": "to@example.com",
   *   "recipType": "to"
   * },
   * ```
   * 
   * Target {@link dataType} = 'msg'.
   */
  recipients?: FieldsData[];

  /**
   * error is set on parse error.
   * 
   * Target {@link dataType} = 'msg'.
   */
  error?: string;

  /**
   * All properties obtained while decoding msg.
   * 
   * To activate this:
   * 
   * - Prepare new {@link MsgReader.parserConfig}.
   * - Set {@link ParserConfig.includeRawProps} to `true`.
   * - And then invoke {@link MsgReader.getFileData}.
   */
  rawProps?: RawProp[];
}

/**
 * RawProp includes value for every property.
 */
export interface RawProp {
  /**
   * PidTag, as lower case hex str (8 chars).
   * 
   * Every proerty should have single PidTag.
   * 
   * DWORD (8 hex chars) format is:
   * 
   * - HIWORD (first 4 chars) is identifier. e.g. `3001` is PidTagDisplayName.
   * - LOWORD (last 4 chars) is data type. e.g. `001f` is PT_UNICODE.
   * 
   * e.g.
   * 
   * - `3001001f` is set for PidTagDisplayName.
   * - `80000000` ~ `ffffffff` are private tags. Need to inspect: {@link propertySet} and {@link propertyLid}
   * 
   * @see [[MS-OXPROPS]: Property ID Ranges | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/ed38d6e3-2871-4cb5-ab3e-0aebe9d02c21)
   * @see [[MS-OXCDATA]: Property Data Types | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/MS-OXCDATA/0c77892e-288e-435a-9c49-be1c20c7afdb)
   */
  propertyTag: string | undefined;

  /**
   * Property set, as lower case GUID str (36 chars)
   * 
   * The private {@link propertyTag} (`80000000` ~ `ffffffff`) should have both this and {@link propertyLid}
   * 
   * e.g. `00062008-0000-0000-c000-000000000046` is set for PSETID_Common.
   * 
   * @see [[MS-OXPROPS]: Commonly Used Property Sets | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/cc9d955b-1492-47de-9dce-5bdea80a3323)
   */
  propertySet: string | undefined;

  /**
   * Long ID (LID), as lower case hex str (8 chars)
   * 
   * The private {@link propertyTag} (`80000000` ~ `ffffffff`) should have both this and {@link propertySet}
   * 
   * e.g. `00008580` is set for PidLidInternetAccountName.
   * 
   * @see [[MS-OXPROPS]: Structures | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxprops/37dd7329-97a4-42ff-974d-d805ac4d7211)
   */
  propertyLid: string | undefined;

  /**
   * The value depends on property.
   */
  value?: string | Uint8Array;
}

interface KeyedEntry {
  useName: boolean;

  name?: string;

  propertySet?: string;
  propertyLid?: number;
}

enum KeyType {
  root,
  toSub,
}

interface FieldValuePair {
  key: string;
  keyType: KeyType;
  value: string | Uint8Array;

  propertyTag?: string;
  propertySet?: string;
  propertyLid?: string
}

function fileTimeToUnixEpoch(time: number) {
  return (time - 116444736000000000) / 10000;
}

/**
 * The core implementation of MsgReader
 */
export default class MsgReader {
  private reader: Reader;
  private fieldsData: FieldsData;
  parserConfig?: ParserConfig;
  private innerMsgBurners: { [key: number]: () => Uint8Array };

  /**
   * pidTag: 0x8000 ~ 0xFFFF
   */
  private privatePidToKeyed: { [key: number]: KeyedEntry };

  constructor(arrayBuffer: ArrayBuffer | DataView) {
    this.reader = new Reader(arrayBuffer);
  }

  private decodeField(fieldClass: string, fieldType: string, provider: () => Uint8Array, insideProps: boolean): FieldValuePair {
    const array = provider();
    const ds = new DataStream(array, 0, DataStream.LITTLE_ENDIAN);

    let key = CONST.MSG.FIELD.FULL_NAME_MAPPING[`${fieldClass}${fieldType}`]
      || CONST.MSG.FIELD.NAME_MAPPING[fieldClass];
    let keyType = KeyType.root;

    let propertySet: string = undefined;
    let propertyLid: string = undefined;

    const classValue = parseInt(`0x${fieldClass}`);
    if (classValue >= 0x8000) {
      const keyed = this.privatePidToKeyed[classValue];
      if (keyed) {
        if (keyed.useName) {
          key = keyed.name;
          keyType = KeyType.toSub;
        }
        else {
          propertySet = keyed.propertySet;
          propertyLid = toHex4(keyed.propertyLid);
          const lidDict = CONST.MSG.FIELD.PIDLID_MAPPING[keyed.propertySet];
          if (lidDict !== undefined) {
            const prop = lidDict[keyed.propertyLid];
            if (prop !== undefined) {
              key = prop.id;
              keyType = KeyType.toSub;
            }
          }
        }
      }
    }

    let value: any = array;

    let skip = false;

    const decodeAs = CONST.MSG.FIELD.TYPE_MAPPING[fieldType];
    if (0) { }
    else if (decodeAs === "string") {
      value = ds.readString(array.length);
      skip = insideProps;
    }
    else if (decodeAs === "unicode") {
      value = ds.readUCS2String(array.length / 2);
      skip = insideProps;
    }
    else if (decodeAs === "integer") {
      value = ds.readUint32();
    }
    else if (decodeAs === "boolean") {
      value = ds.readUint16() ? true : false;
    }

    if (skip) {
      key = undefined;
    }

    if (0) { }
    else if (key === "PidLidVerbStream") {
      value = parseVerbStream(ds);
    }
    else if (key === "PidLidVerbResponse") {
      key = "votingResponse";
      keyType = KeyType.root;
    }
    else if (key === "PidLidVerbStream") {
      key = "votingOptions";
      keyType = KeyType.root;
    }
    else if (key === "PidLidInternetAccountName") {
      key = "inetAcctName";
      keyType = KeyType.root;
    }
    else if (key === "recipType") {
      const MAPI_TO = 1;
      const MAPI_CC = 2;
      const MAPI_BCC = 3;
      if (0) { }
      else if (value === MAPI_TO) {
        value = "to";
      }
      else if (value === MAPI_CC) {
        value = "cc";
      }
      else if (value === MAPI_BCC) {
        value = "bcc";
      }
    }

    const propertyTag = `${fieldClass}${fieldType}`;

    return { key, keyType, value, propertyTag, propertySet, propertyLid, };
  }

  private fieldsDataDocument(parserConfig: ParserConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const value = documentProperty.name.substring(12).toLowerCase();
    const fieldClass = value.substring(0, 4);
    const fieldType = value.substring(4, 8);

    parserConfig.propertyObserver && parserConfig.propertyObserver(
      fields,
      parseInt(value.substring(0, 8), 16),
      documentProperty.provider()
    )

    if (fieldClass == CONST.MSG.FIELD.CLASS_MAPPING.ATTACHMENT_DATA) {

      // attachment specific info
      fields.dataId = documentProperty.dataId;
      fields.contentLength = documentProperty.length;
    }
    else {
      this.setDecodedFieldTo(
        parserConfig,
        fields,
        this.decodeField(fieldClass, fieldType, documentProperty.provider, false)
      );
    }
  }

  private setDecodedFieldTo(parserConfig: ParserConfig, fields: FieldsData, pair: FieldValuePair): void {
    const { key, keyType, value } = pair;
    if (key !== undefined) {
      if (keyType === KeyType.root) {
        fields[key] = value;
      }
    }
    if (parserConfig.includeRawProps === true) {
      fields.rawProps = fields.rawProps || [];
      fields.rawProps.push(
        {
          propertyTag: pair.propertyTag,
          propertySet: pair.propertySet,
          propertyLid: pair.propertyLid,

          value: value,
        }
      );
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
      this.fieldsNameIdDir(parserConfig, dirProperty, rootFolder, fields);
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
        fields.folderId = dirProperty.dataId;

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
      let { provider, length } = set;
      if (depth === 0 && set.name === "__properties_version1.0") {
        const src = provider();
        const dst = new Uint8Array(src.length + 8);
        dst.set(src.subarray(0, 24), 0);
        dst.set(src.subarray(24), 32);
        provider = () => dst;
        length = dst.length;
      }
      const subIndex = entries.length;
      entries[index].children.push(subIndex);
      entries.push(
        {
          name: set.name,
          type: TypeEnum.DOCUMENT,
          binaryProvider: provider,
          length: length,
        }
      );
    }
    if (depth === 0) {
      // include root `__nameid_version1.0` folder.
      const sources = rootFolder.subFolders()
        .filter(it => it.name === CONST.MSG.FIELD.PREFIX.NAMEID);
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

  private fieldsRecipAndAttachmentProperties(parserConfig: ParserConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const propertiesBinary: Uint8Array = documentProperty.provider();
    const propertiesDs = new DataStream(propertiesBinary, 8, DataStream.LITTLE_ENDIAN);

    // See: [MS-OXMSG]: Outlook Item (.msg) File Format, 2.4 Property Stream
    // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/20c1125f-043d-42d9-b1dc-cb9b7e5198ef

    while (!propertiesDs.isEof()) {
      const propertyTag = propertiesDs.readUint32();
      const flags = propertiesDs.readUint32();

      const fieldClass = toHex2((propertyTag >> 16) & 65535);
      const fieldType = toHex2(propertyTag & 65535);

      const raw = propertiesDs.readUint8Array(8);

      parserConfig.propertyObserver(fields, propertyTag, raw);

      this.setDecodedFieldTo(
        parserConfig,
        fields,
        this.decodeField(fieldClass, fieldType, () => raw, true)
      );
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
      if (propertyTag === 0) {
        break;
      }
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
    for (let subFolder of dirProperty.subFolders()) {
      this.fieldsDataDirInner(parserConfig, subFolder, rootFolder, fields);
    }

    for (let fileSet of dirProperty.fileNameSets()) {
      if (0) { }
      else if (fileSet.name.indexOf(CONST.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
        this.fieldsDataDocument(parserConfig, fileSet, fields);
      }
      else if (fileSet.name === "__properties_version1.0") {
        if (subClass === "recip" || subClass === "attachment") {
          this.fieldsRecipAndAttachmentProperties(parserConfig, fileSet, fields);
        }
        else if (subClass === "root") {
          this.fieldsRootProperties(parserConfig, fileSet, fields);
        }
      }
    }
  }

  private fieldsNameIdDir(parserConfig: ParserConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData) {
    let guidTable: Uint8Array = undefined;
    let stringTable: Uint8Array = undefined;
    let entryTable: Uint8Array = undefined;
    for (let fileSet of dirProperty.fileNameSets()) {
      if (0) { }
      else if (fileSet.name.indexOf(CONST.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
        const value = fileSet.name.substring(12).toLowerCase();
        const fieldClass = value.substring(0, 4);
        const fieldType = value.substring(4, 8);

        if (0) { }
        else if (fieldClass === "0002" && fieldType === "0102") {
          guidTable = fileSet.provider();
        }
        else if (fieldClass === "0003" && fieldType === "0102") {
          entryTable = fileSet.provider();
        }
        else if (fieldClass === "0004" && fieldType === "0102") {
          stringTable = fileSet.provider();
        }
      }
    }
    //console.log("%", guidTable, stringTable, entryTable);
    if (guidTable !== undefined && stringTable !== undefined && entryTable !== undefined) {
      const entries = entryStreamParser(entryTable);
      const stringReader = new DataStream(stringTable, 0, DataStream.LITTLE_ENDIAN);
      for (let entry of entries) {
        if (entry.isStringProperty) {
          stringReader.seek(entry.key);
          const numTextBytes = stringReader.readUint32();

          this.privatePidToKeyed[0x8000 | entry.propertyIndex] = {
            useName: true,
            name: stringReader.readUCS2String(numTextBytes / 2),
          };
        }
        else {
          this.privatePidToKeyed[0x8000 | entry.propertyIndex] = {
            useName: false,
            propertySet:
              (entry.guidIndex === 1) ? "00020328-00000-0000-C000-00000000046"
                : (entry.guidIndex === 2) ? "00020329-00000-0000-C000-00000000046"
                  : msftUuidStringify(guidTable, 16 * (entry.guidIndex - 3)),
            propertyLid: entry.key,
          };
        }
      }
      //console.log("@", this.privatePidToKeyed);
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
      this.privatePidToKeyed = {};
      this.fieldsData = this.parseMsgData(
        {
          propertyObserver: (this.parserConfig?.propertyObserver) || (() => { }),
          includeRawProps: this.parserConfig?.includeRawProps,
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
    if (attachData.innerMsgContent === true && typeof attachData.folderId === "number") {
      // embedded msg
      return { fileName: attachData.name + ".msg", content: this.innerMsgBurners[attachData.folderId]() };
    }
    else {
      // raw attachment file
      const fieldData = this.reader.readFileOf(attachData.dataId);

      return { fileName: attachData.fileName, content: fieldData };
    }
  }
}
