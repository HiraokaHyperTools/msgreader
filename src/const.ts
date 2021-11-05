import { uInt2int } from './utils'

export default {
  FILE_HEADER: uInt2int([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]),
  MSG: {
    UNUSED_BLOCK: -1,
    END_OF_CHAIN: -2,

    S_BIG_BLOCK_SIZE: 0x0200,
    S_BIG_BLOCK_MARK: 9,

    L_BIG_BLOCK_SIZE: 0x1000,
    L_BIG_BLOCK_MARK: 12,

    SMALL_BLOCK_SIZE: 0x0040,
    BIG_BLOCK_MIN_DOC_SIZE: 0x1000,
    HEADER: {
      PROPERTY_START_OFFSET: 0x30,

      BAT_START_OFFSET: 0x4c,
      BAT_COUNT_OFFSET: 0x2C,

      SBAT_START_OFFSET: 0x3C,
      SBAT_COUNT_OFFSET: 0x40,

      XBAT_START_OFFSET: 0x44,
      XBAT_COUNT_OFFSET: 0x48
    },
    PROP: {
      NO_INDEX: -1,
      PROPERTY_SIZE: 0x0080,

      NAME_SIZE_OFFSET: 0x40,
      MAX_NAME_LENGTH: (/*NAME_SIZE_OFFSET*/0x40 / 2) - 1,
      TYPE_OFFSET: 0x42,
      PREVIOUS_PROPERTY_OFFSET: 0x44,
      NEXT_PROPERTY_OFFSET: 0x48,
      CHILD_PROPERTY_OFFSET: 0x4C,
      START_BLOCK_OFFSET: 0x74,
      SIZE_OFFSET: 0x78,
      TYPE_ENUM: {
        DIRECTORY: 1,
        DOCUMENT: 2,
        ROOT: 5
      }
    },
    FIELD: {
      PREFIX: {
        ATTACHMENT: '__attach_version1.0',
        RECIPIENT: '__recip_version1.0',
        DOCUMENT: '__substg1.',
        NAMEID: '__nameid_version1.0'
      },
      // example (use fields as needed)
      NAME_MAPPING: {
        // email specific
        '001a': 'messageClass',
        '0037': 'subject',
        '0c1a': 'senderName',
        '0c1e': 'senderAddressType',
        '0c1f': 'senderEmail',
        '5d01': 'senderSmtpAddress',
        '5d02': 'sentRepresentingSmtpAddress',
        '5d0a': 'creatorSMTPAddress',
        '5d0b': 'lastModifierSMTPAddress',
        '1000': 'body',
        '007d': 'headers',
        '1009': 'compressedRtf',
        '3ffa': 'lastModifierName',
        '0039': 'clientSubmitTime',
        '0e06': 'messageDeliveryTime',
        // attachment specific
        '3007': 'creationTime',
        '3008': 'lastModificationTime',
        '3703': 'extension',
        '3704': 'fileNameShort',
        '3707': 'fileName',
        '3712': 'pidContentId',
        '7ffe': 'attachmentHidden',
        // recipient specific
        '0c15': 'recipType',
        '3001': 'name',
        '3002': 'addressType',
        '3003': 'email',
        '39fe': 'smtpAddress'
      },
      FULL_NAME_MAPPING: {
        '1013001f': 'bodyHtml',
        '10130102': 'html',
      },
      PIDLID_MAPPING: {
        // PSETID_Common
        "00062008-0000-0000-c000-000000000046": {
          0x00008520: { id: "PidLidVerbStream", },
          0x00008524: { id: "PidLidVerbResponse", dispid: "votingResponse", },
          0x00008580: { id: "PidLidInternetAccountName", dispid: "inetAcctName", },
        },
        // PSETID_Appointment
        "00062002-0000-0000-c000-000000000046": {
          0x0000820D: { id: "PidLidAppointmentStartWhole", dispid: "apptStartWhole", },
          0x0000820E: { id: "PidLidAppointmentEndWhole", dispid: "apptEndWhole", },
          0x00008235: { id: "PidLidClipStart", dispid: "clipStart", },
          0x00008236: { id: "PidLidClipEnd", dispid: "clipEnd", },
        },
      },
      CLASS_MAPPING: {
        ATTACHMENT_DATA: '3701'
      },
      TYPE_MAPPING: {
        '001e': 'string',
        '001f': 'unicode',
        '0040': 'time',
        '0102': 'binary',
        '0003': 'integer',
        '000b': 'boolean',
      },
      DIR_TYPE: {
        INNER_MSG: '000d'
      }
    }
  }
}