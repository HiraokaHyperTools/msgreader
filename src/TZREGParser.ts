import DataStream from "./DataStream.js";
import { TransitionSystemTime } from "./TZDEFINITIONParser.js";
import { readSystemTime, readTransitionSystemTime } from "./utils.js";


/**
 * Contains a stream that maps to the persisted format of a TZREG structure,
 * which describes the time zone to be used for the start and end time of a
 * recurring appointment or meeting request.
 * 
 * @see [PidLidTimeZoneStruct Canonical Property | Microsoft Learn](https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidtimezonestruct-canonical-property)
 */
export interface TzReg {
    /**
     * offset from GMT
     * 
     * Unit: in minutes
     * 
     * e.g. `-540` for JST (TZ=JST-9)
     */
    bias: number,

    /**
     * offset from bias during standard time
     */
    standardBias: number,

    /**
     * offset from bias during daylight time
     * 
     * Unit: in minutes
     * 
     * e.g. `-60` for Japanese. In Japan there is no summer time. This value may be generic value over worldwide.
     */
    daylightBias: number,

    /**
     * matches the stStandardDate's wYear member
     */
    standardYear: number;

    /**
     * time to switch to standard time
     */
    standardDate: TransitionSystemTime,

    /**
     * matches the stDaylightDate's wYear field
     */
    daylightYear: number;

    /**
     * time to switch to daylight time
     */
    daylightDate: TransitionSystemTime,
}

/**
 * @internal
 */
export function parse(ds: DataStream): TzReg | null {
    // PidLidTimeZoneStruct Canonical Property
    // https://learn.microsoft.com/en-us/office/client-developer/outlook/mapi/pidlidtimezonestruct-canonical-property

    if (!ds.isEof()) {
        const lBias = ds.readInt32();
        const lStandardBias = ds.readInt32();
        const lDaylightBias = ds.readInt32();
        const wStandardYear = ds.readUint16();
        const stStandardDate = readTransitionSystemTime(ds);
        const wDaylightYear = ds.readUint16();
        const stDaylightDate = readTransitionSystemTime(ds);

        return Object.assign(
            {},
            {
                bias: lBias,
                standardBias: lStandardBias,
                daylightBias: lDaylightBias,
                standardYear: wStandardYear,
                standardDate: stStandardDate,
                daylightYear: wDaylightYear,
                daylightDate: stDaylightDate,
            }
        );
    }
    return null;
}
