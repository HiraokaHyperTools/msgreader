import { TypeEnum } from "./Reader";
import DataStream from "./DataStream";
import CONST from "./const";

/**
 * CFBF entry for CFBF burner.
 * 
 * These entries are stored in same order in CFBF.
 * 
 * The first entry must be {@link ROOT}.
 * 
 * This {@link ROOT} stream represents:
 * 
 * - The root folder as same as you see in real file system.
 *   Including direct children files/folder.
 * - The body of minifat.
 * 
 * The secondary entries are collection of items having type either {@link DIRECTORY} or {@link DOCUMENT}.
 * 
 */
export interface Entry {
    /**
     * Entry name (max 32 chars).
     */
    name: string;

    /**
     * Entry type:
     * 
     * - {@link DIRECTORY}
     * - {@link DOCUMENT}
     * - {@link ROOT}
     */
    type: TypeEnum;

    /**
     * Callback to supply binary data.
     *
     * This is valid only for {@link DOCUMENT} entry type.
    */
    binaryProvider?: () => ArrayLike<number>;

    /**
     * Binary data length in byte unit.
     * 
     * Has to match with {@link binaryProvider}'s length.
     * 
     * This is valid only for {@link DOCUMENT} entry type. Otherwise set zero.
     */
    length: number;

    /**
     * The indices to sub entries including {@link DOCUMENT} and {@link DIRECTORY}.
     * 
     * This is valid only for {@link DIRECTORY} entry type.
     */
    children?: number[];
}

interface LiteEntry {
    entry: Entry;

    left: number;
    right: number;
    child: number;

    firstSector: number;
    isMini?: boolean;
}

function RoundUpto4096(num: number) {
    return (num + 4095) & (~4095);
}

function RoundUpto512(bytes: number) {
    return (bytes + 511) & (~511);
}

function RoundUpto64(bytes: number) {
    return (bytes + 63) & (~63);
}

function repeatValue(value: number, count: number): number[] {
    const array = [];
    for (let x = 0; x < count; x++) {
        array.push(value);
    }
    return array;
}

class LiteFat {
    sectors: number[];

    constructor(source) {
        this.sectors = source;
    }

    allocate(count: number): number {
        const first = this.sectors.length;
        for (let x = 0; x < count; x++) {
            const next = (x + 1 === count) ? -2 : first + x + 1;
            this.sectors.push(next);
        }
        return first;
    }

    allocateAs(count: number, value: number): number {
        const first = this.sectors.length;
        for (let x = 0; x < count; x++) {
            this.sectors.push(value);
        }
        return first;
    }

    finalize(boundary: number, value: number): this {
        let num = (boundary - (this.sectors.length % boundary)) % boundary;
        for (; num >= 1; num -= 1) {
            this.sectors.push(value);
        }
        return this;
    }

    count(): number {
        return this.sectors.length;
    }
}

class LiteBurner {
    liteEnts: LiteEntry[];
    fat: LiteFat;
    miniFat: LiteFat;
    array: ArrayBuffer;

    constructor(entries: Entry[]) {
        this.fat = new LiteFat([]);
        this.miniFat = new LiteFat([]);

        this.liteEnts = entries
            .map(
                it => ({
                    entry: it,
                    left: -1,
                    right: -1,
                    child: -1,
                    firstSector: 0,
                    isMini: it.length < 4096,
                })
            );

        this.buildTree(0);


        const entriesFirstSector = this.fat.allocate(RoundUpto512(128 * this.liteEnts.length) / 512);

        for (let liteEnt of this.liteEnts
            .filter(it => true
                && it.entry.type == TypeEnum.DOCUMENT
                && it.isMini === false
            )
        ) {
            liteEnt.firstSector = (liteEnt.entry.length === 0)
                ? -2
                : this.fat.allocate(RoundUpto512(liteEnt.entry.length) / 512);
        }

        for (let liteEnt of this.liteEnts
            .filter(it => true
                && it.entry.type == TypeEnum.DOCUMENT
                && it.isMini === true
            )
        ) {
            liteEnt.firstSector = (liteEnt.entry.length === 0)
                ? -2
                : this.miniFat.allocate(RoundUpto64(liteEnt.entry.length) / 64);
        }

        const numMiniFatSectors = RoundUpto512(4 * this.miniFat.count()) / 512;
        const firstMiniFatSector = (numMiniFatSectors !== 0)
            ? this.fat.allocate(numMiniFatSectors)
            : -2;

        const bytesMiniFat = 64 * this.miniFat.count();

        const firstMiniDataSector = this.fat.allocate(RoundUpto512(bytesMiniFat) / 512);

        this.liteEnts[0].firstSector = firstMiniDataSector;

        const firstFatSector = this.fat.allocateAs(RoundUpto512(4 * (this.fat.count() + this.fat.count() / 128 + this.fat.count() / (128 * 109))) / 512, -3);
        const numFatSectors = this.fat.count() - firstFatSector;

        const numDifatSectors = (numFatSectors > 109)
            ? RoundUpto512(4 * (numFatSectors - 109)) / 512
            : 0;

        const firstDifatSector = (numDifatSectors !== 0)
            ? this.fat.allocateAs(numDifatSectors, -4)
            : -2;

        const array = new ArrayBuffer(512 * (1 + this.fat.count()));
        const ds = new DataStream(array, 0, DataStream.LITTLE_ENDIAN);
        ds.dynamicSize = false;

        this.miniFat.finalize(512 / 4, -1);

        const difat1 = [];
        const difat2 = [];

        {
            for (let x = 0; x < numFatSectors; x++) {
                ((x < 109) ? difat1 : difat2).push(firstFatSector + x);
            }
        }

        // header

        {
            ds.seek(0);
            ds.writeUint8Array(CONST.FILE_HEADER);
            ds.seek(0x18);
            ds.writeUint16(0x3E); //ushort MinorVersion
            ds.writeUint16(0x03); //ushort MajorVersion
            ds.writeUint16(0xFFFE); //ushort ByteOrder
            ds.writeUint16(9); //ushort SectorShift
            ds.writeUint16(6); //ushort MiniSectorShift

            ds.seek(0x2C);
            ds.writeInt32(numFatSectors); //int32 NumberOfFATSectors
            ds.writeInt32(entriesFirstSector); //int32 FirstDirectorySectorLocation

            ds.seek(0x38);
            ds.writeInt32(4096); //int32 MiniStreamCutoffSize
            ds.writeInt32(firstMiniFatSector); //int32 FirstMiniFATSectorLocation
            ds.writeInt32(numMiniFatSectors); //int32 NumberOfMiniFATSectors
            ds.writeInt32(firstDifatSector); //int32 FirstDIFATSectorLocation
            ds.writeInt32(numDifatSectors); //int32 NumberOfDIFATSectors

            let x = 0;
            for (; x < difat1.length; x++) {
                ds.writeInt32(difat1[x]); //int32 DIFAT[x]
            }
            for (; x < 109; x++) {
                ds.writeInt32(-1); //int32 DIFAT[x]
            }
        }

        // entries

        for (let x = 0; x < this.liteEnts.length; x++) {
            const liteEnt = this.liteEnts[x];
            const pos = 512 * (1 + entriesFirstSector) + 128 * x;

            ds.seek(pos);
            ds.writeUCS2String(liteEnt.entry.name, null, null);
            const numBytesName = ds.position - pos;

            ds.seek(pos + 0x40);
            ds.writeUint16(Math.min(64, numBytesName + 2));
            ds.writeUint8(liteEnt.entry.type);
            ds.writeUint8((x === 0) ? 0 : 1);
            ds.writeInt32(liteEnt.left);
            ds.writeInt32(liteEnt.right);
            ds.writeInt32(liteEnt.child);

            if (x === 0) {
                ds.seek(pos + 0x50);
                ds.writeUint8Array([0x0B, 0x0D, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x46]);
            }

            const length = (x === 0)
                ? bytesMiniFat
                : liteEnt.entry.length;
            const firstSector = (length !== 0)
                ? liteEnt.firstSector
                : (liteEnt.entry.type === TypeEnum.DIRECTORY ? 0 : -2);

            ds.seek(pos + 0x74);
            ds.writeInt32(firstSector);
            ds.writeInt32(length);
        }

        for (let liteEnt of this.liteEnts
            .filter(it => true
                && it.entry.type == TypeEnum.DOCUMENT
                && it.isMini === false
            )
        ) {
            const bytes = liteEnt.entry.binaryProvider();
            ds.seek(512 * (1 + liteEnt.firstSector));
            ds.writeUint8Array(bytes);
        }

        for (let liteEnt of this.liteEnts
            .filter(it => true
                && it.entry.type == TypeEnum.DOCUMENT
                && it.isMini === true
            )
        ) {
            const bytes = liteEnt.entry.binaryProvider();
            ds.seek(512 * (1 + firstMiniDataSector) + 64 * liteEnt.firstSector);
            ds.writeUint8Array(bytes);
        }

        // minifat

        ds.seek(512 * (1 + firstMiniFatSector));
        ds.writeInt32Array(this.miniFat.sectors);

        // fat

        this.fat.finalize(512 / 4, -1);

        ds.seek(512 * (1 + firstFatSector));
        ds.writeInt32Array(this.fat.sectors);

        // difat

        if (numDifatSectors >= 1) {
            ds.seek(512 * (1 + firstDifatSector));
            ds.writeInt32Array(difat2);
        }

        this.array = array;
    }

    /**
     * CFBF dedicated name comparer
     * 
     * - At first compare UTF-16 length.
     * - Then compare upper cased UTF-16 string.
     */
    private compareName(a: string, b: string): number {
        let t = a.length - b.length;
        if (t === 0) {
            const x = a.toUpperCase();
            const y = b.toUpperCase();
            if (x > y) {
                t = 1;
            }
            else if (x < y) {
                t = -1;
            }
        }
        return t;
    }

    private buildTree(dirIndex: number) {
        const { liteEnts } = this;
        const liteEntry = liteEnts[dirIndex];

        if (liteEntry.entry.type === TypeEnum.DOCUMENT) {
            throw new Error("It must be a storage!");
        }

        const children = liteEntry.entry.children.concat();
        if (children.length >= 1) {
            children.sort(
                (a, b) => {
                    return this.compareName(
                        liteEnts[a].entry.name,
                        liteEnts[b].entry.name
                    );
                }
            );

            liteEntry.child = children[0];

            for (let x = 0; x < children.length - 1; x++) {
                liteEnts[children[x]].right = children[x + 1];
            }

            for (let subIndex of children
                .filter(it => liteEnts[it].entry.type === TypeEnum.DIRECTORY)
            ) {
                this.buildTree(subIndex);
            }
        }
    }
}

/**
 * Burn CFBF file on the fly.
 * 
 * CFBF = Compound File Binary Format
 * 
 * @param entries The flattened (not tree) entries starting with `Root Entry`.
 * @returns The binary.
 */
export function burn(entries: Entry[]): Uint8Array {
    return new Uint8Array(new LiteBurner(entries).array);
}
