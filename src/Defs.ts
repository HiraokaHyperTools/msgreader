/**
 * Obtain a copy of list of some known property tags.
 * 
 * e.g.
 * 
 * ```
 * [
 *  ...,
 *  {
 *   "area": "General Message Properties",
 *   "key": "0037001F",
 *   "name": "PidTagSubject"
 *  },
 *  ...
 * ]
 * ```
 * 
 */
export function getProps(): Array<{ area: string, key: string, name: string }> {
    return [
        {
            "area": "Access Control Properties",
            "key": "0FF40003",
            "name": "PidTagAccess"
        },
        {
            "area": "Access Control Properties",
            "key": "3FE00102",
            "name": "PidTagAccessControlListData"
        },
        {
            "area": "Access Control Properties",
            "key": "0FF70003",
            "name": "PidTagAccessLevel"
        },
        {
            "area": "Address Book",
            "key": "3A00001F",
            "name": "PidTagAccount"
        },
        {
            "area": "Outlook Application",
            "key": "36D81102",
            "name": "PidTagAdditionalRenEntryIds"
        },
        {
            "area": "Outlook Application",
            "key": "36D90102",
            "name": "PidTagAdditionalRenEntryIdsEx"
        },
        {
            "area": "Address Book",
            "key": "8CD8000D",
            "name": "PidTagAddressBookAuthorizedSenders"
        },
        {
            "area": "Address Book",
            "key": "FFFD0003",
            "name": "PidTagAddressBookContainerId"
        },
        {
            "area": "Address Book",
            "key": "806A0003",
            "name": "PidTagAddressBookDeliveryContentLength"
        },
        {
            "area": "Address Book",
            "key": "39FF001F",
            "name": "PidTagAddressBookDisplayNamePrintable"
        },
        {
            "area": "Address Book",
            "key": "8C930003",
            "name": "PidTagAddressBookDisplayTypeExtended"
        },
        {
            "area": "Address Book",
            "key": "8CE30003",
            "name": "PidTagAddressBookDistributionListExternalMemberCount"
        },
        {
            "area": "Address Book",
            "key": "8CE20003",
            "name": "PidTagAddressBookDistributionListMemberCount"
        },
        {
            "area": "Address Book",
            "key": "8073000D",
            "name": "PidTagAddressBookDistributionListMemberSubmitAccepted"
        },
        {
            "area": "Address Book",
            "key": "8CDA000D",
            "name": "PidTagAddressBookDistributionListMemberSubmitRejected"
        },
        {
            "area": "Address book",
            "key": "8CDB000D",
            "name": "PidTagAddressBookDistributionListRejectMessagesFromDLMembers"
        },
        {
            "area": "Address Book",
            "key": "663B0102",
            "name": "PidTagAddressBookEntryId"
        },
        {
            "area": "Address Book",
            "key": "802D001F",
            "name": "PidTagAddressBookExtensionAttribute1"
        },
        {
            "area": "Address Book",
            "key": "8036001F",
            "name": "PidTagAddressBookExtensionAttribute10"
        },
        {
            "area": "Address Book",
            "key": "8C57001F",
            "name": "PidTagAddressBookExtensionAttribute11"
        },
        {
            "area": "Address Book",
            "key": "8C58001F",
            "name": "PidTagAddressBookExtensionAttribute12"
        },
        {
            "area": "Address Book",
            "key": "8C59001F",
            "name": "PidTagAddressBookExtensionAttribute13"
        },
        {
            "area": "Address Book",
            "key": "8C60001F",
            "name": "PidTagAddressBookExtensionAttribute14"
        },
        {
            "area": "Address Book",
            "key": "8C61001F",
            "name": "PidTagAddressBookExtensionAttribute15"
        },
        {
            "area": "Address Book",
            "key": "802E001F",
            "name": "PidTagAddressBookExtensionAttribute2"
        },
        {
            "area": "Address Book",
            "key": "802F001F",
            "name": "PidTagAddressBookExtensionAttribute3"
        },
        {
            "area": "Address Book",
            "key": "8030001F",
            "name": "PidTagAddressBookExtensionAttribute4"
        },
        {
            "area": "Address Book",
            "key": "8031001F",
            "name": "PidTagAddressBookExtensionAttribute5"
        },
        {
            "area": "Address Book",
            "key": "8032001F",
            "name": "PidTagAddressBookExtensionAttribute6"
        },
        {
            "area": "Address Book",
            "key": "8033001F",
            "name": "PidTagAddressBookExtensionAttribute7"
        },
        {
            "area": "Address Book",
            "key": "8034001F",
            "name": "PidTagAddressBookExtensionAttribute8"
        },
        {
            "area": "Address Book",
            "key": "8035001F",
            "name": "PidTagAddressBookExtensionAttribute9"
        },
        {
            "area": "Address Book",
            "key": "8004001F",
            "name": "PidTagAddressBookFolderPathname"
        },
        {
            "area": "Address Book",
            "key": "8C9A000D",
            "name": "PidTagAddressBookHierarchicalChildDepartments"
        },
        {
            "area": "Address Book",
            "key": "8C97000D",
            "name": "PidTagAddressBookHierarchicalDepartmentMembers"
        },
        {
            "area": "Address Book",
            "key": "8CDD000B",
            "name": "PidTagAddressBookHierarchicalIsHierarchicalGroup"
        },
        {
            "area": "Address Book",
            "key": "8C99000D",
            "name": "PidTagAddressBookHierarchicalParentDepartment"
        },
        {
            "area": "Address Book",
            "key": "8C98001E",
            "name": "PidTagAddressBookHierarchicalRootDepartment"
        },
        {
            "area": "Address Book",
            "key": "8C94000D",
            "name": "PidTagAddressBookHierarchicalShowInDepartments"
        },
        {
            "area": "Address Book",
            "key": "8006001E",
            "name": "PidTagAddressBookHomeMessageDatabase"
        },
        {
            "area": "Address Book",
            "key": "8006000D",
            "name": "PidTagAddressBookHomeMessageDatabase"
        },
        {
            "area": "Address Book",
            "key": "FFFB000B",
            "name": "PidTagAddressBookIsMaster"
        },
        {
            "area": "Address Book",
            "key": "8008001E",
            "name": "PidTagAddressBookIsMemberOfDistributionList"
        },
        {
            "area": "Address Book",
            "key": "8008000D",
            "name": "PidTagAddressBookIsMemberOfDistributionList"
        },
        {
            "area": "Address Book",
            "key": "6704000D",
            "name": "PidTagAddressBookManageDistributionList"
        },
        {
            "area": "Address Book",
            "key": "8005000D",
            "name": "PidTagAddressBookManager"
        },
        {
            "area": "Address Book",
            "key": "8005001F",
            "name": "PidTagAddressBookManagerDistinguishedName"
        },
        {
            "area": "Address Book",
            "key": "8009000D",
            "name": "PidTagAddressBookMember"
        },
        {
            "area": "ProviderDefinedNonTransmittable",
            "key": "674F0014",
            "name": "PidTagAddressBookMessageId"
        },
        {
            "area": "Address Book",
            "key": "8CB5000B",
            "name": "PidTagAddressBookModerationEnabled"
        },
        {
            "area": "Address Book",
            "key": "8170101F",
            "name": "PidTagAddressBookNetworkAddress"
        },
        {
            "area": "Address Book",
            "key": "803C001F",
            "name": "PidTagAddressBookObjectDistinguishedName"
        },
        {
            "area": "Address Book",
            "key": "8C6D0102",
            "name": "PidTagAddressBookObjectGuid"
        },
        {
            "area": "Address Book",
            "key": "8CA8001F",
            "name": "PidTagAddressBookOrganizationalUnitRootDistinguishedName"
        },
        {
            "area": "Address Book",
            "key": "800C000D",
            "name": "PidTagAddressBookOwner"
        },
        {
            "area": "Address Book",
            "key": "8024000D",
            "name": "PidTagAddressBookOwnerBackLink"
        },
        {
            "area": "Address Book",
            "key": "FFFC0102",
            "name": "PidTagAddressBookParentEntryId"
        },
        {
            "area": "Address Book",
            "key": "8C91001F",
            "name": "PidTagAddressBookPhoneticCompanyName"
        },
        {
            "area": "Address Book",
            "key": "8C90001F",
            "name": "PidTagAddressBookPhoneticDepartmentName"
        },
        {
            "area": "Address Book",
            "key": "8C92001F",
            "name": "PidTagAddressBookPhoneticDisplayName"
        },
        {
            "area": "Address Book",
            "key": "8C8E001F",
            "name": "PidTagAddressBookPhoneticGivenName"
        },
        {
            "area": "Address Book",
            "key": "8C8F001F",
            "name": "PidTagAddressBookPhoneticSurname"
        },
        {
            "area": "Address Book",
            "key": "800F101F",
            "name": "PidTagAddressBookProxyAddresses"
        },
        {
            "area": "Address Book",
            "key": "8015000D",
            "name": "PidTagAddressBookPublicDelegates"
        },
        {
            "area": "Address Book",
            "key": "800E000D",
            "name": "PidTagAddressBookReports"
        },
        {
            "area": "Address Book",
            "key": "08070003",
            "name": "PidTagAddressBookRoomCapacity"
        },
        {
            "area": "Address Book",
            "key": "8C96101F",
            "name": "PidTagAddressBookRoomContainers"
        },
        {
            "area": "Address Book",
            "key": "0809001F",
            "name": "PidTagAddressBookRoomDescription"
        },
        {
            "area": "Address Book",
            "key": "8CAC101F",
            "name": "PidTagAddressBookSenderHintTranslations"
        },
        {
            "area": "Address Book",
            "key": "8CA00003",
            "name": "PidTagAddressBookSeniorityIndex"
        },
        {
            "area": "Address Book",
            "key": "8011001F",
            "name": "PidTagAddressBookTargetAddress"
        },
        {
            "area": "Address Book",
            "key": "8CD9000D",
            "name": "PidTagAddressBookUnauthorizedSenders"
        },
        {
            "area": "Address Book",
            "key": "8C6A1102",
            "name": "PidTagAddressBookX509Certificate"
        },
        {
            "area": "Address Properties",
            "key": "3002001F",
            "name": "PidTagAddressType"
        },
        {
            "area": "Address Properties",
            "key": "0002000B",
            "name": "PidTagAlternateRecipientAllowed"
        },
        {
            "area": "Address Book",
            "key": "360C001F",
            "name": "PidTagAnr"
        },
        {
            "area": "Archive",
            "key": "301F0040",
            "name": "PidTagArchiveDate"
        },
        {
            "area": "Archive",
            "key": "301E0003",
            "name": "PidTagArchivePeriod"
        },
        {
            "area": "Archive",
            "key": "30180102",
            "name": "PidTagArchiveTag"
        },
        {
            "area": "Address Properties",
            "key": "3A30001F",
            "name": "PidTagAssistant"
        },
        {
            "area": "Address Properties",
            "key": "3A2E001F",
            "name": "PidTagAssistantTelephoneNumber"
        },
        {
            "area": "Sync",
            "key": "67AA000B",
            "name": "PidTagAssociated"
        },
        {
            "area": "Message Attachment Properties",
            "key": "370F0102",
            "name": "PidTagAttachAdditionalInformation"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3711001F",
            "name": "PidTagAttachContentBase"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3713001F",
            "name": "PidTagAttachContentLocation"
        },
        {
            "area": "Message Attachment Properties",
            "key": "37010102",
            "name": "PidTagAttachDataBinary"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3701000D",
            "name": "PidTagAttachDataObject"
        },
        {
            "area": "Message Attachment Properties",
            "key": "37020102",
            "name": "PidTagAttachEncoding"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3703001F",
            "name": "PidTagAttachExtension"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3704001F",
            "name": "PidTagAttachFilename"
        },
        {
            "area": "Message Attachment Properties",
            "key": "37140003",
            "name": "PidTagAttachFlags"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3707001F",
            "name": "PidTagAttachLongFilename"
        },
        {
            "area": "Message Attachment Properties",
            "key": "370D001F",
            "name": "PidTagAttachLongPathname"
        },
        {
            "area": "Message Attachment Properties",
            "key": "7FFF000B",
            "name": "PidTagAttachmentContactPhoto"
        },
        {
            "area": "Message Attachment Properties",
            "key": "7FFD0003",
            "name": "PidTagAttachmentFlags"
        },
        {
            "area": "Message Attachment Properties",
            "key": "7FFE000B",
            "name": "PidTagAttachmentHidden"
        },
        {
            "area": "Message Attachment Properties",
            "key": "7FFA0003",
            "name": "PidTagAttachmentLinkId"
        },
        {
            "area": "Message Attachment Properties",
            "key": "37050003",
            "name": "PidTagAttachMethod"
        },
        {
            "area": "Message Attachment Properties",
            "key": "370E001F",
            "name": "PidTagAttachMimeTag"
        },
        {
            "area": "Message Attachment Properties",
            "key": "0E210003",
            "name": "PidTagAttachNumber"
        },
        {
            "area": "Message Attachment Properties",
            "key": "3708001F",
            "name": "PidTagAttachPathname"
        },
        {
            "area": "Outlook Application",
            "key": "371A001F",
            "name": "PidTagAttachPayloadClass"
        },
        {
            "area": "Outlook Application",
            "key": "3719001F",
            "name": "PidTagAttachPayloadProviderGuidString"
        },
        {
            "area": "Message Attachment Properties",
            "key": "37090102",
            "name": "PidTagAttachRendering"
        },
        {
            "area": "Message Attachment Properties",
            "key": "0E200003",
            "name": "PidTagAttachSize"
        },
        {
            "area": "Message Attachment Properties",
            "key": "370A0102",
            "name": "PidTagAttachTag"
        },
        {
            "area": "Message Attachment Properties",
            "key": "370C001F",
            "name": "PidTagAttachTransportName"
        },
        {
            "area": "Access Control Properties",
            "key": "10F4000B",
            "name": "PidTagAttributeHidden"
        },
        {
            "area": "Access Control Properties",
            "key": "10F6000B",
            "name": "PidTagAttributeReadOnly"
        },
        {
            "area": "General Report Properties",
            "key": "0004001F",
            "name": "PidTagAutoForwardComment"
        },
        {
            "area": "General Report Properties",
            "key": "0005000B",
            "name": "PidTagAutoForwarded"
        },
        {
            "area": "Email",
            "key": "3FDF0003",
            "name": "PidTagAutoResponseSuppress"
        },
        {
            "area": "Contact Properties",
            "key": "3A420040",
            "name": "PidTagBirthday"
        },
        {
            "area": "Secure Messaging Properties",
            "key": "10960003",
            "name": "PidTagBlockStatus"
        },
        {
            "area": "General Message Properties",
            "key": "1000001F",
            "name": "PidTagBody"
        },
        {
            "area": "Exchange",
            "key": "1015001F",
            "name": "PidTagBodyContentId"
        },
        {
            "area": "MIME Properties",
            "key": "1014001F",
            "name": "PidTagBodyContentLocation"
        },
        {
            "area": "General Message Properties",
            "key": "1013001F",
            "name": "PidTagBodyHtml"
        },
        {
            "area": "Contact Properties",
            "key": "3A1B001F",
            "name": "PidTagBusiness2TelephoneNumber"
        },
        {
            "area": "Contact Properties",
            "key": "3A1B101F",
            "name": "PidTagBusiness2TelephoneNumbers"
        },
        {
            "area": "Contact Properties",
            "key": "3A24001F",
            "name": "PidTagBusinessFaxNumber"
        },
        {
            "area": "Contact Properties",
            "key": "3A51001F",
            "name": "PidTagBusinessHomePage"
        },
        {
            "area": "Contact Properties",
            "key": "3A08001F",
            "name": "PidTagBusinessTelephoneNumber"
        },
        {
            "area": "Contact Properties",
            "key": "3A02001F",
            "name": "PidTagCallbackTelephoneNumber"
        },
        {
            "area": "Unified Messaging",
            "key": "6806001F",
            "name": "PidTagCallId"
        },
        {
            "area": "Contact Properties",
            "key": "3A1E001F",
            "name": "PidTagCarTelephoneNumber"
        },
        {
            "area": "Exchange",
            "key": "10C50040",
            "name": "PidTagCdoRecurrenceid"
        },
        {
            "area": "History Properties",
            "key": "65E20102",
            "name": "PidTagChangeKey"
        },
        {
            "area": "Sync",
            "key": "67A40014",
            "name": "PidTagChangeNumber"
        },
        {
            "area": "Contact Properties",
            "key": "3A58101F",
            "name": "PidTagChildrensNames"
        },
        {
            "area": "Server-side Rules Properties",
            "key": "66450102",
            "name": "PidTagClientActions"
        },
        {
            "area": "Message Time Properties",
            "key": "00390040",
            "name": "PidTagClientSubmitTime"
        },
        {
            "area": "Exchange Profile Configuration",
            "key": "66C30003",
            "name": "PidTagCodePageId"
        },
        {
            "area": "Common",
            "key": "3004001F",
            "name": "PidTagComment"
        },
        {
            "area": "Contact Properties",
            "key": "3A57001F",
            "name": "PidTagCompanyMainTelephoneNumber"
        },
        {
            "area": "Contact Properties",
            "key": "3A16001F",
            "name": "PidTagCompanyName"
        },
        {
            "area": "Contact Properties",
            "key": "3A49001F",
            "name": "PidTagComputerNetworkName"
        },
        {
            "area": "ICS",
            "key": "3FF00102",
            "name": "PidTagConflictEntryId"
        },
        {
            "area": "Container Properties",
            "key": "3613001F",
            "name": "PidTagContainerClass"
        },
        {
            "area": "Container Properties",
            "key": "360F000D",
            "name": "PidTagContainerContents"
        },
        {
            "area": "Address Book",
            "key": "36000003",
            "name": "PidTagContainerFlags"
        },
        {
            "area": "Container Properties",
            "key": "360E000D",
            "name": "PidTagContainerHierarchy"
        },
        {
            "area": "Folder Properties",
            "key": "36020003",
            "name": "PidTagContentCount"
        },
        {
            "area": "Secure Messaging Properties",
            "key": "40760003",
            "name": "PidTagContentFilterSpamConfidenceLevel"
        },
        {
            "area": "Folder Properties",
            "key": "36030003",
            "name": "PidTagContentUnreadCount"
        },
        {
            "area": "Conversations",
            "key": "30130102",
            "name": "PidTagConversationId"
        },
        {
            "area": "General Message Properties",
            "key": "00710102",
            "name": "PidTagConversationIndex"
        },
        {
            "area": "Conversations",
            "key": "3016000B",
            "name": "PidTagConversationIndexTracking"
        },
        {
            "area": "General Message Properties",
            "key": "0070001F",
            "name": "PidTagConversationTopic"
        },
        {
            "area": "Contact Properties",
            "key": "3A26001F",
            "name": "PidTagCountry"
        },
        {
            "area": "Message Time Properties",
            "key": "30070040",
            "name": "PidTagCreationTime"
        },
        {
            "area": "ID Properties",
            "key": "3FF90102",
            "name": "PidTagCreatorEntryId"
        },
        {
            "area": "General Message Properties",
            "key": "3FF8001F",
            "name": "PidTagCreatorName"
        },
        {
            "area": "Contact Properties",
            "key": "3A4A001F",
            "name": "PidTagCustomerId"
        },
        {
            "area": "Server-side Rules Properties",
            "key": "6647000B",
            "name": "PidTagDamBackPatched"
        },
        {
            "area": "Server-side Rules Properties",
            "key": "66460102",
            "name": "PidTagDamOriginalEntryId"
        },
        {
            "area": "MapiContainer",
            "key": "36E5001F",
            "name": "PidTagDefaultPostMessageClass"
        },
        {
            "area": "Server-side Rules Properties",
            "key": "674100FB",
            "name": "PidTagDeferredActionMessageOriginalEntryId"
        },
        {
            "area": "MapiEnvelope",
            "key": "000F0040",
            "name": "PidTagDeferredDeliveryTime"
        },
        {
            "area": "MapiStatus",
            "key": "3FEB0003",
            "name": "PidTagDeferredSendNumber"
        },
        {
            "area": "MapiStatus",
            "key": "3FEF0040",
            "name": "PidTagDeferredSendTime"
        },
        {
            "area": "MapiStatus",
            "key": "3FEC0003",
            "name": "PidTagDeferredSendUnits"
        },
        {
            "area": "MapiStatus",
            "key": "3FE3000B",
            "name": "PidTagDelegatedByRule"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "686B1003",
            "name": "PidTagDelegateFlags"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E01000B",
            "name": "PidTagDeleteAfterSubmit"
        },
        {
            "area": "Server",
            "key": "670B0003",
            "name": "PidTagDeletedCountTotal"
        },
        {
            "area": "ExchangeFolder",
            "key": "668F0040",
            "name": "PidTagDeletedOn"
        },
        {
            "area": "Email",
            "key": "00100040",
            "name": "PidTagDeliverTime"
        },
        {
            "area": "MapiMailUser",
            "key": "3A18001F",
            "name": "PidTagDepartmentName"
        },
        {
            "area": "MapiCommon",
            "key": "30050003",
            "name": "PidTagDepth"
        },
        {
            "area": "Message Properties",
            "key": "0E02001F",
            "name": "PidTagDisplayBcc"
        },
        {
            "area": "Message Properties",
            "key": "0E03001F",
            "name": "PidTagDisplayCc"
        },
        {
            "area": "MapiCommon",
            "key": "3001001F",
            "name": "PidTagDisplayName"
        },
        {
            "area": "MapiMailUser",
            "key": "3A45001F",
            "name": "PidTagDisplayNamePrefix"
        },
        {
            "area": "Message Properties",
            "key": "0E04001F",
            "name": "PidTagDisplayTo"
        },
        {
            "area": "MapiAddressBook",
            "key": "39000003",
            "name": "PidTagDisplayType"
        },
        {
            "area": "MapiAddressBook",
            "key": "39050003",
            "name": "PidTagDisplayTypeEx"
        },
        {
            "area": "MapiCommon",
            "key": "3003001F",
            "name": "PidTagEmailAddress"
        },
        {
            "area": "MapiEnvelope Property set",
            "key": "00610040",
            "name": "PidTagEndDate"
        },
        {
            "area": "ID Properties",
            "key": "0FFF0102",
            "name": "PidTagEntryId"
        },
        {
            "area": "MessageClassDefinedNonTransmittable",
            "key": "7FFC0040",
            "name": "PidTagExceptionEndTime"
        },
        {
            "area": "MessageClassDefinedNonTransmittable",
            "key": "7FF90040",
            "name": "PidTagExceptionReplaceTime"
        },
        {
            "area": "MessageClassDefinedNonTransmittable",
            "key": "7FFB0040",
            "name": "PidTagExceptionStartTime"
        },
        {
            "area": "Calendar Document",
            "key": "0E840102",
            "name": "PidTagExchangeNTSecurityDescriptor"
        },
        {
            "area": "MapiStatus",
            "key": "3FED0003",
            "name": "PidTagExpiryNumber"
        },
        {
            "area": "MapiEnvelope",
            "key": "00150040",
            "name": "PidTagExpiryTime"
        },
        {
            "area": "MapiStatus",
            "key": "3FEE0003",
            "name": "PidTagExpiryUnits"
        },
        {
            "area": "MapiContainer",
            "key": "36DA0102",
            "name": "PidTagExtendedFolderFlags"
        },
        {
            "area": "Rules",
            "key": "0E990102",
            "name": "PidTagExtendedRuleMessageActions"
        },
        {
            "area": "Rules",
            "key": "0E9A0102",
            "name": "PidTagExtendedRuleMessageCondition"
        },
        {
            "area": "Rules",
            "key": "0E9B0003",
            "name": "PidTagExtendedRuleSizeLimit"
        },
        {
            "area": "Unified Messaging",
            "key": "68040003",
            "name": "PidTagFaxNumberOfPages"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "10910040",
            "name": "PidTagFlagCompleteTime"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "10900003",
            "name": "PidTagFlagStatus"
        },
        {
            "area": "ExchangeAdministrative",
            "key": "670E001F",
            "name": "PidTagFlatUrlName"
        },
        {
            "area": "MapiContainer",
            "key": "3610000D",
            "name": "PidTagFolderAssociatedContents"
        },
        {
            "area": "ID Properties",
            "key": "67480014",
            "name": "PidTagFolderId"
        },
        {
            "area": "ExchangeAdministrative",
            "key": "66A80003",
            "name": "PidTagFolderFlags"
        },
        {
            "area": "MapiContainer",
            "key": "36010003",
            "name": "PidTagFolderType"
        },
        {
            "area": "RenMessageFolder",
            "key": "10950003",
            "name": "PidTagFollowupIcon"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "68690003",
            "name": "PidTagFreeBusyCountMonths"
        },
        {
            "area": "MapiContainer",
            "key": "36E41102",
            "name": "PidTagFreeBusyEntryIds"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "6849001F",
            "name": "PidTagFreeBusyMessageEmailAddress"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68480003",
            "name": "PidTagFreeBusyPublishEnd"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68470003",
            "name": "PidTagFreeBusyPublishStart"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68680040",
            "name": "PidTagFreeBusyRangeTimestamp"
        },
        {
            "area": "MapiMailUser",
            "key": "3A4C001F",
            "name": "PidTagFtpSite"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "6846000B",
            "name": "PidTagGatewayNeedsToRefresh"
        },
        {
            "area": "MapiMailUser",
            "key": "3A4D0002",
            "name": "PidTagGender"
        },
        {
            "area": "MapiMailUser",
            "key": "3A05001F",
            "name": "PidTagGeneration"
        },
        {
            "area": "MapiMailUser",
            "key": "3A06001F",
            "name": "PidTagGivenName"
        },
        {
            "area": "MapiMailUser",
            "key": "3A07001F",
            "name": "PidTagGovernmentIdNumber"
        },
        {
            "area": "Message Attachment Properties Property set",
            "key": "0E1B000B",
            "name": "PidTagHasAttachments"
        },
        {
            "area": "Rules",
            "key": "3FEA000B",
            "name": "PidTagHasDeferredActionMessages"
        },
        {
            "area": "ExchangeMessageReadOnly",
            "key": "664A000B",
            "name": "PidTagHasNamedProperties"
        },
        {
            "area": "ExchangeFolder",
            "key": "663A000B",
            "name": "PidTagHasRules"
        },
        {
            "area": "ExchangeFolder",
            "key": "663E0003",
            "name": "PidTagHierarchyChangeNumber"
        },
        {
            "area": "TransportEnvelope",
            "key": "40820040",
            "name": "PidTagHierRev"
        },
        {
            "area": "MapiMailUser",
            "key": "3A43001F",
            "name": "PidTagHobbies"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2F001F",
            "name": "PidTagHome2TelephoneNumber"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2F101F",
            "name": "PidTagHome2TelephoneNumbers"
        },
        {
            "area": "MapiMailUser",
            "key": "3A59001F",
            "name": "PidTagHomeAddressCity"
        },
        {
            "area": "MapiMailUser",
            "key": "3A5A001F",
            "name": "PidTagHomeAddressCountry"
        },
        {
            "area": "MapiMailUser",
            "key": "3A5B001F",
            "name": "PidTagHomeAddressPostalCode"
        },
        {
            "area": "MapiMailUser",
            "key": "3A5E001F",
            "name": "PidTagHomeAddressPostOfficeBox"
        },
        {
            "area": "MapiMailUser",
            "key": "3A5C001F",
            "name": "PidTagHomeAddressStateOrProvince"
        },
        {
            "area": "MapiMailUser",
            "key": "3A5D001F",
            "name": "PidTagHomeAddressStreet"
        },
        {
            "area": "MapiMailUser",
            "key": "3A25001F",
            "name": "PidTagHomeFaxNumber"
        },
        {
            "area": "MapiMailUser",
            "key": "3A09001F",
            "name": "PidTagHomeTelephoneNumber"
        },
        {
            "area": "General Message Properties",
            "key": "10130102",
            "name": "PidTagHtml"
        },
        {
            "area": "Calendar",
            "key": "10C40040",
            "name": "PidTagICalendarEndTime"
        },
        {
            "area": "Calendar",
            "key": "10CA0040",
            "name": "PidTagICalendarReminderNextTime"
        },
        {
            "area": "Calendar Property set",
            "key": "10C30040",
            "name": "PidTagICalendarStartTime"
        },
        {
            "area": "General Message Properties",
            "key": "10800003",
            "name": "PidTagIconIndex"
        },
        {
            "area": "General Message Properties",
            "key": "00170003",
            "name": "PidTagImportance"
        },
        {
            "area": "Conflict Note",
            "key": "666C000B",
            "name": "PidTagInConflict"
        },
        {
            "area": "MAPI Display Tables",
            "key": "3F080003",
            "name": "PidTagInitialDetailsPane"
        },
        {
            "area": "Address Properties",
            "key": "3A0A001F",
            "name": "PidTagInitials"
        },
        {
            "area": "General Message Properties",
            "key": "1042001F",
            "name": "PidTagInReplyToId"
        },
        {
            "area": "Table Properties",
            "key": "0FF60102",
            "name": "PidTagInstanceKey"
        },
        {
            "area": "ProviderDefinedNonTransmittable",
            "key": "674E0003",
            "name": "PidTagInstanceNum"
        },
        {
            "area": "ProviderDefinedNonTransmittable",
            "key": "674D0014",
            "name": "PidTagInstID"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "3FDE0003",
            "name": "PidTagInternetCodepage"
        },
        {
            "area": "MIME Properties",
            "key": "59020003",
            "name": "PidTagInternetMailOverrideFormat"
        },
        {
            "area": "MIME Properties",
            "key": "1035001F",
            "name": "PidTagInternetMessageId"
        },
        {
            "area": "MIME Properties",
            "key": "1039001F",
            "name": "PidTagInternetReferences"
        },
        {
            "area": "Folder Properties",
            "key": "36D00102",
            "name": "PidTagIpmAppointmentEntryId"
        },
        {
            "area": "Folder Properties",
            "key": "36D10102",
            "name": "PidTagIpmContactEntryId"
        },
        {
            "area": "Folder Properties",
            "key": "36D70102",
            "name": "PidTagIpmDraftsEntryId"
        },
        {
            "area": "Folder Properties",
            "key": "36D20102",
            "name": "PidTagIpmJournalEntryId"
        },
        {
            "area": "Folder Properties",
            "key": "36D30102",
            "name": "PidTagIpmNoteEntryId"
        },
        {
            "area": "Folder Properties",
            "key": "36D40102",
            "name": "PidTagIpmTaskEntryId"
        },
        {
            "area": "Address Properties",
            "key": "3A2D001F",
            "name": "PidTagIsdnNumber"
        },
        {
            "area": "Spam",
            "key": "61030003",
            "name": "PidTagJunkAddRecipientsToSafeSendersList"
        },
        {
            "area": "Spam",
            "key": "61000003",
            "name": "PidTagJunkIncludeContacts"
        },
        {
            "area": "Spam",
            "key": "61020003",
            "name": "PidTagJunkPermanentlyDelete"
        },
        {
            "area": "Spam",
            "key": "6107000B",
            "name": "PidTagJunkPhishingEnableLinks"
        },
        {
            "area": "Spam",
            "key": "61010003",
            "name": "PidTagJunkThreshold"
        },
        {
            "area": "Address Properties",
            "key": "3A0B001F",
            "name": "PidTagKeyword"
        },
        {
            "area": "Address Properties",
            "key": "3A0C001F",
            "name": "PidTagLanguage"
        },
        {
            "area": "Message Time Properties",
            "key": "30080040",
            "name": "PidTagLastModificationTime"
        },
        {
            "area": "History Properties",
            "key": "3FFB0102",
            "name": "PidTagLastModifierEntryId"
        },
        {
            "area": "History Properties",
            "key": "3FFA001F",
            "name": "PidTagLastModifierName"
        },
        {
            "area": "History Properties",
            "key": "10810003",
            "name": "PidTagLastVerbExecuted"
        },
        {
            "area": "History Properties",
            "key": "10820040",
            "name": "PidTagLastVerbExecutionTime"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "1043001F",
            "name": "PidTagListHelp"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "1044001F",
            "name": "PidTagListSubscribe"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "1045001F",
            "name": "PidTagListUnsubscribe"
        },
        {
            "area": "Server",
            "key": "67090040",
            "name": "PidTagLocalCommitTime"
        },
        {
            "area": "Server",
            "key": "670A0040",
            "name": "PidTagLocalCommitTimeMax"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "66A10003",
            "name": "PidTagLocaleId"
        },
        {
            "area": "Address Properties",
            "key": "3A27001F",
            "name": "PidTagLocality"
        },
        {
            "area": "Address Properties",
            "key": "3A0D001F",
            "name": "PidTagLocation"
        },
        {
            "area": "Message Store Properties",
            "key": "661B0102",
            "name": "PidTagMailboxOwnerEntryId"
        },
        {
            "area": "Message Store Properties",
            "key": "661C001F",
            "name": "PidTagMailboxOwnerName"
        },
        {
            "area": "Address Properties",
            "key": "3A4E001F",
            "name": "PidTagManagerName"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "0FF80102",
            "name": "PidTagMappingSignature"
        },
        {
            "area": "Message Store Properties",
            "key": "666D0003",
            "name": "PidTagMaximumSubmitMessageSize"
        },
        {
            "area": "Access Control Properties",
            "key": "66710014",
            "name": "PidTagMemberId"
        },
        {
            "area": "Access Control Properties",
            "key": "6672001F",
            "name": "PidTagMemberName"
        },
        {
            "area": "Access Control Properties",
            "key": "66730003",
            "name": "PidTagMemberRights"
        },
        {
            "area": "Message Attachment Properties",
            "key": "0E13000D",
            "name": "PidTagMessageAttachments"
        },
        {
            "area": "General Message Properties",
            "key": "0058000B",
            "name": "PidTagMessageCcMe"
        },
        {
            "area": "Common Property set",
            "key": "001A001F",
            "name": "PidTagMessageClass"
        },
        {
            "area": "Common",
            "key": "3FFD0003",
            "name": "PidTagMessageCodepage"
        },
        {
            "area": "Message Time Properties",
            "key": "0E060040",
            "name": "PidTagMessageDeliveryTime"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "59090003",
            "name": "PidTagMessageEditorFormat"
        },
        {
            "area": "General Message Properties",
            "key": "0E070003",
            "name": "PidTagMessageFlags"
        },
        {
            "area": "Address Properties",
            "key": "3A0F001F",
            "name": "PidTagMessageHandlingSystemCommonName"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "3FF10003",
            "name": "PidTagMessageLocaleId"
        },
        {
            "area": "General Message Properties",
            "key": "0059000B",
            "name": "PidTagMessageRecipientMe"
        },
        {
            "area": "Address Properties",
            "key": "0E12000D",
            "name": "PidTagMessageRecipients"
        },
        {
            "area": "General Message Properties",
            "key": "0E080003",
            "name": "PidTagMessageSize"
        },
        {
            "area": "General Message Properties",
            "key": "0E080014",
            "name": "PidTagMessageSizeExtended"
        },
        {
            "area": "General Message Properties",
            "key": "0E170003",
            "name": "PidTagMessageStatus"
        },
        {
            "area": "Email",
            "key": "00470102",
            "name": "PidTagMessageSubmissionId"
        },
        {
            "area": "General Message Properties",
            "key": "0057000B",
            "name": "PidTagMessageToMe"
        },
        {
            "area": "ID Properties",
            "key": "674A0014",
            "name": "PidTagMid"
        },
        {
            "area": "Address Properties",
            "key": "3A44001F",
            "name": "PidTagMiddleName"
        },
        {
            "area": "MIME properties",
            "key": "64F00102",
            "name": "PidTagMimeSkeleton"
        },
        {
            "area": "Address Properties",
            "key": "3A1C001F",
            "name": "PidTagMobileTelephoneNumber"
        },
        {
            "area": "BestBody",
            "key": "10160003",
            "name": "PidTagNativeBody"
        },
        {
            "area": "Outlook Application",
            "key": "0E29001F",
            "name": "PidTagNextSendAcct"
        },
        {
            "area": "Address Properties",
            "key": "3A4F001F",
            "name": "PidTagNickname"
        },
        {
            "area": "Email",
            "key": "0C050003",
            "name": "PidTagNonDeliveryReportDiagCode"
        },
        {
            "area": "Email",
            "key": "0C040003",
            "name": "PidTagNonDeliveryReportReasonCode"
        },
        {
            "area": "Email",
            "key": "0C200003",
            "name": "PidTagNonDeliveryReportStatusCode"
        },
        {
            "area": "Email",
            "key": "0E1D001F",
            "name": "PidTagNormalizedSubject"
        },
        {
            "area": "Common",
            "key": "0FFE0003",
            "name": "PidTagObjectType"
        },
        {
            "area": "Address Properties",
            "key": "3A19001F",
            "name": "PidTagOfficeLocation"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "6802001E",
            "name": "PidTagOfflineAddressBookContainerGuid"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "6804001E",
            "name": "PidTagOfflineAddressBookDistinguishedName"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "68030003",
            "name": "PidTagOfflineAddressBookMessageClass"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "6800001F",
            "name": "PidTagOfflineAddressBookName"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "68010003",
            "name": "PidTagOfflineAddressBookSequence"
        },
        {
            "area": "Offline Address Book Properties",
            "key": "68051003",
            "name": "PidTagOfflineAddressBookTruncatedProperties"
        },
        {
            "area": "Tasks",
            "key": "36E20003",
            "name": "PidTagOrdinalMost"
        },
        {
            "area": "Address Properties",
            "key": "3A10001F",
            "name": "PidTagOrganizationalIdNumber"
        },
        {
            "area": "Email",
            "key": "004C0102",
            "name": "PidTagOriginalAuthorEntryId"
        },
        {
            "area": "Email",
            "key": "004D001F",
            "name": "PidTagOriginalAuthorName"
        },
        {
            "area": "General Message Properties",
            "key": "00550040",
            "name": "PidTagOriginalDeliveryTime"
        },
        {
            "area": "General Message Properties",
            "key": "0072001F",
            "name": "PidTagOriginalDisplayBcc"
        },
        {
            "area": "General Message Properties",
            "key": "0073001F",
            "name": "PidTagOriginalDisplayCc"
        },
        {
            "area": "General Message Properties",
            "key": "0074001F",
            "name": "PidTagOriginalDisplayTo"
        },
        {
            "area": "General Message Properties",
            "key": "3A120102",
            "name": "PidTagOriginalEntryId"
        },
        {
            "area": "Secure Messaging Properties",
            "key": "004B001F",
            "name": "PidTagOriginalMessageClass"
        },
        {
            "area": "Mail",
            "key": "1046001F",
            "name": "PidTagOriginalMessageId"
        },
        {
            "area": "General Message Properties",
            "key": "0066001F",
            "name": "PidTagOriginalSenderAddressType"
        },
        {
            "area": "General Message Properties",
            "key": "0067001F",
            "name": "PidTagOriginalSenderEmailAddress"
        },
        {
            "area": "General Message Properties",
            "key": "005B0102",
            "name": "PidTagOriginalSenderEntryId"
        },
        {
            "area": "General Message Properties",
            "key": "005A001F",
            "name": "PidTagOriginalSenderName"
        },
        {
            "area": "General Message Properties",
            "key": "005C0102",
            "name": "PidTagOriginalSenderSearchKey"
        },
        {
            "area": "General Message Properties",
            "key": "002E0003",
            "name": "PidTagOriginalSensitivity"
        },
        {
            "area": "General Message Properties",
            "key": "0068001F",
            "name": "PidTagOriginalSentRepresentingAddressType"
        },
        {
            "area": "General Message Properties",
            "key": "0069001F",
            "name": "PidTagOriginalSentRepresentingEmailAddress"
        },
        {
            "area": "General Message Properties",
            "key": "005E0102",
            "name": "PidTagOriginalSentRepresentingEntryId"
        },
        {
            "area": "General Message Properties",
            "key": "005D001F",
            "name": "PidTagOriginalSentRepresentingName"
        },
        {
            "area": "General Message Properties",
            "key": "005F0102",
            "name": "PidTagOriginalSentRepresentingSearchKey"
        },
        {
            "area": "General Message Properties",
            "key": "0049001F",
            "name": "PidTagOriginalSubject"
        },
        {
            "area": "General Message Properties",
            "key": "004E0040",
            "name": "PidTagOriginalSubmitTime"
        },
        {
            "area": "MIME Properties",
            "key": "0023000B",
            "name": "PidTagOriginatorDeliveryReportRequested"
        },
        {
            "area": "MIME Properties",
            "key": "0C08000B",
            "name": "PidTagOriginatorNonDeliveryReportRequested"
        },
        {
            "area": "Contact Properties",
            "key": "7C24000B",
            "name": "PidTagOscSyncEnabled"
        },
        {
            "area": "Address Properties",
            "key": "3A5F001F",
            "name": "PidTagOtherAddressCity"
        },
        {
            "area": "Address Properties",
            "key": "3A60001F",
            "name": "PidTagOtherAddressCountry"
        },
        {
            "area": "Address Properties",
            "key": "3A61001F",
            "name": "PidTagOtherAddressPostalCode"
        },
        {
            "area": "Address Properties",
            "key": "3A64001F",
            "name": "PidTagOtherAddressPostOfficeBox"
        },
        {
            "area": "Address Properties",
            "key": "3A62001F",
            "name": "PidTagOtherAddressStateOrProvince"
        },
        {
            "area": "Address Properties",
            "key": "3A63001F",
            "name": "PidTagOtherAddressStreet"
        },
        {
            "area": "Address Properties",
            "key": "3A1F001F",
            "name": "PidTagOtherTelephoneNumber"
        },
        {
            "area": "Message Store Properties",
            "key": "661D000B",
            "name": "PidTagOutOfOfficeState"
        },
        {
            "area": "Appointment",
            "key": "00620003",
            "name": "PidTagOwnerAppointmentId"
        },
        {
            "area": "Address Properties",
            "key": "3A21001F",
            "name": "PidTagPagerTelephoneNumber"
        },
        {
            "area": "ID Properties",
            "key": "0E090102",
            "name": "PidTagParentEntryId"
        },
        {
            "area": "ID Properties",
            "key": "67490014",
            "name": "PidTagParentFolderId"
        },
        {
            "area": "MapiEnvelope",
            "key": "00250102",
            "name": "PidTagParentKey"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65E10102",
            "name": "PidTagParentSourceKey"
        },
        {
            "area": "MapiMailUser",
            "key": "3A50001F",
            "name": "PidTagPersonalHomePage"
        },
        {
            "area": "Archive",
            "key": "30190102",
            "name": "PidTagPolicyTag"
        },
        {
            "area": "MapiMailUser",
            "key": "3A15001F",
            "name": "PidTagPostalAddress"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2A001F",
            "name": "PidTagPostalCode"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2B001F",
            "name": "PidTagPostOfficeBox"
        },
        {
            "area": "Sync",
            "key": "65E30102",
            "name": "PidTagPredecessorChangeList"
        },
        {
            "area": "MapiMailUser",
            "key": "3A23001F",
            "name": "PidTagPrimaryFaxNumber"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E28001F",
            "name": "PidTagPrimarySendAccount"
        },
        {
            "area": "MapiMailUser",
            "key": "3A1A001F",
            "name": "PidTagPrimaryTelephoneNumber"
        },
        {
            "area": "Email",
            "key": "00260003",
            "name": "PidTagPriority"
        },
        {
            "area": "Calendar",
            "key": "7D01000B",
            "name": "PidTagProcessed"
        },
        {
            "area": "MapiMailUser",
            "key": "3A46001F",
            "name": "PidTagProfession"
        },
        {
            "area": "Exchange Administrative",
            "key": "666A0003",
            "name": "PidTagProhibitReceiveQuota"
        },
        {
            "area": "ExchangeAdministrative",
            "key": "666E0003",
            "name": "PidTagProhibitSendQuota"
        },
        {
            "area": "TransportEnvelope",
            "key": "4083001F",
            "name": "PidTagPurportedSenderDomain"
        },
        {
            "area": "MapiMailUser",
            "key": "3A1D001F",
            "name": "PidTagRadioTelephoneNumber"
        },
        {
            "area": "MapiNonTransmittable Property set",
            "key": "0E69000B",
            "name": "PidTagRead"
        },
        {
            "area": "Transport Envelope",
            "key": "4029001F",
            "name": "PidTagReadReceiptAddressType"
        },
        {
            "area": "Transport Envelope",
            "key": "402A001F",
            "name": "PidTagReadReceiptEmailAddress"
        },
        {
            "area": "MapiEnvelope",
            "key": "00460102",
            "name": "PidTagReadReceiptEntryId"
        },
        {
            "area": "Transport Envelope",
            "key": "402B001F",
            "name": "PidTagReadReceiptName"
        },
        {
            "area": "Email",
            "key": "0029000B",
            "name": "PidTagReadReceiptRequested"
        },
        {
            "area": "MapiEnvelope",
            "key": "00530102",
            "name": "PidTagReadReceiptSearchKey"
        },
        {
            "area": "Mail",
            "key": "5D05001F",
            "name": "PidTagReadReceiptSmtpAddress"
        },
        {
            "area": "Email",
            "key": "002A0040",
            "name": "PidTagReceiptTime"
        },
        {
            "area": "MapiEnvelope",
            "key": "0075001F",
            "name": "PidTagReceivedByAddressType"
        },
        {
            "area": "Address Properties",
            "key": "0076001F",
            "name": "PidTagReceivedByEmailAddress"
        },
        {
            "area": "Address Properties",
            "key": "003F0102",
            "name": "PidTagReceivedByEntryId"
        },
        {
            "area": "Address Properties",
            "key": "0040001F",
            "name": "PidTagReceivedByName"
        },
        {
            "area": "Address Properties",
            "key": "00510102",
            "name": "PidTagReceivedBySearchKey"
        },
        {
            "area": "Mail",
            "key": "5D07001F",
            "name": "PidTagReceivedBySmtpAddress"
        },
        {
            "area": "Address Properties",
            "key": "0077001F",
            "name": "PidTagReceivedRepresentingAddressType"
        },
        {
            "area": "Address Properties",
            "key": "0078001F",
            "name": "PidTagReceivedRepresentingEmailAddress"
        },
        {
            "area": "Address Properties",
            "key": "00430102",
            "name": "PidTagReceivedRepresentingEntryId"
        },
        {
            "area": "Address Properties",
            "key": "0044001F",
            "name": "PidTagReceivedRepresentingName"
        },
        {
            "area": "Address Properties",
            "key": "00520102",
            "name": "PidTagReceivedRepresentingSearchKey"
        },
        {
            "area": "Mail",
            "key": "5D08001F",
            "name": "PidTagReceivedRepresentingSmtpAddress"
        },
        {
            "area": "TransportRecipient",
            "key": "5FF6001F",
            "name": "PidTagRecipientDisplayName"
        },
        {
            "area": "ID Properties",
            "key": "5FF70102",
            "name": "PidTagRecipientEntryId"
        },
        {
            "area": "TransportRecipient",
            "key": "5FFD0003",
            "name": "PidTagRecipientFlags"
        },
        {
            "area": "TransportRecipient",
            "key": "5FDF0003",
            "name": "PidTagRecipientOrder"
        },
        {
            "area": "TransportRecipient",
            "key": "5FE1000B",
            "name": "PidTagRecipientProposed"
        },
        {
            "area": "TransportRecipient",
            "key": "5FE40040",
            "name": "PidTagRecipientProposedEndTime"
        },
        {
            "area": "TransportRecipient",
            "key": "5FE30040",
            "name": "PidTagRecipientProposedStartTime"
        },
        {
            "area": "MapiEnvelope",
            "key": "002B000B",
            "name": "PidTagRecipientReassignmentProhibited"
        },
        {
            "area": "TransportRecipient",
            "key": "5FFF0003",
            "name": "PidTagRecipientTrackStatus"
        },
        {
            "area": "TransportRecipient",
            "key": "5FFB0040",
            "name": "PidTagRecipientTrackStatusTime"
        },
        {
            "area": "MapiRecipient",
            "key": "0C150003",
            "name": "PidTagRecipientType"
        },
        {
            "area": "ID Properties",
            "key": "0FF90102",
            "name": "PidTagRecordKey"
        },
        {
            "area": "MapiMailUser",
            "key": "3A47001F",
            "name": "PidTagReferredByName"
        },
        {
            "area": "MapiContainer",
            "key": "36D50102",
            "name": "PidTagRemindersOnlineEntryId"
        },
        {
            "area": "Email",
            "key": "0C21001F",
            "name": "PidTagRemoteMessageTransferAgent"
        },
        {
            "area": "MapiAttachment",
            "key": "370B0003",
            "name": "PidTagRenderingPosition"
        },
        {
            "area": "MapiEnvelope",
            "key": "004F0102",
            "name": "PidTagReplyRecipientEntries"
        },
        {
            "area": "MapiEnvelope",
            "key": "0050001F",
            "name": "PidTagReplyRecipientNames"
        },
        {
            "area": "MapiRecipient",
            "key": "0C17000B",
            "name": "PidTagReplyRequested"
        },
        {
            "area": "Rules",
            "key": "65C20102",
            "name": "PidTagReplyTemplateId"
        },
        {
            "area": "MapiEnvelope",
            "key": "00300040",
            "name": "PidTagReplyTime"
        },
        {
            "area": "Email",
            "key": "0080001F",
            "name": "PidTagReportDisposition"
        },
        {
            "area": "Email",
            "key": "0081001F",
            "name": "PidTagReportDispositionMode"
        },
        {
            "area": "MapiEnvelope",
            "key": "00450102",
            "name": "PidTagReportEntryId"
        },
        {
            "area": "Email",
            "key": "6820001F",
            "name": "PidTagReportingMessageTransferAgent"
        },
        {
            "area": "MapiEnvelope",
            "key": "003A001F",
            "name": "PidTagReportName"
        },
        {
            "area": "MapiEnvelope",
            "key": "00540102",
            "name": "PidTagReportSearchKey"
        },
        {
            "area": "MapiEnvelope",
            "key": "00310102",
            "name": "PidTagReportTag"
        },
        {
            "area": "MapiMessage",
            "key": "1001001F",
            "name": "PidTagReportText"
        },
        {
            "area": "MapiEnvelope Property set",
            "key": "00320040",
            "name": "PidTagReportTime"
        },
        {
            "area": "MapiStatus",
            "key": "3FE70003",
            "name": "PidTagResolveMethod"
        },
        {
            "area": "MapiEnvelope Property set",
            "key": "0063000B",
            "name": "PidTagResponseRequested"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E0F000B",
            "name": "PidTagResponsibility"
        },
        {
            "area": "Archive",
            "key": "301C0040",
            "name": "PidTagRetentionDate"
        },
        {
            "area": "Archive",
            "key": "301D0003",
            "name": "PidTagRetentionFlags"
        },
        {
            "area": "Archive",
            "key": "301A0003",
            "name": "PidTagRetentionPeriod"
        },
        {
            "area": "ExchangeFolder",
            "key": "66390003",
            "name": "PidTagRights"
        },
        {
            "area": "Configuration",
            "key": "7C060003",
            "name": "PidTagRoamingDatatypes"
        },
        {
            "area": "Configuration",
            "key": "7C070102",
            "name": "PidTagRoamingDictionary"
        },
        {
            "area": "Configuration",
            "key": "7C080102",
            "name": "PidTagRoamingXmlStream"
        },
        {
            "area": "MapiCommon",
            "key": "30000003",
            "name": "PidTagRowid"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0FF50003",
            "name": "PidTagRowType"
        },
        {
            "area": "Email",
            "key": "10090102",
            "name": "PidTagRtfCompressed"
        },
        {
            "area": "Email",
            "key": "0E1F000B",
            "name": "PidTagRtfInSync"
        },
        {
            "area": "ExchangeMessageReadOnly",
            "key": "66500003",
            "name": "PidTagRuleActionNumber"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "668000FE",
            "name": "PidTagRuleActions"
        },
        {
            "area": "ExchangeMessageReadOnly",
            "key": "66490003",
            "name": "PidTagRuleActionType"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "667900FD",
            "name": "PidTagRuleCondition"
        },
        {
            "area": "ExchangeMessageReadOnly",
            "key": "66480003",
            "name": "PidTagRuleError"
        },
        {
            "area": "ExchangeMessageReadOnly",
            "key": "66510102",
            "name": "PidTagRuleFolderEntryId"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66740014",
            "name": "PidTagRuleId"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66750102",
            "name": "PidTagRuleIds"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66830003",
            "name": "PidTagRuleLevel"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65ED0003",
            "name": "PidTagRuleMessageLevel"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65EC001F",
            "name": "PidTagRuleMessageName"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65EB001F",
            "name": "PidTagRuleMessageProvider"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65EE0102",
            "name": "PidTagRuleMessageProviderData"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65F30003",
            "name": "PidTagRuleMessageSequence"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65E90003",
            "name": "PidTagRuleMessageState"
        },
        {
            "area": "ExchangeNonTransmittableReserved",
            "key": "65EA0003",
            "name": "PidTagRuleMessageUserFlags"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "6682001F",
            "name": "PidTagRuleName"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "6681001F",
            "name": "PidTagRuleProvider"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66840102",
            "name": "PidTagRuleProviderData"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66760003",
            "name": "PidTagRuleSequence"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66770003",
            "name": "PidTagRuleState"
        },
        {
            "area": "Server-Side Rules Properties",
            "key": "66780003",
            "name": "PidTagRuleUserFlags"
        },
        {
            "area": "Message Class Defined Transmittable",
            "key": "68020102",
            "name": "PidTagRwRulesStream"
        },
        {
            "area": "Free/Busy Properties",
            "key": "686A0102",
            "name": "PidTagScheduleInfoAppointmentTombstone"
        },
        {
            "area": "Free/Busy Properties",
            "key": "686D000B",
            "name": "PidTagScheduleInfoAutoAcceptAppointments"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68451102",
            "name": "PidTagScheduleInfoDelegateEntryIds"
        },
        {
            "area": "Free/Busy Properties",
            "key": "6844101F",
            "name": "PidTagScheduleInfoDelegateNames"
        },
        {
            "area": "Free/Busy Properties",
            "key": "684A101F",
            "name": "PidTagScheduleInfoDelegateNamesW"
        },
        {
            "area": "Free/Busy Properties",
            "key": "6842000B",
            "name": "PidTagScheduleInfoDelegatorWantsCopy"
        },
        {
            "area": "Free/Busy Properties",
            "key": "684B000B",
            "name": "PidTagScheduleInfoDelegatorWantsInfo"
        },
        {
            "area": "Free/Busy Properties",
            "key": "686F000B",
            "name": "PidTagScheduleInfoDisallowOverlappingAppts"
        },
        {
            "area": "Free/Busy Properties",
            "key": "686E000B",
            "name": "PidTagScheduleInfoDisallowRecurringAppts"
        },
        {
            "area": "Free/Busy Properties",
            "key": "6843000B",
            "name": "PidTagScheduleInfoDontMailDelegates"
        },
        {
            "area": "Free/Busy Properties",
            "key": "686C0102",
            "name": "PidTagScheduleInfoFreeBusy"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68561102",
            "name": "PidTagScheduleInfoFreeBusyAway"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68541102",
            "name": "PidTagScheduleInfoFreeBusyBusy"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68501102",
            "name": "PidTagScheduleInfoFreeBusyMerged"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68521102",
            "name": "PidTagScheduleInfoFreeBusyTentative"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68551003",
            "name": "PidTagScheduleInfoMonthsAway"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68531003",
            "name": "PidTagScheduleInfoMonthsBusy"
        },
        {
            "area": "Free/Busy Properties",
            "key": "684F1003",
            "name": "PidTagScheduleInfoMonthsMerged"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68511003",
            "name": "PidTagScheduleInfoMonthsTentative"
        },
        {
            "area": "Free/Busy Properties",
            "key": "68410003",
            "name": "PidTagScheduleInfoResourceType"
        },
        {
            "area": "ExchangeMessageStore",
            "key": "66220102",
            "name": "PidTagSchedulePlusFreeBusyEntryId"
        },
        {
            "area": "Address Book",
            "key": "00040102",
            "name": "PidTagScriptData"
        },
        {
            "area": "Search",
            "key": "68450102",
            "name": "PidTagSearchFolderDefinition"
        },
        {
            "area": "Search",
            "key": "68480003",
            "name": "PidTagSearchFolderEfpFlags"
        },
        {
            "area": "Search",
            "key": "683A0003",
            "name": "PidTagSearchFolderExpiration"
        },
        {
            "area": "Search",
            "key": "68420102",
            "name": "PidTagSearchFolderId"
        },
        {
            "area": "Search",
            "key": "68340003",
            "name": "PidTagSearchFolderLastUsed"
        },
        {
            "area": "Search",
            "key": "68440102",
            "name": "PidTagSearchFolderRecreateInfo"
        },
        {
            "area": "Search",
            "key": "68460003",
            "name": "PidTagSearchFolderStorageType"
        },
        {
            "area": "Search",
            "key": "68470003",
            "name": "PidTagSearchFolderTag"
        },
        {
            "area": "Search",
            "key": "68410003",
            "name": "PidTagSearchFolderTemplateId"
        },
        {
            "area": "ID Properties",
            "key": "300B0102",
            "name": "PidTagSearchKey"
        },
        {
            "area": "Access Control Properties",
            "key": "0E6A001F",
            "name": "PidTagSecurityDescriptorAsXml"
        },
        {
            "area": "AB Container",
            "key": "3609000B",
            "name": "PidTagSelectable"
        },
        {
            "area": "Address Properties",
            "key": "0C1E001F",
            "name": "PidTagSenderAddressType"
        },
        {
            "area": "Address Properties",
            "key": "0C1F001F",
            "name": "PidTagSenderEmailAddress"
        },
        {
            "area": "Address Properties",
            "key": "0C190102",
            "name": "PidTagSenderEntryId"
        },
        {
            "area": "Secure Messaging Properties",
            "key": "40790003",
            "name": "PidTagSenderIdStatus"
        },
        {
            "area": "Address Properties",
            "key": "0C1A001F",
            "name": "PidTagSenderName"
        },
        {
            "area": "Address Properties",
            "key": "0C1D0102",
            "name": "PidTagSenderSearchKey"
        },
        {
            "area": "Mail",
            "key": "5D01001F",
            "name": "PidTagSenderSmtpAddress"
        },
        {
            "area": "Unified Messaging",
            "key": "6802001F",
            "name": "PidTagSenderTelephoneNumber"
        },
        {
            "area": "Address Properties",
            "key": "3A710003",
            "name": "PidTagSendInternetEncoding"
        },
        {
            "area": "Address Properties",
            "key": "3A40000B",
            "name": "PidTagSendRichInfo"
        },
        {
            "area": "General Message Properties",
            "key": "00360003",
            "name": "PidTagSensitivity"
        },
        {
            "area": "ProviderDefinedNonTransmittable",
            "key": "674000FB",
            "name": "PidTagSentMailSvrEID"
        },
        {
            "area": "Address Properties",
            "key": "0064001F",
            "name": "PidTagSentRepresentingAddressType"
        },
        {
            "area": "Address Properties",
            "key": "0065001F",
            "name": "PidTagSentRepresentingEmailAddress"
        },
        {
            "area": "Address Properties",
            "key": "00410102",
            "name": "PidTagSentRepresentingEntryId"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "401A0003",
            "name": "PidTagSentRepresentingFlags"
        },
        {
            "area": "Address Properties",
            "key": "0042001F",
            "name": "PidTagSentRepresentingName"
        },
        {
            "area": "Address Properties",
            "key": "003B0102",
            "name": "PidTagSentRepresentingSearchKey"
        },
        {
            "area": "Mail",
            "key": "5D02001F",
            "name": "PidTagSentRepresentingSmtpAddress"
        },
        {
            "area": "Logon Properties",
            "key": "66380102",
            "name": "PidTagSerializedReplidGuidMap"
        },
        {
            "area": "Address Properties",
            "key": "39FE001F",
            "name": "PidTagSmtpAddress"
        },
        {
            "area": "ExchangeAdministrative",
            "key": "67050003",
            "name": "PidTagSortLocaleId"
        },
        {
            "area": "Sync",
            "key": "65E00102",
            "name": "PidTagSourceKey"
        },
        {
            "area": "Address Book",
            "key": "8CC20102",
            "name": "PidTagSpokenName"
        },
        {
            "area": "MapiMailUser",
            "key": "3A48001F",
            "name": "PidTagSpouseName"
        },
        {
            "area": "MapiEnvelope",
            "key": "00600040",
            "name": "PidTagStartDate"
        },
        {
            "area": "Archive",
            "key": "301B0102",
            "name": "PidTagStartDateEtc"
        },
        {
            "area": "MapiMailUser",
            "key": "3A28001F",
            "name": "PidTagStateOrProvince"
        },
        {
            "area": "ID Properties",
            "key": "0FFB0102",
            "name": "PidTagStoreEntryId"
        },
        {
            "area": "MapiMessageStore",
            "key": "340E0003",
            "name": "PidTagStoreState"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "340D0003",
            "name": "PidTagStoreSupportMask"
        },
        {
            "area": "MapiMailUser",
            "key": "3A29001F",
            "name": "PidTagStreetAddress"
        },
        {
            "area": "MapiContainer",
            "key": "360A000B",
            "name": "PidTagSubfolders"
        },
        {
            "area": "General Message Properties",
            "key": "0037001F",
            "name": "PidTagSubject"
        },
        {
            "area": "General Message Properties",
            "key": "003D001F",
            "name": "PidTagSubjectPrefix"
        },
        {
            "area": "Email",
            "key": "0C1B001F",
            "name": "PidTagSupplementaryInfo"
        },
        {
            "area": "MapiMailUser",
            "key": "3A11001F",
            "name": "PidTagSurname"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E2D0102",
            "name": "PidTagSwappedToDoData"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E2C0102",
            "name": "PidTagSwappedToDoStore"
        },
        {
            "area": "ID Properties",
            "key": "30100102",
            "name": "PidTagTargetEntryId"
        },
        {
            "area": "MapiMailUser",
            "key": "3A4B001F",
            "name": "PidTagTelecommunicationsDeviceForDeafTelephoneNumber"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2C001F",
            "name": "PidTagTelexNumber"
        },
        {
            "area": "MapiMailUser",
            "key": "3A2C1102",
            "name": "PidTagTelexNumber"
        },
        {
            "area": "Address Book",
            "key": "00010102",
            "name": "PidTagTemplateData"
        },
        {
            "area": "MapiAddressBook",
            "key": "39020102",
            "name": "PidTagTemplateid"
        },
        {
            "area": "Message Attachment Properties",
            "key": "371B001F",
            "name": "PidTagTextAttachmentCharset"
        },
        {
            "area": "Address Book",
            "key": "8C9E0102",
            "name": "PidTagThumbnailPhoto"
        },
        {
            "area": "MapiMailUser",
            "key": "3A17001F",
            "name": "PidTagTitle"
        },
        {
            "area": "MapiEnvelope",
            "key": "007F0102",
            "name": "PidTagTnefCorrelationKey"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E2B0003",
            "name": "PidTagToDoItemFlags"
        },
        {
            "area": "Address Properties",
            "key": "3A20001F",
            "name": "PidTagTransmittableDisplayName"
        },
        {
            "area": "Email",
            "key": "007D001F",
            "name": "PidTagTransportMessageHeaders"
        },
        {
            "area": "MapiNonTransmittable",
            "key": "0E790003",
            "name": "PidTagTrustSender"
        },
        {
            "area": "MapiMailUser",
            "key": "3A220102",
            "name": "PidTagUserCertificate"
        },
        {
            "area": "ExchangeMessageStore",
            "key": "66190102",
            "name": "PidTagUserEntryId"
        },
        {
            "area": "MapiMailUser",
            "key": "3A701102",
            "name": "PidTagUserX509Certificate"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "70010102",
            "name": "PidTagViewDescriptorBinary"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "7006001F",
            "name": "PidTagViewDescriptorName"
        },
        {
            "area": "MessageClassDefinedTransmittable",
            "key": "7002001F",
            "name": "PidTagViewDescriptorStrings"
        },
        {
            "area": "Miscellaneous Properties",
            "key": "70070003",
            "name": "PidTagViewDescriptorVersion"
        },
        {
            "area": "Unified Messaging",
            "key": "6805001F",
            "name": "PidTagVoiceMessageAttachmentOrder"
        },
        {
            "area": "Unified Messaging",
            "key": "68010003",
            "name": "PidTagVoiceMessageDuration"
        },
        {
            "area": "Unified Messaging",
            "key": "6803001F",
            "name": "PidTagVoiceMessageSenderName"
        },
        {
            "area": "MapiMailUser",
            "key": "3A410040",
            "name": "PidTagWeddingAnniversary"
        },
        {
            "area": "Configuration",
            "key": "68540102",
            "name": "PidTagWlinkAddressBookEID"
        },
        {
            "area": "Configuration",
            "key": "68910102",
            "name": "PidTagWlinkAddressBookStoreEID"
        },
        {
            "area": "Configuration",
            "key": "68530003",
            "name": "PidTagWlinkCalendarColor"
        },
        {
            "area": "Configuration",
            "key": "68900102",
            "name": "PidTagWlinkClientID"
        },
        {
            "area": "Configuration",
            "key": "684C0102",
            "name": "PidTagWlinkEntryId"
        },
        {
            "area": "Configuration",
            "key": "684A0003",
            "name": "PidTagWlinkFlags"
        },
        {
            "area": "Configuration",
            "key": "684F0102",
            "name": "PidTagWlinkFolderType"
        },
        {
            "area": "Configuration",
            "key": "68500102",
            "name": "PidTagWlinkGroupClsid"
        },
        {
            "area": "Configuration",
            "key": "68420102",
            "name": "PidTagWlinkGroupHeaderID"
        },
        {
            "area": "Configuration",
            "key": "6851001F",
            "name": "PidTagWlinkGroupName"
        },
        {
            "area": "Configuration",
            "key": "684B0102",
            "name": "PidTagWlinkOrdinal"
        },
        {
            "area": "Configuration",
            "key": "684D0102",
            "name": "PidTagWlinkRecordKey"
        },
        {
            "area": "Configuration",
            "key": "68920003",
            "name": "PidTagWlinkROGroupType"
        },
        {
            "area": "Configuration",
            "key": "68470003",
            "name": "PidTagWlinkSaveStamp"
        },
        {
            "area": "Configuration",
            "key": "68520003",
            "name": "PidTagWlinkSection"
        },
        {
            "area": "Configuration",
            "key": "684E0102",
            "name": "PidTagWlinkStoreEntryId"
        },
        {
            "area": "Configuration",
            "key": "68490003",
            "name": "PidTagWlinkType"
        }
    ];
}

/**
 * Obtain a copy of a table for mapping from property type value to property type name.
 * 
 * e.g.
 * 
 * - `typeNames[0x0003]` returns `"PtypInteger32"`.
 * - `typeNames[0x001E]` returns `"PtypString8"`.
 * - `typeNames[0x001F]` returns `"PtypString"`.
 * - `typeNames[0x0102]` returns `"PtypBinary"`.
 * 
 * @see [[MS-OXCDATA]: Property Data Types | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcdata/0c77892e-288e-435a-9c49-be1c20c7afdb)
 */
export function getTypeNames(): { [key: number]: string } {
    return {
        0x0002: 'PtypInteger16',
        0x0003: 'PtypInteger32',
        0x0004: 'PtypFloating32',
        0x0005: 'PtypFloating64',
        0x0006: 'PtypCurrency',
        0x0007: 'PtypFloatingTime',
        0x000A: 'PtypErrorCode',
        0x000B: 'PtypBoolean',
        0x0014: 'PtypInteger64',
        0x001F: 'PtypString',
        0x001E: 'PtypString8',
        0x0040: 'PtypTime',
        0x0048: 'PtypGuid',
        0x00FB: 'PtypServerId',
        0x00FD: 'PtypRestriction',
        0x00FE: 'PtypRuleAction',
        0x0102: 'PtypBinary',
        0x1002: 'PtypMultipleInteger16',
        0x1003: 'PtypMultipleInteger32',
        0x1004: 'PtypMultipleFloating32',
        0x1005: 'PtypMultipleFloating64',
        0x1006: 'PtypMultipleCurrency',
        0x1007: 'PtypMultipleFloatingTime',
        0x1014: 'PtypMultipleInteger64',
        0x101F: 'PtypMultipleString',
        0x101E: 'PtypMultipleString8',
        0x1040: 'PtypMultipleTime',
        0x1048: 'PtypMultipleGuid',
        0x1102: 'PtypMultipleBinary',
        0x0000: 'PtypUnspecified',
        0x0001: 'PtypNull',
        0x000D: 'PtypObject',
    };
}

/**
 * Obtain a copy of a table to convert from [LCID](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/70feba9f-294e-491e-b6eb-56532684c37f)
 * to [ANSICodePage](https://docs.microsoft.com/en-us/dotnet/api/system.globalization.textinfo.ansicodepage?view=net-5.0) list.
 * 
 * e.g.
 * 
 * - `lcidToAnsiCodePages[0x0409]` will return `[1252]` (en-US)
 * - `lcidToAnsiCodePages[0x0411]` will return `[932]` (ja-JP)
 */
export function getLcidToAnsiCodePages(): { [key: number]: Array<number> } {
    return {
        1: [1256], // LCID 0x0001: (ar)
        2: [1251], // LCID 0x0002: (bg)
        3: [1252], // LCID 0x0003: (ca)
        4: [936], // LCID 0x0004: (zh-Hans, zh-Hans)
        5: [1250], // LCID 0x0005: (cs)
        6: [1252], // LCID 0x0006: (da)
        7: [1252], // LCID 0x0007: (de)
        8: [1253], // LCID 0x0008: (el)
        9: [1252], // LCID 0x0009: (en)
        10: [1252], // LCID 0x000a: (es)
        11: [1252], // LCID 0x000b: (fi)
        12: [1252], // LCID 0x000c: (fr)
        13: [1255], // LCID 0x000d: (he)
        14: [1250], // LCID 0x000e: (hu)
        15: [1252], // LCID 0x000f: (is)
        16: [1252], // LCID 0x0010: (it)
        17: [932], // LCID 0x0011: (ja)
        18: [949], // LCID 0x0012: (ko)
        19: [1252], // LCID 0x0013: (nl)
        20: [1252], // LCID 0x0014: (no)
        21: [1250], // LCID 0x0015: (pl)
        22: [1252], // LCID 0x0016: (pt)
        23: [1252], // LCID 0x0017: (rm)
        24: [1250], // LCID 0x0018: (ro)
        25: [1251], // LCID 0x0019: (ru)
        26: [1250], // LCID 0x001a: (hr)
        27: [1250], // LCID 0x001b: (sk)
        28: [1250], // LCID 0x001c: (sq)
        29: [1252], // LCID 0x001d: (sv)
        30: [874], // LCID 0x001e: (th)
        31: [1254], // LCID 0x001f: (tr)
        32: [1256], // LCID 0x0020: (ur)
        33: [1252], // LCID 0x0021: (id)
        34: [1251], // LCID 0x0022: (uk)
        35: [1251], // LCID 0x0023: (be)
        36: [1250], // LCID 0x0024: (sl)
        37: [1257], // LCID 0x0025: (et)
        38: [1257], // LCID 0x0026: (lv)
        39: [1257], // LCID 0x0027: (lt)
        40: [1251], // LCID 0x0028: (tg)
        41: [1256], // LCID 0x0029: (fa)
        42: [1258], // LCID 0x002a: (vi)
        44: [1254], // LCID 0x002c: (az)
        45: [1252], // LCID 0x002d: (eu)
        46: [1252], // LCID 0x002e: (hsb)
        47: [1251], // LCID 0x002f: (mk)
        50: [1252], // LCID 0x0032: (tn)
        52: [1252], // LCID 0x0034: (xh)
        53: [1252], // LCID 0x0035: (zu)
        54: [1252], // LCID 0x0036: (af)
        56: [1252], // LCID 0x0038: (fo)
        59: [1252], // LCID 0x003b: (se)
        60: [1252], // LCID 0x003c: (ga)
        62: [1252], // LCID 0x003e: (ms)
        64: [1251], // LCID 0x0040: (ky)
        65: [1252], // LCID 0x0041: (sw)
        66: [1250], // LCID 0x0042: (tk)
        67: [1254], // LCID 0x0043: (uz)
        68: [1251], // LCID 0x0044: (tt)
        80: [1251], // LCID 0x0050: (mn)
        82: [1252], // LCID 0x0052: (cy)
        86: [1252], // LCID 0x0056: (gl)
        89: [1256], // LCID 0x0059: (sd)
        93: [1252], // LCID 0x005d: (iu)
        95: [1252], // LCID 0x005f: (tzm)
        98: [1252], // LCID 0x0062: (fy)
        100: [1252], // LCID 0x0064: (fil)
        102: [1252], // LCID 0x0066: (bin)
        103: [1252], // LCID 0x0067: (ff)
        104: [1252], // LCID 0x0068: (ha)
        105: [1252], // LCID 0x0069: (ibb)
        106: [1252], // LCID 0x006a: (yo)
        107: [1252], // LCID 0x006b: (quz)
        108: [1252], // LCID 0x006c: (nso)
        109: [1251], // LCID 0x006d: (ba)
        110: [1252], // LCID 0x006e: (lb)
        111: [1252], // LCID 0x006f: (kl)
        112: [1252], // LCID 0x0070: (ig)
        113: [1252], // LCID 0x0071: (kr)
        116: [1252], // LCID 0x0074: (gn)
        117: [1252], // LCID 0x0075: (haw)
        118: [1252], // LCID 0x0076: (la)
        121: [1252], // LCID 0x0079: (pap)
        122: [1252], // LCID 0x007a: (arn)
        124: [1252], // LCID 0x007c: (moh)
        126: [1252], // LCID 0x007e: (br)
        127: [1252], // LCID 0x007f: ()
        128: [1256], // LCID 0x0080: (ug)
        130: [1252], // LCID 0x0082: (oc)
        131: [1252], // LCID 0x0083: (co)
        132: [1252], // LCID 0x0084: (gsw)
        133: [1251], // LCID 0x0085: (sah)
        134: [1252], // LCID 0x0086: (quc)
        135: [1252], // LCID 0x0087: (rw)
        136: [1252], // LCID 0x0088: (wo)
        140: [1256], // LCID 0x008c: (prs)
        145: [1252], // LCID 0x0091: (gd)
        146: [1256], // LCID 0x0092: (ku)
        1025: [1256], // LCID 0x0401: (ar-SA)
        1026: [1251], // LCID 0x0402: (bg-BG)
        1027: [1252], // LCID 0x0403: (ca-ES)
        1028: [950], // LCID 0x0404: (zh-TW)
        1029: [1250], // LCID 0x0405: (cs-CZ)
        1030: [1252], // LCID 0x0406: (da-DK)
        1031: [1252], // LCID 0x0407: (de-DE)
        1032: [1253], // LCID 0x0408: (el-GR)
        1033: [1252], // LCID 0x0409: (en-US)
        1035: [1252], // LCID 0x040b: (fi-FI)
        1036: [1252], // LCID 0x040c: (fr-FR)
        1037: [1255], // LCID 0x040d: (he-IL)
        1038: [1250], // LCID 0x040e: (hu-HU)
        1039: [1252], // LCID 0x040f: (is-IS)
        1040: [1252], // LCID 0x0410: (it-IT)
        1041: [932], // LCID 0x0411: (ja-JP)
        1042: [949], // LCID 0x0412: (ko-KR)
        1043: [1252], // LCID 0x0413: (nl-NL)
        1044: [1252], // LCID 0x0414: (nb-NO)
        1045: [1250], // LCID 0x0415: (pl-PL)
        1046: [1252], // LCID 0x0416: (pt-BR)
        1047: [1252], // LCID 0x0417: (rm-CH)
        1048: [1250], // LCID 0x0418: (ro-RO)
        1049: [1251], // LCID 0x0419: (ru-RU)
        1050: [1250], // LCID 0x041a: (hr-HR)
        1051: [1250], // LCID 0x041b: (sk-SK)
        1052: [1250], // LCID 0x041c: (sq-AL)
        1053: [1252], // LCID 0x041d: (sv-SE)
        1054: [874], // LCID 0x041e: (th-TH)
        1055: [1254], // LCID 0x041f: (tr-TR)
        1056: [1256], // LCID 0x0420: (ur-PK)
        1057: [1252], // LCID 0x0421: (id-ID)
        1058: [1251], // LCID 0x0422: (uk-UA)
        1059: [1251], // LCID 0x0423: (be-BY)
        1060: [1250], // LCID 0x0424: (sl-SI)
        1061: [1257], // LCID 0x0425: (et-EE)
        1062: [1257], // LCID 0x0426: (lv-LV)
        1063: [1257], // LCID 0x0427: (lt-LT)
        1064: [1251], // LCID 0x0428: (tg-Cyrl-TJ)
        1065: [1256], // LCID 0x0429: (fa-IR)
        1066: [1258], // LCID 0x042a: (vi-VN)
        1068: [1254], // LCID 0x042c: (az-Latn-AZ)
        1069: [1252], // LCID 0x042d: (eu-ES)
        1070: [1252], // LCID 0x042e: (hsb-DE)
        1071: [1251], // LCID 0x042f: (mk-MK)
        1074: [1252], // LCID 0x0432: (tn-ZA)
        1076: [1252], // LCID 0x0434: (xh-ZA)
        1077: [1252], // LCID 0x0435: (zu-ZA)
        1078: [1252], // LCID 0x0436: (af-ZA)
        1080: [1252], // LCID 0x0438: (fo-FO)
        1083: [1252], // LCID 0x043b: (se-NO)
        1086: [1252], // LCID 0x043e: (ms-MY)
        1088: [1251], // LCID 0x0440: (ky-KG)
        1089: [1252], // LCID 0x0441: (sw-KE)
        1090: [1250], // LCID 0x0442: (tk-TM)
        1091: [1254], // LCID 0x0443: (uz-Latn-UZ)
        1092: [1251], // LCID 0x0444: (tt-RU)
        1104: [1251], // LCID 0x0450: (mn-MN)
        1106: [1252], // LCID 0x0452: (cy-GB)
        1110: [1252], // LCID 0x0456: (gl-ES)
        1119: [1256], // LCID 0x045f: (tzm-Arab-MA)
        1122: [1252], // LCID 0x0462: (fy-NL)
        1124: [1252], // LCID 0x0464: (fil-PH)
        1126: [1252], // LCID 0x0466: (bin-NG)
        1127: [1252], // LCID 0x0467: (ff-Latn-NG)
        1128: [1252], // LCID 0x0468: (ha-Latn-NG)
        1129: [1252], // LCID 0x0469: (ibb-NG)
        1130: [1252], // LCID 0x046a: (yo-NG)
        1131: [1252], // LCID 0x046b: (quz-BO)
        1132: [1252], // LCID 0x046c: (nso-ZA)
        1133: [1251], // LCID 0x046d: (ba-RU)
        1134: [1252], // LCID 0x046e: (lb-LU)
        1135: [1252], // LCID 0x046f: (kl-GL)
        1136: [1252], // LCID 0x0470: (ig-NG)
        1137: [1252], // LCID 0x0471: (kr-Latn-NG)
        1140: [1252], // LCID 0x0474: (gn-PY)
        1141: [1252], // LCID 0x0475: (haw-US)
        1142: [1252], // LCID 0x0476: (la-001)
        1145: [1252], // LCID 0x0479: (pap-029)
        1146: [1252], // LCID 0x047a: (arn-CL)
        1148: [1252], // LCID 0x047c: (moh-CA)
        1150: [1252], // LCID 0x047e: (br-FR)
        1152: [1256], // LCID 0x0480: (ug-CN)
        1154: [1252], // LCID 0x0482: (oc-FR)
        1155: [1252], // LCID 0x0483: (co-FR)
        1156: [1252], // LCID 0x0484: (gsw-FR)
        1157: [1251], // LCID 0x0485: (sah-RU)
        1158: [1252], // LCID 0x0486: (quc-Latn-GT)
        1159: [1252], // LCID 0x0487: (rw-RW)
        1160: [1252], // LCID 0x0488: (wo-SN)
        1164: [1256], // LCID 0x048c: (prs-AF)
        1169: [1252], // LCID 0x0491: (gd-GB)
        1170: [1256], // LCID 0x0492: (ku-Arab-IQ)
        2049: [1256], // LCID 0x0801: (ar-IQ)
        2051: [1252], // LCID 0x0803: (ca-ES-valencia)
        2052: [936], // LCID 0x0804: (zh-CN)
        2055: [1252], // LCID 0x0807: (de-CH)
        2057: [1252], // LCID 0x0809: (en-GB)
        2058: [1252], // LCID 0x080a: (es-MX)
        2060: [1252], // LCID 0x080c: (fr-BE)
        2064: [1252], // LCID 0x0810: (it-CH)
        2067: [1252], // LCID 0x0813: (nl-BE)
        2068: [1252], // LCID 0x0814: (nn-NO)
        2070: [1252], // LCID 0x0816: (pt-PT)
        2072: [1250], // LCID 0x0818: (ro-MD)
        2073: [1251], // LCID 0x0819: (ru-MD)
        2077: [1252], // LCID 0x081d: (sv-FI)
        2080: [1256], // LCID 0x0820: (ur-IN)
        2092: [1251], // LCID 0x082c: (az-Cyrl-AZ)
        2094: [1252], // LCID 0x082e: (dsb-DE)
        2098: [1252], // LCID 0x0832: (tn-BW)
        2107: [1252], // LCID 0x083b: (se-SE)
        2108: [1252], // LCID 0x083c: (ga-IE)
        2110: [1252], // LCID 0x083e: (ms-BN)
        2115: [1251], // LCID 0x0843: (uz-Cyrl-UZ)
        2118: [1256], // LCID 0x0846: (pa-Arab-PK)
        2137: [1256], // LCID 0x0859: (sd-Arab-PK)
        2141: [1252], // LCID 0x085d: (iu-Latn-CA)
        2143: [1252], // LCID 0x085f: (tzm-Latn-DZ)
        2151: [1252], // LCID 0x0867: (ff-Latn-SN)
        2155: [1252], // LCID 0x086b: (quz-EC)
        3073: [1256], // LCID 0x0c01: (ar-EG)
        3076: [950], // LCID 0x0c04: (zh-HK)
        3079: [1252], // LCID 0x0c07: (de-AT)
        3081: [1252], // LCID 0x0c09: (en-AU)
        3082: [1252], // LCID 0x0c0a: (es-ES)
        3084: [1252], // LCID 0x0c0c: (fr-CA)
        3131: [1252], // LCID 0x0c3b: (se-FI)
        3179: [1252], // LCID 0x0c6b: (quz-PE)
        4096: [1252, 1256, 1251, 1250, 936, 1253, 1254], // LCID 0x1000: (af-NA, ca-AD, ca-FR, ca-IT, da-GL, de-BE, en-001, en-AG, en-AI, en-AS, en-BB, en-BE, en-BM, en-BS, en-BW, en-CC, en-CK, en-CM, en-CX, en-DM, en-ER, en-FJ, en-FK, en-FM, en-GD, en-GG, en-GH, en-GI, en-GM, en-GU, en-GY, en-IM, en-IO, en-JE, en-KE, en-KI, en-KN, en-KY, en-LC, en-LR, en-LS, en-MG, en-MH, en-MO, en-MP, en-MS, en-MT, en-MU, en-MW, en-NA, en-NF, en-NG, en-NR, en-NU, en-PG, en-PK, en-PN, en-PR, en-PW, en-RW, en-SB, en-SC, en-SD, en-SH, en-SL, en-SS, en-SX, en-SZ, en-TC, en-TK, en-TO, en-TV, en-TZ, en-UG, en-UM, en-VC, en-VG, en-VI, en-VU, en-WS, en-ZM, es-GQ, es-PH, ff-Latn-CM, ff-Latn-GN, ff-Latn-MR, fr-BF, fr-BI, fr-BJ, fr-BL, fr-CF, fr-CG, fr-DJ, fr-DZ, fr-GA, fr-GF, fr-GN, fr-GP, fr-GQ, fr-KM, fr-MF, fr-MG, fr-MQ, fr-MR, fr-MU, fr-NC, fr-NE, fr-PF, fr-PM, fr-RW, fr-SC, fr-SY, fr-TD, fr-TG, fr-TN, fr-VU, fr-WF, fr-YT, gsw-CH, gsw-LI, ha-Latn-GH, ha-Latn-NE, it-SM, jv, jv-Java, jv-Java-ID, jv-Latn, jv-Latn-ID, kr-Latn, ms-SG, nb-SJ, nl-AW, nl-BQ, nl-CW, nl-SR, nl-SX, pt-AO, pt-CV, pt-GW, pt-MO, pt-MZ, pt-ST, pt-TL, sv-AX, sw-CD, sw-TZ, sw-UG, yo-BJ),(ar-001, ar-DJ, ar-ER, ar-IL, ar-KM, ar-MR, ar-PS, ar-SD, ar-SO, ar-SS, ar-TD, tzm-Arab),(ru-BY, ru-KG, ru-KZ, ru-UA, sr-Cyrl-XK),(sq-MK, sq-XK, sr-Latn-XK),(zh-Hans-HK, zh-Hans-MO),(el-CY),(tr-CY)
        4097: [1256], // LCID 0x1001: (ar-LY)
        4100: [936], // LCID 0x1004: (zh-SG)
        4103: [1252], // LCID 0x1007: (de-LU)
        4105: [1252], // LCID 0x1009: (en-CA)
        4106: [1252], // LCID 0x100a: (es-GT)
        4108: [1252], // LCID 0x100c: (fr-CH)
        4122: [1250], // LCID 0x101a: (hr-BA)
        4155: [1252], // LCID 0x103b: (smj-NO)
        5121: [1256], // LCID 0x1401: (ar-DZ)
        5124: [950], // LCID 0x1404: (zh-MO)
        5127: [1252], // LCID 0x1407: (de-LI)
        5129: [1252], // LCID 0x1409: (en-NZ)
        5130: [1252], // LCID 0x140a: (es-CR)
        5132: [1252], // LCID 0x140c: (fr-LU)
        5146: [1250], // LCID 0x141a: (bs-Latn-BA)
        5179: [1252], // LCID 0x143b: (smj-SE)
        6145: [1256], // LCID 0x1801: (ar-MA)
        6153: [1252], // LCID 0x1809: (en-IE)
        6154: [1252], // LCID 0x180a: (es-PA)
        6156: [1252], // LCID 0x180c: (fr-MC)
        6170: [1250], // LCID 0x181a: (sr-Latn-BA)
        6203: [1252], // LCID 0x183b: (sma-NO)
        7169: [1256], // LCID 0x1c01: (ar-TN)
        7177: [1252], // LCID 0x1c09: (en-ZA)
        7178: [1252], // LCID 0x1c0a: (es-DO)
        7180: [1252], // LCID 0x1c0c: (fr-029)
        7194: [1251], // LCID 0x1c1a: (sr-Cyrl-BA)
        7227: [1252], // LCID 0x1c3b: (sma-SE)
        8193: [1256], // LCID 0x2001: (ar-OM)
        8201: [1252], // LCID 0x2009: (en-JM)
        8202: [1252], // LCID 0x200a: (es-VE)
        8204: [1252], // LCID 0x200c: (fr-RE)
        8218: [1251], // LCID 0x201a: (bs-Cyrl-BA)
        8251: [1252], // LCID 0x203b: (sms-FI)
        9217: [1256], // LCID 0x2401: (ar-YE)
        9225: [1252], // LCID 0x2409: (en-029)
        9226: [1252], // LCID 0x240a: (es-CO)
        9228: [1252], // LCID 0x240c: (fr-CD)
        9242: [1250], // LCID 0x241a: (sr-Latn-RS)
        9275: [1252], // LCID 0x243b: (smn-FI)
        10241: [1256], // LCID 0x2801: (ar-SY)
        10249: [1252], // LCID 0x2809: (en-BZ)
        10250: [1252], // LCID 0x280a: (es-PE)
        10252: [1252], // LCID 0x280c: (fr-SN)
        10266: [1251], // LCID 0x281a: (sr-Cyrl-RS)
        11265: [1256], // LCID 0x2c01: (ar-JO)
        11273: [1252], // LCID 0x2c09: (en-TT)
        11274: [1252], // LCID 0x2c0a: (es-AR)
        11276: [1252], // LCID 0x2c0c: (fr-CM)
        11290: [1250], // LCID 0x2c1a: (sr-Latn-ME)
        12289: [1256], // LCID 0x3001: (ar-LB)
        12297: [1252], // LCID 0x3009: (en-ZW)
        12298: [1252], // LCID 0x300a: (es-EC)
        12300: [1252], // LCID 0x300c: (fr-CI)
        12314: [1251], // LCID 0x301a: (sr-Cyrl-ME)
        13313: [1256], // LCID 0x3401: (ar-KW)
        13321: [1252], // LCID 0x3409: (en-PH)
        13322: [1252], // LCID 0x340a: (es-CL)
        13324: [1252], // LCID 0x340c: (fr-ML)
        14337: [1256], // LCID 0x3801: (ar-AE)
        14345: [1252], // LCID 0x3809: (en-ID)
        14346: [1252], // LCID 0x380a: (es-UY)
        14348: [1252], // LCID 0x380c: (fr-MA)
        15361: [1256], // LCID 0x3c01: (ar-BH)
        15369: [1252], // LCID 0x3c09: (en-HK)
        15370: [1252], // LCID 0x3c0a: (es-PY)
        15372: [1252], // LCID 0x3c0c: (fr-HT)
        16385: [1256], // LCID 0x4001: (ar-QA)
        16393: [1252], // LCID 0x4009: (en-IN)
        16394: [1252], // LCID 0x400a: (es-BO)
        17417: [1252], // LCID 0x4409: (en-MY)
        17418: [1252], // LCID 0x440a: (es-SV)
        18441: [1252], // LCID 0x4809: (en-SG)
        18442: [1252], // LCID 0x480a: (es-HN)
        19466: [1252], // LCID 0x4c0a: (es-NI)
        20490: [1252], // LCID 0x500a: (es-PR)
        21514: [1252], // LCID 0x540a: (es-US)
        22538: [1252], // LCID 0x580a: (es-419)
        23562: [1252], // LCID 0x5c0a: (es-CU)
        25626: [1251], // LCID 0x641a: (bs-Cyrl)
        26650: [1250], // LCID 0x681a: (bs-Latn)
        27674: [1251], // LCID 0x6c1a: (sr-Cyrl)
        28698: [1250], // LCID 0x701a: (sr-Latn)
        28731: [1252], // LCID 0x703b: (smn)
        29740: [1251], // LCID 0x742c: (az-Cyrl)
        29755: [1252], // LCID 0x743b: (sms)
        30724: [936], // LCID 0x7804: (zh)
        30740: [1252], // LCID 0x7814: (nn)
        30746: [1250], // LCID 0x781a: (bs)
        30764: [1254], // LCID 0x782c: (az-Latn)
        30779: [1252], // LCID 0x783b: (sma)
        30787: [1251], // LCID 0x7843: (uz-Cyrl)
        30800: [1251], // LCID 0x7850: (mn-Cyrl)
        31748: [950], // LCID 0x7c04: (zh-Hant, zh-Hant)
        31764: [1252], // LCID 0x7c14: (nb)
        31770: [1250], // LCID 0x7c1a: (sr)
        31784: [1251], // LCID 0x7c28: (tg-Cyrl)
        31790: [1252], // LCID 0x7c2e: (dsb)
        31803: [1252], // LCID 0x7c3b: (smj)
        31811: [1254], // LCID 0x7c43: (uz-Latn)
        31814: [1256], // LCID 0x7c46: (pa-Arab)
        31833: [1256], // LCID 0x7c59: (sd-Arab)
        31837: [1252], // LCID 0x7c5d: (iu-Latn)
        31839: [1252], // LCID 0x7c5f: (tzm-Latn)
        31847: [1252], // LCID 0x7c67: (ff-Latn)
        31848: [1252], // LCID 0x7c68: (ha-Latn)
        31878: [1252], // LCID 0x7c86: (quc-Latn)
        31890: [1256], // LCID 0x7c92: (ku-Arab)
    };
}
