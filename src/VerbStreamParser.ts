import DataStream from "./DataStream";

export function parse(ds: DataStream): string {
    // 2.2.1.74.1 VoteOption Structure
    // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxomsg/87488eff-3eec-4502-bc94-2368c04e3109

    const items: { VerbType: number, DisplayName: string }[] = [];
    let count = 0;
    while (!ds.isEof()) {
        const version = ds.readUint16();
        if (version === 258) {
            count = ds.readUint16();
            const dummy1 = ds.readUint16();
            for (let index = 0; index < count; index += 1) {
                const VerbType = ds.readInt32();
                const DisplayNameCount = ds.readUint8();
                const DisplayName = ds.readString(DisplayNameCount);
                const MsgClsNameCount = ds.readUint8();
                const MsgClsName = ds.readString(MsgClsNameCount);
                const Internal1StringCount = ds.readUint8();
                const Internal1String = ds.readString(Internal1StringCount);
                const DisplayNameCountRepeat = ds.readUint8();
                const DisplayNameRepeat = ds.readString(DisplayNameCountRepeat);
                const Internal2 = ds.readInt32();
                const Internal3 = ds.readUint8();
                const fUseUSHeaders = ds.readInt32();
                const Internal4 = ds.readInt32();
                const SendBehavior = ds.readInt32();
                const Internal5 = ds.readInt32();
                const ID = ds.readInt32();
                const Internal6 = ds.readInt32();

                items.push({ VerbType, DisplayName });
            }
        }
        else if (version === 260) {
            for (let index = 0; index < count; index += 1) {
                const DisplayNameCount = ds.readUint8();
                const DisplayName = ds.readUCS2String(DisplayNameCount);
                const DisplayNameCountRepeat = ds.readUint8();
                const DisplayNameRepeat = ds.readUCS2String(DisplayNameCountRepeat);

                items[index].DisplayName = DisplayName;
            }
        }
    }

    return items
        .filter(it => it.VerbType === 4)
        .map(it => it.DisplayName)
        .join("; ");
}
