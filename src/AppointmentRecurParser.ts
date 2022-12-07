import DataStream from "./DataStream";

/**
 * RecurFrequency
 * 
 * @see [[MS-OXOCAL]: RecurrencePattern Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/cf7153b4-f8b5-4cb6-bf14-e78d21f94814)
 */
export enum RecurFrequency {
  Daily = 0x200A,
  Weekly = 0x200B,
  Monthly = 0x200C,
  Yearly = 0x200D,
}

/**
 * PatternType
 * 
 * @see [[MS-OXOCAL]: RecurrencePattern Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/cf7153b4-f8b5-4cb6-bf14-e78d21f94814)
 */
export enum PatternType {
  /**
   * The event has a daily recurrence.
   */
  Day = 0x0000,

  /**
   * The event has a weekly recurrence.
   */
  Week = 0x0001,

  /**
   * The event has a monthly recurrence.
   */
  Month = 0x0002,

  /**
   * The event has a month-end recurrence.
   */
  MonthEnd = 0x0004,

  /**
   * The event has an every nth month pattern.
   */
  MonthNth = 0x0003,

  /**
   * The event has a monthly recurrence in the Hijri calendar. 
   * For this value in the PatternType field, the value of the CalendarType field SHOULD be set to 0x0000.
   */
  HjMonth = 0x000A,

  /**
   * The event has an every nth month pattern in the Hijri calendar.
   * For this value in the PatternType field, the value of the CalendarType field MUST be set to 0x0000.
   */
  HjMonthNth = 0x000B,

  /**
   * The event has a month end recurrence in the Hijri calendar.
   * For this value in the PatternType field, the value of the CalendarType field MUST be set to 0x0000.
   */
  HjMonthEnd = 0x000C,
}

export enum CalendarType {
  /**
   * The default value for the calendar type is Gregorian.
   */
  Default = 0x0000,

  /**
   * Gregorian (localized) calendar
   */
  CAL_GREGORIAN = 0x0001,

  /**
   * Gregorian (U.S.) calendar
   */
  CAL_GREGORIAN_US = 0x0002,

  /**
   * Japanese Emperor era calendar
   */
  CAL_JAPAN = 0x0003,

  /**
   * Taiwan calendar
   */
  CAL_TAIWAN = 0x0004,

  /**
   * Korean Tangun era calendar
   */
  CAL_KOREA = 0x0005,

  /**
   * Hijri (Arabic Lunar) calendar
   */
  CAL_HIJRI = 0x0006,

  /**
   * Thai calendar
   */
  CAL_THAI = 0x0007,

  /**
   * Hebrew lunar calendar
   */
  CAL_HEBREW = 0x0008,

  /**
   * Gregorian Middle East French calendar
   */
  CAL_GREGORIAN_ME_FRENCH = 0x0009,

  /**
   * Gregorian Arabic calendar
   */
  CAL_GREGORIAN_ARABIC = 0x000A,

  /**
   * Gregorian transliterated English calendar
   */
  CAL_GREGORIAN_XLIT_ENGLISH = 0x000B,

  /**
   * Gregorian transliterated French calendar
   */
  CAL_GREGORIAN_XLIT_FRENCH = 0x000C,

  /**
   * Japanese lunar calendar
   */
  CAL_LUNAR_JAPANESE = 0x000E,

  /**
   * Chinese lunar calendar
   */
  CAL_CHINESE_LUNAR = 0x000F,

  /**
   * Saka era calendar
   */
  CAL_SAKA = 0x0010,

  /**
   * Lunar ETO Chinese calendar
   */
  CAL_LUNAR_ETO_CHN = 0x0011,

  /**
   * Lunar ETO Korean calendar
   */
  CAL_LUNAR_ETO_KOR = 0x0012,

  /**
   * Lunar Rokuyou calendar
   */
  CAL_LUNAR_ROKUYOU = 0x0013,

  /**
   * Korean lunar calendar
   */
  CAL_LUNAR_KOREAN = 0x0014,

  /**
   * Um Al Qura calendar
   */
  CAL_UMALQURA = 0x0017,
}

export enum EndType {
  EndAfterDate = 0x00002021,
  EndAfterNOccurrences = 0x00002022,
  NeverEnd = 0x00002023,
  NeverEnd2 = 0xFFFFFFFF,
}

/**
 * PatternTypeSpecific Week
 * 
 * @see [[MS-OXOCAL]: PatternTypeSpecific Week | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/d5ab794b-c2d8-42e4-b1f3-3913e97b0889)
 */
export interface PatternTypeWeek {
  /**
   * ```
   * Sa (1 bit):  (0x00000040) The event occurs on Saturday.
   * F  (1 bit):  (0x00000020) The event occurs on Friday.
   * Th (1 bit):  (0x00000010) The event occurs on Thursday.
   * W  (1 bit):  (0x00000008) The event occurs on Wednesday.
   * Tu (1 bit):  (0x00000004) The event occurs on Tuesday.
   * M  (1 bit):  (0x00000002) The event occurs on Monday.
   * Su (1 bit):  (0x00000001) The event occurs on Sunday.
   * ```
   */
  dayOfWeekBits: number;
}

/**
 * PatternTypeSpecific Month
 * 
 * @see [[MS-OXOCAL]: PatternTypeSpecific Month | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/457a77d0-51bf-47fc-bceb-33f3f78f91b8)
 */
export interface PatternTypeMonth {
  /**
   * The day of the month on which the recurrence falls.
   */
  day: number;
}

/**
 * PatternTypeSpecific MonthNth
 * 
 * @see [[MS-OXOCAL]: PatternTypeSpecific MonthNth | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/6ac538f5-8ba0-4dfe-a383-09fab61136db)
 */
export interface PatternTypeMonthNth {
  /**
   * ```
   * Sa (1 bit):  (0x00000040) The event occurs on Saturday.
   * F  (1 bit):  (0x00000020) The event occurs on Friday.
   * Th (1 bit):  (0x00000010) The event occurs on Thursday.
   * W  (1 bit):  (0x00000008) The event occurs on Wednesday.
   * Tu (1 bit):  (0x00000004) The event occurs on Tuesday.
   * M  (1 bit):  (0x00000002) The event occurs on Monday.
   * Su (1 bit):  (0x00000001) The event occurs on Sunday.
   * ```
   */
  dayOfWeekBits: number;

  /**
   * The occurrence of the recurrence's days in each month in which the recurrence falls.
   * 
   * It MUST be equal to one of the values listed in the following table.
   * 
   * Name   | Value      | Meaning                                                                               
   * -------|------------|---------------------------------------------------------------------------------------
   * First  | 0x00000001 | The recurrence falls on the first occurrence of the days specified in every month.
   * Second | 0x00000002 | The recurrence falls on the second occurrence of the days specified in every month.
   * Third  | 0x00000003 | The recurrence falls on the third occurrence of the days specified in every month.
   * Fourth | 0x00000004 | The recurrence falls on the fourth occurrence of the days specified in every month.
   * Last   | 0x00000005 | The recurrence falls on the last occurrence of the days specified in every month.
   */
  n: number;
}

/**
 * RecurrencePattern
 * 
 * Quick code snippet to obtain JavaScript date from Gregorian calendar:
 * 
 * ```js
 * new Date(-11644473600000 + startDate * 1000 * 60);
 * new Date(-11644473600000 + endDate * 1000 * 60);
 * ```
 * 
 * @see [[MS-OXOCAL]: RecurrencePattern Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/cf7153b4-f8b5-4cb6-bf14-e78d21f94814)
 */
export interface RecurrencePattern {
  /**
   * An integer that specifies the frequency of the recurring series.
   * 
   * Valid values are listed in the following table.
   * 
   * RecurFrequency | Value
   * ---------------|------
   * Daily          | 0x200A
   * Weekly         | 0x200B
   * Monthly        | 0x200C
   * Yearly         | 0x200D
   */
  recurFrequency: RecurFrequency;

  /**
   * An integer that specifies the type of recurrence pattern.
   * 
   * The valid recurrence pattern types are listed in the following table.
   * 
   * Name       | Value  | Meaning
   * -----------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * Day        | 0x0000 | The event has a daily recurrence.
   * Week       | 0x0001 | The event has a weekly recurrence.
   * Month      | 0x0002 | The event has a monthly recurrence.
   * MonthEnd   | 0x0004 | The event has a month-end recurrence.
   * MonthNth   | 0x0003 | The event has an every nth month pattern.
   * HjMonth    | 0x000A | The event has a monthly recurrence in the Hijri calendar. For this value in the PatternType field, the value of the CalendarType field SHOULD be set to 0x0000.
   * HjMonthNth | 0x000B | The event has an every nth month pattern in the Hijri calendar. For this value in the PatternType field, the value of the CalendarType field MUST be set to 0x0000.
   * HjMonthEnd | 0x000C | The event has a month end recurrence in the Hijri calendar. For this value in the PatternType field, the value of the CalendarType field MUST be set to 0x0000.
   */
  patternType: PatternType;

  /**
   * An integer that specifies the type of calendar that is used.
   * 
   * The acceptable values for the calendar type are listed in the following table.
   * 
   * Name                       | Value  | Meaning
   * ---------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * Default                    | 0x0000 | The default value for the calendar type is Gregorian. If the value of the PatternType field is HjMonth, HjMonthNth, or HjMonthEnd and the value of the CalendarType field is Default, this recurrence uses the Hijri calendar.
   * CAL_GREGORIAN              | 0x0001 | Gregorian (localized) calendar
   * CAL_GREGORIAN_US           | 0x0002 | Gregorian (U.S.) calendar
   * CAL_JAPAN                  | 0x0003 | Japanese Emperor era calendar
   * CAL_TAIWAN                 | 0x0004 | Taiwan calendar
   * CAL_KOREA                  | 0x0005 | Korean Tangun era calendar
   * CAL_HIJRI                  | 0x0006 | Hijri (Arabic Lunar) calendar
   * CAL_THAI                   | 0x0007 | Thai calendar
   * CAL_HEBREW                 | 0x0008 | Hebrew lunar calendar
   * CAL_GREGORIAN_ME_FRENCH    | 0x0009 | Gregorian Middle East French calendar
   * CAL_GREGORIAN_ARABIC       | 0x000A | Gregorian Arabic calendar
   * CAL_GREGORIAN_XLIT_ENGLISH | 0x000B | Gregorian transliterated English calendar
   * CAL_GREGORIAN_XLIT_FRENCH  | 0x000C | Gregorian transliterated French calendar
   * CAL_LUNAR_JAPANESE         | 0x000E | Japanese lunar calendar
   * CAL_CHINESE_LUNAR          | 0x000F | Chinese lunar calendar
   * CAL_SAKA                   | 0x0010 | Saka era calendar
   * CAL_LUNAR_ETO_CHN          | 0x0011 | Lunar ETO Chinese calendar
   * CAL_LUNAR_ETO_KOR          | 0x0012 | Lunar ETO Korean calendar
   * CAL_LUNAR_ROKUYOU          | 0x0013 | Lunar Rokuyou calendar
   * CAL_LUNAR_KOREAN           | 0x0014 | Korean lunar calendar
   * CAL_UMALQURA               | 0x0017 | Um Al Qura calendar
   */
  calendarType: CalendarType;

  /**
   * An integer that specifies the first ever day, week, or month of a recurring series, 
   * dating back to a reference date, which is January 1, 1601, for a Gregorian calendar.
   * 
   * The value and its meaning depend on the value of the RecurFrequency field.
   * The value of the FirstDateTime field is used to determine the valid dates of a recurring series,
   * as specified in section [2.2.1.44.1.2](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/181a11eb-0f26-4d8f-8292-8c77dcfb03e3).
   */
  firstDateTime: number;

  /**
   * An integer that specifies the interval at which the meeting pattern specified in 
   * PatternTypeSpecific field repeats. The {@link period} value MUST be between 1 and the
   * maximum recurrence interval, which is 999 days for daily recurrences,
   * 99 weeks for weekly recurrences, and 99 months for monthly recurrences. 
   * 
   * The following table lists the values for this field based on the recurrence frequency, 
   * which is specified in the {@link recurFrequency} field.
   * 
   * Frequency                    | Value
   * -----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   * Daily recurrence             | The period is stored as the minutes in whole number of days. For example, to define a recurrence that occurs every two days, the {@link period} field is set to 0x00000B40, which equals 2880 minutes, or two days.
   * Weekly recurrence            | The period is stored in weeks. For example, if the {@link period} field is set to 0x00000002, the meeting occurs every two weeks.
   * Monthly or yearly recurrence | The period is stored in months. If the recurrence is a yearly recurrence, The {@link period} field MUST be set to 12.
   */
  period: number;

  /**
   * This field is only used for scheduling tasks; otherwise the value MUST be zero (0).
   * For more details about sliding tasks, see [[MS-OXOTASK]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxotask/55600ec0-6195-4730-8436-59c7931ef27e)
   * section [3.1.4.6.2](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxotask/860665d1-b309-4a64-9e8a-7051126ad7ee).
   */
  slidingFlag: number;

  patternTypeWeek?: PatternTypeWeek;
  patternTypeMonth?: PatternTypeMonth;
  patternTypeMonthNth?: PatternTypeMonthNth;

  /**
   * An integer that specifies the ending type for the recurrence.
   * 
   * This field MUST be set to one of the values listed in the following table.
   * 
   * Recurrence range type   | Value
   * ------------------------|-------------------------------------------
   * End after date          | 0x00002021
   * End after N occurrences | 0x00002022
   * Never end               | SHOULD be 0x00002023 but can be 0xFFFFFFFF
   */
  endType: EndType;

  /**
   * An integer that specifies the number of occurrences in a recurrence.
   */
  occurrenceCount: number;

  /**
   * An integer that specifies the day on which the calendar week begins.
   * 
   * The default value is Sunday (0x00000000).
   * 
   * This field MUST be set to one of the values listed in the following table.
   * 
   * Day       | Value     
   * ----------|-----------
   * Sunday    | 0x00000000
   * Monday    | 0x00000001
   * Tuesday   | 0x00000002
   * Wednesday | 0x00000003
   * Thursday  | 0x00000004
   * Friday    | 0x00000005
   * Saturday  | 0x00000006
   */
  firstDOW: number;

  /**
   * An array of dates, each of which is the original instance date of either a 
   * deleted instance or a modified instance for this recurrence.
   * 
   * The number of dates contained in this array is specified by the DeletedInstanceCount field.
   * 
   * Each date is stored as the number of minutes between midnight, January 1, 1601,
   * and midnight of the specified day, in the time zone specified by the
   * PidLidTimeZoneStruct property (section 2.2.1.39).
   * 
   * The dates are ordered from earliest to latest.
   */
  deletedInstanceDates: number[];

  /**
   * An array of dates, each of which is the date of a modified instance.
   * 
   * The number of dates contained in this array is specified by the ModifiedInstanceCount field.
   * 
   * Each date is stored as the number of minutes between midnight, January 1, 1601,
   * and midnight of the specified day, in the time zone specified by the
   * PidLidTimeZoneStruct property (section [2.2.1.39](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/c7d7d00f-984c-4af6-9634-8c602eb05b5f)).
   * 
   * The dates are ordered from earliest to latest.
   */
  modifiedInstanceDates: number[];

  /**
   * An integer that specifies the date of the first occurrence.
   * 
   * The value is the number of minutes between midnight, January 1, 1601,
   * and midnight of the date of the first occurrence.
   */
  startDate: number;

  /**
   * An integer that specifies the ending date for the recurrence.
   * 
   * The value is the number of minutes between midnight, January 1, 1601,
   * and midnight of the date of the last occurrence.
   * 
   * When the value of the {@link endType} field is `0x00002022` (end after n occurrences),
   * this value is calculated based on the number of occurrences
   * 
   * If the recurrence does not have an end date,
   * the value of the {@link endDate} field MUST be set to `0x5AE980DF`.
   */
  endDate: number;
}

/**
 * OverrideFlags
 * 
 * @see [[MS-OXOCAL]: ExceptionInfo Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/0980d033-3bf1-43e9-a1e6-af51c564e24a)
 */
export enum OverrideFlags {
  /**
   * Indicates that the Subject, SubjectLength, and SubjectLength2 fields are present.
   */
  ARO_SUBJECT = 0x0001,

  /**
   * Indicates that the MeetingType field is present.
   */
  ARO_MEETINGTYPE = 0x0002,

  /**
   * Indicates that the ReminderDelta field is present.
   */
  ARO_REMINDERDELTA = 0x0004,

  /**
   * Indicates that the ReminderSet field is present.
   */
  ARO_REMINDER = 0x0008,

  /**
   * Indicates that the Location, LocationLength, and LocationLength2 fields are present.
   */
  ARO_LOCATION = 0x0010,

  /**
   * Indicates that the BusyStatus field is present.
   */
  ARO_BUSYSTATUS = 0x0020,

  /**
   * Indicates that the attachment field is present.
   */
  ARO_ATTACHMENT = 0x0040,

  /**
   * Indicates that the SubType field is present.
   */
  ARO_SUBTYPE = 0x0080,

  /**
   * Indicates that the AppointmentColor field is present.
   */
  ARO_APPTCOLOR = 0x0100,

  /**
   * Indicates that the Exception Embedded Message object has the PidTagRtfCompressed property
   * ([MS-OXCMSG] section 2.2.1.56.4) set on it.
   */
  ARO_EXCEPTIONAL_BODY = 0x0200,
};


/**
 * ExceptionInfo and ExtendedException Structure
 * 
 * @see [[MS-OXOCAL]: ExceptionInfo Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/0980d033-3bf1-43e9-a1e6-af51c564e24a)
 * @see [[MS-OXOCAL]: ExtendedException Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/84246341-a23f-49c8-824f-1f07b9ceae37)
 */
export interface ExceptionInfo {
  /**
   * The start time of the exception in local time in minutes since midnight, January 1, 1601.
   */
  startDateTime: number;

  /**
   * The end time of the exception in local time in minutes since midnight, January 1, 1601.
   */
  endDateTime: number;

  /**
   * The original starting time of the exception in local time in minutes since midnight, January 1, 1601.
   */
  originalStartTime: number;

  /**
   * A bit field that specifies what data in the ExceptionInfo structure has a value different from
   * the recurring series.
   * 
   * The valid flags for this field are summarized in the following table.
   * 
   * Flag                 | Value  | Meaning
   * ---------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------
   * ARO_SUBJECT          | 0x0001 | Indicates that the Subject, SubjectLength, and SubjectLength2 fields are present.
   * ARO_MEETINGTYPE      | 0x0002 | Indicates that the MeetingType field is present.
   * ARO_REMINDERDELTA    | 0x0004 | Indicates that the ReminderDelta field is present.
   * ARO_REMINDER         | 0x0008 | Indicates that the ReminderSet field is present.
   * ARO_LOCATION         | 0x0010 | Indicates that the Location, LocationLength, and LocationLength2 fields are present.
   * ARO_BUSYSTATUS       | 0x0020 | Indicates that the BusyStatus field is present.
   * ARO_ATTACHMENT       | 0x0040 | Indicates that the attachment field is present.
   * ARO_SUBTYPE          | 0x0080 | Indicates that the SubType field is present.
   * ARO_APPTCOLOR        | 0x0100 | Indicates that the AppointmentColor field is present.
   * ARO_EXCEPTIONAL_BODY | 0x0200 | Indicates that the [Exception Embedded Message object](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/ffc6fee6-5a9b-418f-be28-457cc707e665#gt_e37f1f62-1a3d-4744-84cb-8de32536fcfc) has the PidTagRtfCompressed property ([[MS-OXCMSG]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/7fd7ec40-deec-4c06-9493-1bc06b349682) section [2.2.1.56.4](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/fcb7ba29-c4d5-4298-bbf6-1182dc88c018)) set on it.
   */
  overrideFlags: OverrideFlags;

  /**
   * A non-null-terminated, non-Unicode string that is the value of the PidTagNormalizedSubject property
   * ([[MS-OXCMSG]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/7fd7ec40-deec-4c06-9493-1bc06b349682)
   * section [2.2.1.10](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/44445cab-af0d-4098-96e8-92ca96f08a73)) in the Exception Embedded Message object. 
   * 
   * -or-
   * 
   * The Unicode string value for the exception's PidTagNormalizedSubject property ([[MS-OXCMSG]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/7fd7ec40-deec-4c06-9493-1bc06b349682)
   * section [2.2.1.10](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcmsg/44445cab-af0d-4098-96e8-92ca96f08a73)).
   * Note that the WideCharSubject field is not null-terminated.
   */
  subject?: string;

  /**
   * The value of the PidLidAppointmentStateFlags property (section [2.2.1.10](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/9be16fe9-810e-40d1-9f2a-27b2803fe911))
   * in the Exception Embedded Message object.
   */
  meetingType?: number;

  /**
   * The value for the PidLidReminderDelta property ([[MS-OXORMDR]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxormdr/5454ebcc-e5d1-4da8-a598-d393b101caab)
   * section [2.2.1.3](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxormdr/e2d6fb35-1d7e-41a9-9053-e14cbc12c38c))
   * in the Exception Embedded Message object.
   */
  reminderDelta?: number;

  /**
   * The value for the PidLidReminderSet property ([[MS-OXORMDR]](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxormdr/5454ebcc-e5d1-4da8-a598-d393b101caab)
   * section [2.2.1.1](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxormdr/5a387ab7-3c6b-4e5d-b207-43aca5470c94))
   * in the Exception Embedded Message object.
   */
  reminderSet?: number;

  /**
   * A non-Unicode string that is the value of the PidLidLocation property (section [2.2.1.4](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/a512de38-5c46-4909-8f11-181029ba70ee))
   * in the Exception Embedded Message object.
   * 
   * -or-
   * 
   * The Unicode string value for the PidLidLocation property (section [2.2.1.4](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/a512de38-5c46-4909-8f11-181029ba70ee))
   * in the Exception Embedded Message object. Note that the WideCharLocation field is not null-terminated.
   */
  location?: string;

  /**
   * The value for the PidLidBusyStatus property (section [2.2.1.2](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/1ff3f49b-458f-4ed7-928e-711d9bfc09ac))
   * in the Exception Embedded Message object.
   * 
   * For possible values, see section 2.2.1.2.
   */
  busyStatus?: number;

  /**
   * The value of this field specifies whether the Exception Embedded Message object contains attachments.
   * 
   * The value will be 0x00000001 if attachments are present, and 0x00000000 otherwise.
   */
  attachment?: number;

  /**
   * The value for the PidLidAppointmentSubType property (section [2.2.1.9](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/53421288-a85e-4790-927d-d7be13efb166))
   * in the Exception Embedded Message object.
   * 
   * For possible values, see section 2.2.1.9.
   */
  subType?: number;

  /**
   * The value for the PidLidAppointmentColor property (section 2.2.1.50) in the Exception Embedded Message object.
   * 
   * For possible values, see section 2.2.1.50.
   */
  appointmentColor?: number;

  /**
   * The value of the PidLidChangeHighlight property (section [2.2.6.2](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/f77e6e3e-5f54-46d5-9315-0f96af037803))
   * in the [Exception object](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/ffc6fee6-5a9b-418f-be28-457cc707e665#gt_dd432053-7490-4147-b19d-7e107e8f86d4).
   */
  changeHighlight?: number;

}

/**
 * AppointmentRecur
 * 
 * @see [[MS-OXOCAL]: PidLidAppointmentRecur Property | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/5ee26cac-2c03-4b8d-8fc1-37c4bb5712dd)
 * @see [[MS-OXOCAL]: AppointmentRecurrencePattern Structure | Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/c8e2d103-f4e7-4de2-9cc9-0d8f8d8ef201)
 */
export interface AppointmentRecur {
  /**
   * This field is a RecurrencePattern structure, as specified in section [2.2.1.44.1](https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxocal/cf7153b4-f8b5-4cb6-bf14-e78d21f94814),
   * that defines the recurrences.
   */
  recurrencePattern: RecurrencePattern;

  /**
   * The number of minutes, since midnight, after which each occurrence starts.
   * 
   * For example, the value for midnight is 0 (zero) and the value for 12:00 P.M. is 720.
   */
  startTimeOffset: number;

  /**
   * The number of minutes, since midnight, after which each occurrence ends.
   * 
   * For example, the value for midnight is 0 (zero) and the value for 12:00 P.M. is 720.
   */
  endTimeOffset: number;

  /**
   * An array of ExceptionInfo structures.
   */
  exceptionInfo: ExceptionInfo[];
}

function parseRecurrencePattern(ds: DataStream): RecurrencePattern {
  const ReaderVersion = ds.readUint16();
  if (ReaderVersion !== 0x3004) {
    throw new Error("ReaderVersion not supported");
  }

  const WriterVersion = ds.readUint16();
  if (WriterVersion !== 0x3004) {
    throw new Error("WriterVersion not supported");
  }

  const recurFrequency: RecurFrequency = ds.readUint16();
  const patternType: PatternType = ds.readUint16();
  const calendarType: CalendarType = ds.readUint16();
  const firstDateTime = ds.readUint32();
  const period = ds.readUint32();
  const slidingFlag = ds.readUint32();

  let patternTypeWeek: PatternTypeWeek | undefined = undefined;
  let patternTypeMonth: PatternTypeMonth | undefined = undefined;
  let patternTypeMonthNth: PatternTypeMonthNth | undefined = undefined;
  if (false) { }
  else if (false
    || patternType === PatternType.Week
  ) {
    patternTypeWeek = {
      dayOfWeekBits: ds.readUint32(),
    };
  }
  else if (false
    || patternType === PatternType.Month
    || patternType === PatternType.MonthEnd
    || patternType === PatternType.HjMonth
    || patternType === PatternType.HjMonthEnd
  ) {
    patternTypeMonth = {
      day: ds.readUint32(),
    };
  }
  else if (false
    || patternType === PatternType.MonthNth
    || patternType === PatternType.HjMonthNth
  ) {
    patternTypeMonthNth = {
      dayOfWeekBits: ds.readUint32(),
      n: ds.readUint32(),
    };
  }
  const endType: EndType = ds.readUint32();
  const occurrenceCount = ds.readUint32();
  const firstDOW = ds.readUint32();
  const deletedInstanceCount = ds.readUint32();
  const deletedInstanceDates = Array.from(ds.readUint32Array(deletedInstanceCount)) as number[];
  const modifiedInstanceCount = ds.readUint32();
  const modifiedInstanceDates = Array.from(ds.readUint32Array(modifiedInstanceCount)) as number[];
  const startDate = ds.readUint32();
  const endDate = ds.readUint32();

  return Object.assign(
    {
      recurFrequency: recurFrequency,
      patternType: patternType,
      calendarType: calendarType,
      firstDateTime: firstDateTime,
      period: period,
      slidingFlag: slidingFlag,
      endType: endType,
      occurrenceCount: occurrenceCount,
      firstDOW: firstDOW,
      deletedInstanceDates: deletedInstanceDates,
      modifiedInstanceDates: modifiedInstanceDates,
      startDate: startDate,
      endDate: endDate,
    },
    patternTypeWeek ? { patternTypeWeek } : {},
    patternTypeMonth ? { patternTypeMonth } : {},
    patternTypeMonthNth ? { patternTypeMonthNth } : {}
  );
}

/**
 * @internal
 */
export function parse(ds: DataStream, ansiEncoding: string): AppointmentRecur {
  const recurrencePattern = parseRecurrencePattern(ds);

  const readerVersion2 = ds.readUint32();
  if (readerVersion2 !== 0x3006) {
    throw new Error("ReaderVersion2 not supported");
  }

  const writerVersion2 = ds.readUint32();
  if (writerVersion2 < 0x3006) {
    throw new Error("WriterVersion2 not supported");
  }

  const startTimeOffset = ds.readUint32();
  const endTimeOffset = ds.readUint32();
  const exceptionCount = ds.readUint16();

  const exceptionInfo: ExceptionInfo[] = [];
  for (let x = 0; x < exceptionCount; x++) {
    const startDateTime = ds.readUint32();
    const endDateTime = ds.readUint32();
    const originalStartTime = ds.readUint32();
    const overrideFlags: OverrideFlags = ds.readUint16();

    let subject: string | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_SUBJECT) {
      const subjectLength = ds.readUint16();
      const subjectLength2 = ds.readUint16();
      if (subjectLength - 1 !== subjectLength2) {
        throw new Error(`subjectLength ${subjectLength} and subjectLength2 ${subjectLength2} are not close!`);
      }
      subject = ds.readString(subjectLength2, ansiEncoding);
    }

    let meetingType: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_MEETINGTYPE) {
      meetingType = ds.readUint32();
    }

    let reminderDelta: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_REMINDERDELTA) {
      reminderDelta = ds.readUint32();
    }

    let reminderSet: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_REMINDER) {
      reminderSet = ds.readUint32();
    }

    let location: string | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_LOCATION) {
      const locationLength = ds.readUint16();
      const locationLength2 = ds.readUint16();
      if (locationLength - 1 !== locationLength2) {
        throw new Error(`locationLength ${locationLength} and locationLength2 ${locationLength2} are not close!`);
      }
      location = ds.readString(locationLength2, ansiEncoding);
    }

    let busyStatus: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_BUSYSTATUS) {
      busyStatus = ds.readUint32();
    }

    let attachment: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_ATTACHMENT) {
      attachment = ds.readUint32();
    }

    let subType: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_SUBTYPE) {
      subType = ds.readUint32();
    }

    let appointmentColor: number | undefined = undefined;
    if (overrideFlags & OverrideFlags.ARO_APPTCOLOR) {
      appointmentColor = ds.readUint32();
    }

    exceptionInfo.push(Object.assign(
      {
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        originalStartTime: originalStartTime,
        overrideFlags: overrideFlags,
      },
      subject ? { subject } : {},
      meetingType ? { meetingType } : {},
      reminderDelta ? { reminderDelta } : {},
      reminderSet ? { reminderSet } : {},
      location ? { location } : {},
      busyStatus ? { busyStatus } : {},
      attachment ? { attachment } : {},
      subType ? { subType } : {},
      appointmentColor ? { appointmentColor } : {}
    ));
  }

  const reservedBlock1Size = ds.readUint32();
  if (reservedBlock1Size !== 0) {
    throw new Error(`reservedBlock1Size ${reservedBlock1Size} is not zero, AppointmentRecur is broken`);
  }

  for (let x = 0; x < exceptionCount; x++) {
    const one = exceptionInfo[x];
    if (0x00003009 <= writerVersion2) {
      const changeHighlightSize = ds.readUint32();
      one.changeHighlight = ds.readUint32();
      ds.position += changeHighlightSize - 4;
    }

    const reservedBlockEE1Size = ds.readUint32();
    if (reservedBlockEE1Size !== 0) {
      throw new Error(`reservedBlockEE1Size ${reservedBlockEE1Size} is not zero, AppointmentRecur is broken`);
    }

    if (one.overrideFlags & (OverrideFlags.ARO_SUBJECT | OverrideFlags.ARO_LOCATION)) {
      const startDateTime = ds.readUint32();
      const endDateTime = ds.readUint32();
      const originalStartDate = ds.readUint32();

      if (one.overrideFlags & (OverrideFlags.ARO_SUBJECT)) {
        const wideCharSubjectLength = ds.readUint16();
        one.subject = ds.readUCS2String(wideCharSubjectLength);
      }
      if (one.overrideFlags & (OverrideFlags.ARO_LOCATION)) {
        const wideCharLocationLength = ds.readUint16();
        one.location = ds.readUCS2String(wideCharLocationLength);
      }
    }

    const reservedBlockEE2Size = ds.readUint32();
    if (reservedBlockEE2Size !== 0) {
      throw new Error(`reservedBlockEE2Size ${reservedBlockEE2Size} is not zero, AppointmentRecur is broken`);
    }

  }

  const reservedBlock2Size = ds.readUint32();
  if (reservedBlock2Size !== 0) {
    throw new Error(`reservedBlock2Size ${reservedBlock2Size} is not zero, AppointmentRecur is broken`);
  }

  return {
    recurrencePattern: recurrencePattern,
    startTimeOffset: startTimeOffset,
    endTimeOffset: endTimeOffset,
    exceptionInfo: exceptionInfo,
  };
}
