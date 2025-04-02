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

import CONST from './const.js'
import DataStream from './DataStream.js'
import { CFileSet, CFolder, Reader } from './Reader.js';
import { burn, Entry } from './Burner.js';
import { bin2HexUpper, emptyToNull, msftUuidStringify, toHex2, toHex4 } from './utils.js';
import { parse as entryStreamParser } from './EntryStreamParser.js';
import { parse as parseVerbStream } from './VerbStreamParser.js';
import { parse as parseTZDEFINITION, TzDefinition } from './TZDEFINITIONParser.js';
import { parse as parseTZREG, TzReg } from './TZREGParser.js';
import { AppointmentRecur, parse as parseAppointmentRecur } from './AppointmentRecurParser.js';

export { TzDefinitionRule, TzDefinition, TransitionSystemTime } from './TZDEFINITIONParser.js';
export { TzReg } from './TZREGParser.js';
export {
  RecurFrequency, PatternType, CalendarType, EndType, PatternTypeWeek, PatternTypeMonth,
  PatternTypeMonthNth, RecurrencePattern, OverrideFlags, ExceptionInfo, AppointmentRecur,
} from './AppointmentRecurParser.js';

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

  /**
   * Specify iconv-lite's supported character encoding.
   * This is used for PT_STRING8 (PtypString8) non-Unicode string properties.
   * 
   * e.g.
   * 
   * - `null`
   * - windows-1251
   *   - `windows1251`
   *   - `1251`
   *   - `win1251`
   *   - `cp1251`
   * - Windows-31J
   *   - `shiftjis`
   *   - `932`
   *   - `ms932`
   *   - `cp932`
   * 
   */
  ansiEncoding?: string;
}

interface ParsingConfig {
  propertyObserver: (fields: FieldsData, tag: number, raw: Uint8Array | null) => void;
  includeRawProps: boolean;
  ansiEncoding?: string;
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
   * Target {@link dataType} = 'msg' and 'attachment'.
   * 
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3007-PidTagCreationTime.md
   */
  creationTime?: string;

  /**
   * Contains the time, in UTC, of the last modification to the object.
   * 
   * e.g. `Mon, 15 Feb 2021 08:19:21 GMT`
   * 
   * Target {@link dataType} = 'msg' and 'attachment'.
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

  /**
   * Contains the format of the Simple Mail Transport Protocol (SMTP) email address of the sending mailbox owner.
   * 
   * e.g.
   * `no-reply@microsoft.com` for {@link senderAddressType} = 'SMTP'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagsendersmtpaddress-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/5D01-PidTagSenderSmtpAddress.md
   */
  senderSmtpAddress?: string;

  /**
   * Contains the Simple Mail Transport Protocol (SMTP) email address for the messaging user who is represented by the sender.
   * 
   * e.g.
   * `no-reply@microsoft.com` for {@link senderAddressType} = 'SMTP'
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagsentrepresentingsmtpaddress-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/5D02-PidTagSentRepresentingSmtpAddress.md
   */
  sentRepresentingSmtpAddress?: string;

  /**
   * Contains a text string that identifies the sender-defined message class, such as IPM.Note.
   * 
   * e.g.
   * 
   * - `IPM.Note` for mail
   * - `IPM.StickyNote` for sticky note
   * - `IPM.Appointment` for schedule
   * 
   * See more at: [Item Types and Message Classes | Microsoft Docs](https://docs.microsoft.com/en-us/office/vba/outlook/concepts/forms/item-types-and-message-classes)
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagmessageclass-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/001A-PidTagMessageClass.md
   */
  messageClass?: string;

  /**
   * Represents the date and time when an appointment begins.
   * 
   * e.g. `Wed, 13 Oct 2021 09:30:00 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmentstartwhole-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0000820D-PidLidAppointmentStartWhole.md
   */
  apptStartWhole?: string;

  /**
   * Represents the date and time that an appointment ends.
   * 
   * e.g. `Wed, 13 Oct 2021 10:00:00 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmentendwhole-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/0000820E-PidLidAppointmentEndWhole.md
   */
  apptEndWhole?: string;

  /**
   * Specifies the start date and time of the event in Coordinated Universal Times (UTC) for single instance calendar objects,
   * and specifies midnight on the date of the first instance in UTC for a recurring series.
   * 
   * e.g. `Wed, 13 Oct 2021 09:30:00 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidclipstart-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/00008235-PidLidClipStart.md
   */
  clipStart?: string;

  /**
   * Specifies the end date and time of the event in Coordinated Universal Time (UTC) for single instance calendar objects.
   * 
   * e.g. `Wed, 13 Oct 2021 09:30:00 GMT`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidclipend-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/00008236-PidLidClipEnd.md
   */
  clipEnd?: string;

  /**
   * Indicates the code page used for PR_BODY (PidTagBody) or PR_BODY_HTML (PidTagBodyHtml) properties.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtaginternetcodepage-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3FDE-PidTagInternetCodepage.md
   */
  internetCodepage?: number;

  /**
   * Contains the code page that is used for the message.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagmessagecodepage-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3FFD-PidTagMessageCodepage.md
   */
  messageCodepage?: number;

  /**
   * Contains the Windows LCID of the end user who created this message.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagmessagelocaleid-canonical-property
   * @see https://github.com/HiraokaHyperTools/OXPROPS/blob/master/JSON/3FF1-PidTagMessageLocaleId.md
   */
  messageLocaleId?: number;

  /**
   * Contains a bitmask of flags that indicate the origin and current state of a message.
   * 
   * e.g.
   * 
   * - `mfRead` = `0x00000001`
   * - `mfUnsent` = `0x00000008`
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagmessageflags-canonical-property
   * @see https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/a0c52fe2-3014-43a7-942d-f43f6f91c366
   */
  messageFlags?: number;

  /**
   * Contains a name for the department in which the recipient works.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagdepartmentname-canonical-property
   */
  departmentName?: string;

  /**
   * Contains the middle name of a contact.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagmiddlename-canonical-property
   */
  middleName?: string;

  /**
   * Contains a generational abbreviation that follows the full name of the recipient.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtaggeneration-canonical-property
   */
  generation?: string;

  /**
   * Contains the last or surname of the recipient.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagsurname-canonical-property
   */
  surname?: string;

  /**
   * Contains the city for the recipient's home address.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtaghomeaddresscity-canonical-property
   */
  addressCity?: string;

  /**
   * Specifies the phonetic pronunciation of the contact's given name.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidyomifirstname-canonical-property
   */
  yomiFirstName?: string;

  /**
   * Contains the recipient's company name.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagcompanyname-canonical-property
   */
  companyName?: string;

  /**
   * Contains the telephone number of the recipient's business fax machine.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagbusinessfaxnumber-canonical-property
   */
  businessFaxNumber?: string;

  /**
   * Contains the recipient's street address.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagstreetaddress-canonical-property
   */
  streetAddress?: string;

  /**
   * Contains the URL of the home page for the business.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagbusinesshomepage-canonical-property
   */
  businessHomePage?: string;

  /**
   * Specifies the first email address of the contact.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidemail1emailaddress-canonical-property
   */
  email1EmailAddress?: string;

  /**
   * Specifies the phonetic pronunciation of the contact's company name.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see https://docs.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidyomicompanyname-canonical-property
   */
  yomiCompanyName?: string;

  /**
   * Contains the string value "FAX".
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax3AddressType PSETID_Address:000080d2
   */
  fax3AddrType?: string;

  /**
   * Contains the mail user's given name.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagGivenName propertyTag=3a06001f
   */
  givenName?: string;

  /**
   * Contains the primary telephone number of the mail user's home.
   * 
   * Target { @link dataType } = 'msg'.
   * 
   * Reference: PidTagHomeTelephoneNumber propertyTag = 3a09001f
   */
  homeTelephoneNumber?: string;

  /**
   * Contains the mail user's postal address.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagPostalAddress propertyTag=3a15001f
   */
  postalAddress?: string;

  /**
   * Contains the mail user's job title.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagTitle propertyTag=3a17001f
   */
  title?: string;

  /**
   * Contains the mail user's cellular telephone number.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagMobileTelephoneNumber propertyTag=3a1c001f
   */
  mobileTelephoneNumber?: string;

  /**
   * Contains the name of the mail user's country/region.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagCountry propertyTag=3a26001f
   */
  country?: string;

  /**
   * Contains the name of the mail user's state or province.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagStateOrProvince propertyTag=3a28001f
   */
  stateOrProvince?: string;

  /**
   * Contains the postal code for the mail user's postal address.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagPostalCode propertyTag=3a2a001f
   */
  postalCode?: string;

  /**
   * Contains the mail user's honorific title.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagDisplayNamePrefix propertyTag=3a45001f
   */
  displayNamePrefix?: string;

  /**
   * Specifies the user-readable display name for the email address.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidEmail1DisplayName PSETID_Address:00008080
   */
  email1DisplayName?: string;

  /**
   * Specifies the SMTP email address that corresponds to the email address for the Contact object.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidEmail1OriginalDisplayName PSETID_Address:00008084
   */
  email1OriginalDisplayName?: string;

  /**
   * Specifies the name under which to file a contact when displaying a list of contacts.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFileUnder PSETID_Address:00008005
   */
  fileUnder?: string;

  /**
   * Specifies the phonetic pronunciation of the surname of the contact.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidYomiLastName PSETID_Address:0000802d
   */
  yomiLastName?: string;

  /**
   * Contains the string value "FAX".
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax1AddressType PSETID_Address:000080b2
   */
  fax1AddrType?: string;

  /**
   * Contains a user-readable display name, followed by the "@" character, followed by a fax number.
   * 
   * e.g. `コム ドット イグザンプル 殿@+81 06-0001-0003`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax2EmailAddress PSETID_Address:000080c3
   */
  fax2EmailAddress?: string;

  /**
   * Specifies the city or locality portion of the work address of the contact.
   * 
   * e.g. `Osaka`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressCity PSETID_Address:00008046
   */
  workAddressCity?: string;

  /**
   * Contains an unchanging copy of the original subject.
   * 
   * e.g. `コム ドット イグザンプル 殿`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagConversationTopic propertyTag=0070001f
   */
  conversationTopic?: string;

  /**
   * Contains the normalized subject of the message.
   * 
   * e.g. `コム ドット イグザンプル 殿`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagNormalizedSubject propertyTag=0e1d001f
   */
  normalizedSubject?: string;

  /**
   * Specifies the country code portion of the mailing address of the contact.
   * 
   * e.g. `JP`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidAddressCountryCode PSETID_Address:000080dd
   */
  addressCountryCode?: string;

  /**
   * Contains the string value "FAX".
   * 
   * e.g. `FAX`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax2AddressType PSETID_Address:000080c2
   */
  fax2AddrType?: string;

  /**
   * Contains the same value as the PidTagNormalizedSubject property (section 2.812).
   * 
   * e.g. `コム ドット イグザンプル 殿`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax2OriginalDisplayName PSETID_Address:000080c4
   */
  fax2OriginalDisplayName?: string;

  /**
   * Specifies the postal code (ZIP code) portion of the work address of the contact.
   * 
   * e.g. `544-0001`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressPostalCode PSETID_Address:00008048
   */
  workAddressPostalCode?: string;

  /**
   * Specifies the street portion of the work address of the contact.
   * 
   * e.g. `Somewhere`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressStreet PSETID_Address:00008045
   */
  workAddressStreet?: string;

  /**
   * Specifies the state or province portion of the work address of the contact.
   * 
   * e.g. `Osaka`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressState PSETID_Address:00008047
   */
  workAddressState?: string;

  /**
   * Specifies the country code portion of the work address of the contact.
   * 
   * e.g. `JP`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressCountryCode PSETID_Address:000080db
   */
  workAddressCountryCode?: string;

  /**
   * Specifies the country or region portion of the work address of the contact.
   * 
   * e.g. `日本`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddressCountry PSETID_Address:00008049
   */
  workAddressCountry?: string;

  /**
   * Specifies the business webpage URL of the contact.
   * 
   * e.g. `https://example.com`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidHtml PSETID_Address:0000802b
   */
  contactHtml?: string;
  /**
   * Specifies the complete address of the work address of the contact.
   * 
   * e.g. `544-0001\nOsaka\nOsaka\nSomewhere`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidWorkAddress PSETID_Address:0000801b
   */
  workAddress?: string;

  /**
   * Contains the same value as the PidTagNormalizedSubject property (section 2.812).
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax1OriginalDisplayName PSETID_Address:000080b4
   */
  fax1OriginalDisplayName?: string;

  /**
   * Contains the primary telephone number of the mail user's place of business.
   * 
   * e.g. `06-0001-0002`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagBusinessTelephoneNumber propertyTag=3a08001f
   */
  businessTelephoneNumber?: string;

  /**
   * Specifies the instant messaging address of the contact.
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidInstantMessagingAddress PSETID_Address:00008062
   */
  instMsg?: string;

  /**
   * This property is ignored by the server and is set to an empty string by the client.
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidDepartment PSETID_Address:00008010
   */
  department?: string;

  /**
   * Contains the location of the mail user.
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidTagLocation propertyTag=3a0d001f
   */
  location?: string;

  /**
   * Contains a user-readable display name, followed by the "@" character, followed by a fax number.
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax1EmailAddress PSETID_Address:000080b3
   */
  fax1EmailAddress?: string;

  /**
   * Contains the same value as the PidTagNormalizedSubject property (section 2.812).
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax3OriginalDisplayName PSETID_Address:000080d4
   */
  fax3OriginalDisplayName?: string;

  /**
   * Contains a user-readable display name, followed by the "@" character, followed by a fax number.
   * 
   * e.g. ``
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * Reference: PidLidFax3EmailAddress PSETID_Address:000080d3
   */
  fax3EmailAddress?: string;

  /**
   * Specifies a string description of the time zone.
   * 
   * e.g. `(UTC+09:00) 大阪、札幌、東京`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see [PidLidTimeZoneDescription Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidtimezonedescription-canonical-property)
   */
  timeZoneDesc?: string;

  /**
   * Contains formatting information about a Multipurpose Internet Mail Extensions (MIME) attachment.
   * 
   * e.g. `image/png`
   * 
   * Target {@link dataType} = 'attachment'.
   * 
   * @see [PidTagAttachMimeTag Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtagattachmimetag-canonical-property)
   */
  attachMimeTag?: string;

  /**
   * Corresponds to the message ID field as specified in [RFC2822].
   * 
   * e.g.
   * 
   * - `<!&!AAAAAAAAAAAYAAAAAAAAAMhvd5eG4u1FrRI13ZUKpD3CgAAAEAAAACfDkx1LwvlJrcgpqnDqBPIBAAAAAA==@xmailserver.test>`
   * - `<000001da0c5d$22ab1460$68013d20$@hmailserver.test>`
   * - `<OS3P286MB0565639EF64566509A9EE31281CC9@OS3P286MB0565.JPNP286.PROD.OUTLOOK.COM>`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see [PidTagInternetMessageId Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidtaginternetmessageid-canonical-property)
   */
  messageId?: string;

  /**
   * Represents the location of an appointment.
   * 
   * e.g.
   * 
   * - ``
   * - `Awesome coffee shop`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see [PidLidLocation Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidlocation-canonical-property)
   */
  apptLocation?: string;

  /**
   * Indicates the original value of the dispidLocation (PidLidLocation) property before a meeting update.
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see [PidLidOldLocation Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidoldlocation-canonical-property)
   */
  apptOldLocation?: string;
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

  /**
   * Contains a stream that maps to the persisted format of a TZDEFINITION structure, which stores the description for the time zone that is used when the start time of a single-instance appointment or meeting request is selected.
   * 
   * @see [PidLidAppointmentTimeZoneDefinitionStartDisplay Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmenttimezonedefinitionstartdisplay-canonical-property)
   * @see [TZDEFINITION | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzdefinition?redirectedfrom=MSDN)
   */
  apptTZDefStartDisplay?: TzDefinition;

  /**
   * Contains a stream that maps to the persisted format of a TZDEFINITION structure, which stores the description for the time zone that is used when the end time of a single-instance appointment or meeting request is selected.
   * 
   * @see [PidLidAppointmentTimeZoneDefinitionEndDisplay Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmenttimezonedefinitionenddisplay-canonical-property)
   * @see [TZDEFINITION | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzdefinition?redirectedfrom=MSDN)
   */
  apptTZDefEndDisplay?: TzDefinition;

  /**
   * Contains a stream that maps to the persisted format of a TZDEFINITION structure, which stores the description for the time zone that is used when a recurring appointment or meeting request is created.
   * 
   * @see [PidLidAppointmentTimeZoneDefinitionRecur Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmenttimezonedefinitionrecur-canonical-property)
   * @see [TZDEFINITION | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzdefinition?redirectedfrom=MSDN)
   */
  apptTZDefRecur?: TzDefinition;

  /**
   * Contains a stream that maps to the persisted format of a TZREG structure, which describes the time zone to be used for the start and end time of a recurring appointment or meeting request.
   * 
   * @see [PidLidTimeZoneStruct Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidtimezonestruct-canonical-property)
   * @see [TZREG [Outlook 2007 Auxiliary Reference] | Microsoft Learn](https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/bb820983%28v=office.12%29?redirectedfrom=MSDN)
   */
  timeZoneStruct?: TzReg;

  /**
   * Specifies the dates and times when a recurring series occurs by using one of the recurrence patterns and ranges that are specified in [MS-OXOCAL].
   * 
   * @see [PidLidAppointmentRecur Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidappointmentrecur-canonical-property)
   */
  apptRecur?: AppointmentRecur;

  /**
   * Specifies the unique identifier of the calendar object.
   * 
   * e.g. `040000008200E00074C5B7101A82E00800000000A048DAF17405D9010000000000000000100000003C10A5564C9D36459E7780C78BAFCB77`
   * 
   * Target {@link dataType} = 'msg'.
   * 
   * @see [PidLidGlobalObjectId Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidglobalobjectid-canonical-property)
   * @see [AppointmentItem.GlobalAppointmentID property (Outlook) | Microsoft Learn](https://learn.microsoft.com/en-us/office/vba/api/outlook.appointmentitem.globalappointmentid)
   */
  globalAppointmentID?: string;

  // Only parsed props!
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
   * String Named Property
   * 
   * The private {@link propertyTag} (`80000000` ~ `ffffffff`) may have this property.
   * 
   * If this is a "string named property", the name can be set arbitrary, as an Unicode text.
   * 
   * e.g.
   * 
   * - `x-ms-exchange-organization-originalclientipaddress`
   * - `HeaderBodyFragmentList`
   * - `DetectedLanguage`
   * - `ConversationIndexTrackingEx`
   * - `ClientInfo`
   * - `x-ms-exchange-organization-originalserveripaddress`
   * - `BigFunnelCorrelationId`
   * - `ExchangeApplicationFlags`
   * - `HasQuotedText`
   * - `IsQuotedTextChanged`
   * - `BigFunnelCompleteIndexingEnd`
   * - `BigFunnelCompleteIndexingStart`
   * - `BigFunnelCorrelationId`
   * - `IsPartiallyIndexed`
   * - `LastIndexingAttemptTime`
   * 
   * @see [[MS-OXMSG]: String Named Property | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/9e984a31-e32d-4e8f-bb92-93bd2df6cd12)
   */
  propertyName: string | undefined;

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
  named,
}

interface FieldValuePair {
  key: string;
  keyType: KeyType;
  value: string | Uint8Array;

  /**
   * About rawProp, skip this one in case of getting unread value from Property Stream.
   */
  notForRawProp: boolean;

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

  private decodeField(fieldClass: string, fieldType: string, provider: () => Uint8Array, ansiEncoding: string, insideProps: boolean): FieldValuePair {
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
          keyType = KeyType.named;
        }
        else {
          propertySet = keyed.propertySet;
          propertyLid = toHex4(keyed.propertyLid);
          const lidDict = CONST.MSG.FIELD.PIDLID_MAPPING[keyed.propertySet];
          if (lidDict !== undefined) {
            const prop = lidDict[keyed.propertyLid];
            if (prop !== undefined) {
              if (prop.dispid !== undefined) {
                key = prop.dispid; // e.g. `votingResponse`
                keyType = KeyType.root;
              }
              else {
                key = prop.id; // e.g. `PidLidVerbStream` listed in SomeParsedOxProps
                keyType = KeyType.toSub;
              }
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
      value = ds.readString(array.length, ansiEncoding);
      skip = insideProps;
    }
    else if (decodeAs === "unicode") {
      value = ds.readUCS2String(array.length / 2);
      skip = insideProps;
    }
    else if (decodeAs === "binary") {
      skip = insideProps;
    }
    else if (decodeAs === "integer") {
      value = ds.readUint32();
    }
    else if (decodeAs === "boolean") {
      value = ds.readUint16() ? true : false;
    }
    else if (decodeAs === "time") {
      const lo = ds.readUint32();
      const fileTime = lo + (4294967296.0 * ds.readUint32());
      value = new Date(fileTimeToUnixEpoch(fileTime)).toUTCString();
    }

    if (skip) {
      key = undefined;
    }

    if (0) { }
    else if (key === "PidLidVerbStream") {
      key = "votingOptions";
      keyType = KeyType.root;
      value = parseVerbStream(ds);
    }
    else if (false
      || key === "apptTZDefStartDisplay"
      || key === "apptTZDefEndDisplay"
      || key === "apptTZDefRecur"
    ) {
      keyType = KeyType.root;
      value = parseTZDEFINITION(ds);
    }
    else if (key === "timeZoneStruct") {
      value = parseTZREG(ds);
    }
    else if (key === "apptRecur") {
      try {
        value = parseAppointmentRecur(ds, ansiEncoding);
      }
      catch (ex) {
        console.debug(ex);

        // drop this data
        key = undefined;
      }
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
    else if (key === "globalAppointmentID") {
      value = bin2HexUpper(ds);
    }

    const propertyTag = `${fieldClass}${fieldType}`;

    return { key, keyType, value, notForRawProp: skip, propertyTag, propertySet, propertyLid, };
  }

  private fieldsDataDocument(parserConfig: ParsingConfig, documentProperty: CFileSet, fields: FieldsData): void {
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
        this.decodeField(fieldClass, fieldType, documentProperty.provider, parserConfig.ansiEncoding, false)
      );
    }
  }

  private setDecodedFieldTo(parserConfig: ParsingConfig, fields: FieldsData, pair: FieldValuePair): void {
    const { key, keyType, value } = pair;
    if (key !== undefined) {
      if (keyType === KeyType.root) {
        fields[key] = value;
      }
    }
    if (parserConfig.includeRawProps === true) {
      fields.rawProps = fields.rawProps || [];
      if (!pair.notForRawProp) {
        fields.rawProps.push(
          {
            propertyTag: pair.propertyTag,
            propertySet: pair.propertySet,
            propertyLid: pair.propertyLid,
            propertyName: (pair.keyType === KeyType.named) ? pair.key : undefined,

            value: value,
          }
        );
      }
    }
  }

  private getFieldType(fieldProperty: CFolder): string {
    const value = fieldProperty.name.substring(12).toLowerCase();
    return value.substring(4, 8);
  }

  private fieldsDataDirInner(parserConfig: ParsingConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData): void {
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

  private fieldsRecipAndAttachmentProperties(parserConfig: ParsingConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const propertiesBinary: Uint8Array = documentProperty.provider();
    const propertiesDs = new DataStream(propertiesBinary, 8, DataStream.LITTLE_ENDIAN);

    this.importPropertiesFromFile(parserConfig, propertiesDs, fields);
  }

  private importPropertiesFromFile(parserConfig: ParsingConfig, propertiesDs: DataStream, fields: FieldsData) {
    // See: [MS-OXMSG]: Outlook Item (.msg) File Format, 2.4 Property Stream
    // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxmsg/20c1125f-043d-42d9-b1dc-cb9b7e5198ef

    const typeConverters = {
      0x0040: (dataView: DataView) => {
        const fileTime = dataView.getUint32(0, true) + (4294967296.0 * dataView.getUint32(4, true));
        return new Date(fileTimeToUnixEpoch(fileTime)).toUTCString();
      },
    };

    while (!propertiesDs.isEof()) {
      const propertyTag = propertiesDs.readUint32();
      if (propertyTag === 0) {
        break;
      }
      const flags = propertiesDs.readUint32();

      const arr = propertiesDs.readUint8Array(8);

      parserConfig.propertyObserver(fields, propertyTag, arr);

      const fieldClass = toHex2((propertyTag / 65536) & 0xFFFF);
      const fieldType = toHex2(propertyTag & 0xFFFF);

      this.setDecodedFieldTo(
        parserConfig,
        fields,
        this.decodeField(fieldClass, fieldType, () => arr, parserConfig.ansiEncoding, true)
      );
    }
  }

  private fieldsRootProperties(parserConfig: ParsingConfig, documentProperty: CFileSet, fields: FieldsData): void {
    const propertiesBinary: Uint8Array = documentProperty.provider();
    const propertiesDs = new DataStream(propertiesBinary, 32, DataStream.LITTLE_ENDIAN);

    this.importPropertiesFromFile(parserConfig, propertiesDs, fields);
  }

  private fieldsDataDir(parserConfig: ParsingConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData, subClass?: string) {
    for (let subFolder of dirProperty.subFolders()) {
      this.fieldsDataDirInner(parserConfig, subFolder, rootFolder, fields);
    }

    for (let fileSet of dirProperty.fileNameSets()) {
      if (0) { }
      else if (fileSet.name.indexOf(CONST.MSG.FIELD.PREFIX.DOCUMENT) == 0) {
        this.fieldsDataDocument(parserConfig, fileSet, fields);
      }
      else if (fileSet.name === "__properties_version1.0") {
        if (subClass === "recip" || subClass === "attachment" || subClass === "sub") {
          this.fieldsRecipAndAttachmentProperties(parserConfig, fileSet, fields);
        }
        else if (subClass === "root") {
          this.fieldsRootProperties(parserConfig, fileSet, fields);
        }
      }
    }
  }

  private fieldsNameIdDir(parserConfig: ParsingConfig, dirProperty: CFolder, rootFolder: CFolder, fields: FieldsData) {
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
  private fieldsDataReader(parserConfig: ParsingConfig): FieldsData {
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
  private parseMsgData(parserConfig: ParsingConfig): FieldsData {
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
          includeRawProps: this.parserConfig?.includeRawProps ? true : false,
          ansiEncoding: emptyToNull(this.parserConfig?.ansiEncoding),
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
