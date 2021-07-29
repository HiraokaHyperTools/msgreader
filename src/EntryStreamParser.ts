import DataStream from "./DataStream";

export interface Entry {
    key: number;
    isStringProperty: boolean;
    guidIndex: number;
    propertyIndex: number;
}

export function parse(array: Uint8Array): Entry[] {
    const ds = new DataStream(array, 0, DataStream.LITTLE_ENDIAN);
    const ret: Entry[] = [];
    while (!ds.isEof()) {
        const key = ds.readUint32();
        const low = ds.readUint16();
        const hi = ds.readUint16();
        ret.push(
            {
                key,
                isStringProperty: (low & 1) != 0,
                guidIndex: (low >> 1) & 32767,
                propertyIndex: hi,
            }
        )
    }
    return ret;
}
