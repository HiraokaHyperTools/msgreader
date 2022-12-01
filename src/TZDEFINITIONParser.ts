import DataStream from "./DataStream";
import { readSystemTime } from "./utils";

const TZDEFINITION_FLAG_VALID_GUID = 1;
const TZDEFINITION_FLAG_VALID_KEYNAME = 2;

const TZRULE_FLAG_EFFECTIVE_TZREG = 2;
const TZRULE_FLAG_RECUR_CURRENT_TZREG = 1;

/**
 * 
 * @see [TZRULE | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzrule)
 * @see [TZREG | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzreg)
 */
export interface TzDefinitionRule {
  /**
   * The flags set for this member identify specific details for this time zone rule. The possible flags are as follows:
   * 
   * - TZRULE_FLAG_EFFECTIVE_TZREG (2) — Identifies the rule as the one that should be used currently. Only one rule can be marked as the effective rule. All other rules are for comparison purposes only.
   * - TZRULE_FLAG_RECUR_CURRENT_TZREG (1) — On recurring meetings, identifies the rule as matching the rule in PidLidTimeZoneStruct. This can be used to detect whether PidLidTimeZoneStruct has been modified significantly by a legacy client, which would be otherwise unaware of the new, more complete property.
   * 
   * @see [Constants (Outlook exported APIs) | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/constants-outlook-exported-apis)
   */
  flags: number;

  /**
   * The time in Coordinated Universal Time (UTC) that the time zone rule started.
   */
  start: string;

  /**
   * The offset from Greenwich Mean Time (GMT).
   */
  bias: number;

  /**
   * The offset from bias during standard time.
   */
  standardBias: number;

  /**
   * The offset from bias during daylight saving time.
   */
  daylightBias: number;

  /**
   * The time to switch to standard time.
   */
  standardDate: string;

  /**
   * The time to switch to daylight saving time.
   */
  daylightDate: string;
}

/**
 * 
 * @see [TZDEFINITION | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/tzdefinition)
 */
export interface TzDefinition {
  /**
   * The name of the key for this time zone in the Windows registry. This name must not be localized.
   * 
   * e.g. `Tokyo Standard Time`
   */
  keyName?: string;

  /**
   * An array of rules that describe when shifts occur.
   */
  rules: TzDefinitionRule[];
}

export function parse(ds: DataStream): TzDefinition | null {
  // About persisting TZDEFINITION to a stream to commit to a binary property
  // https://learn.microsoft.com/en-us/office/client-developer/outlook/auxiliary/about-persisting-tzdefinition-to-a-stream-to-commit-to-a-binary-property?redirectedfrom=MSDN

  const tz = { rules: [] } as TzDefinition;

  if (!ds.isEof()) {
    const bMajorVersion = ds.readUint8();
    if (bMajorVersion !== 2) {
      throw new Error("TZDEFINITION major version not supported");
    }
    const bMinorVersion = ds.readUint8();
    if (bMajorVersion < 1) {
      throw new Error("TZDEFINITION minor version not supported");
    }
    const cbHeader = ds.readUint16();
    const wFlags = ds.readUint16();
    if (wFlags & TZDEFINITION_FLAG_VALID_GUID) {
      ds.readInt32();
      ds.readInt32();
      ds.readInt32();
      ds.readInt32();
    }
    if (wFlags & TZDEFINITION_FLAG_VALID_KEYNAME) {
      const cchKeyName = ds.readUint16();
      tz.keyName = ds.readUCS2String(cchKeyName);
    }
    const cRules = ds.readUint16();
    ds.seek(4 + cbHeader);

    for (let x = 0; x < cRules; x++) {
      const bMajorVersion = ds.readUint8();
      if (bMajorVersion !== 2) {
        break;
      }
      const bMinorVersion = ds.readUint8();
      if (bMajorVersion < 1) {
        break;
      }
      const cbRule = ds.readUint16();
      const basePos = ds.position;
      const wFlags = ds.readUint16();
      const stStart = readSystemTime(ds);
      const lBias = ds.readInt32();
      const lStandardBias = ds.readInt32();
      const lDaylightBias = ds.readInt32();
      const stStandardDate = readSystemTime(ds);
      const stDaylightDate = readSystemTime(ds);

      const rule = Object.assign(
        {},
        {
          flags: wFlags,
          start: stStart.toUTCString(),
          bias: lBias,
          standardBias: lStandardBias,
          daylightBias: lDaylightBias,
          standardDate: stStandardDate.toUTCString(),
          daylightDate: stDaylightDate.toUTCString(),
        }
      );
      tz.rules.push(rule);

      ds.seek(basePos + cbRule);
    }
  }
  return tz;
}
