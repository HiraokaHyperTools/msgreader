import DataStream from "./DataStream";
import { arraysEqual } from "./utils";
import CONST from './const'

/**
 * CONST.MSG.PROP.TYPE_ENUM
 */
export enum TypeEnum {
    DIRECTORY = 1,
    DOCUMENT = 2,
    ROOT = 5,
}

export interface Property {
    type: TypeEnum;
    name: string;
    previousProperty: number;
    nextProperty: number;
    childProperty: number;
    startBlock: number;
    sizeBlock: number;
    children?: number[];
}

export interface CFolder {
    dataId: number;
    name: string;

    subFolders(): CFolder[];
    fileNames(): string[];
    fileNameSets(): CFileSet[];
    readFile(fileName: string): Uint8Array | null;
}

export interface CFileSet {
    dataId: number;
    name: string;
    length: number;

    provider: () => Uint8Array;
}

/**
 * Original CFBF reader implementation existed in MsgReader.
 */
export class Reader {
    ds: DataStream;
    bigBlockSize: number;
    bigBlockLength: number;
    xBlockLength: number;
    batCount: number;
    propertyStart: number;
    sbatStart: number;
    sbatCount: number;
    xbatStart: number;
    xbatCount: number;

    batData?: number[];
    sbatData?: number[];
    propertyData?: Property[];

    constructor(arrayBuffer: ArrayBuffer | DataView) {
        this.ds = new DataStream(arrayBuffer, 0, DataStream.LITTLE_ENDIAN);
    }

    isMSGFile(): boolean {
        this.ds.seek(0);
        return arraysEqual(CONST.FILE_HEADER, this.ds.readInt8Array(CONST.FILE_HEADER.length));
    }

    private headerData(): void {
        this.bigBlockSize = this.ds.readByte(30) == CONST.MSG.L_BIG_BLOCK_MARK ? CONST.MSG.L_BIG_BLOCK_SIZE : CONST.MSG.S_BIG_BLOCK_SIZE;
        this.bigBlockLength = this.bigBlockSize / 4;

        // system data
        this.xBlockLength = this.bigBlockLength - 1;

        // header data
        this.batCount = this.ds.readInt(CONST.MSG.HEADER.BAT_COUNT_OFFSET);
        this.propertyStart = this.ds.readInt(CONST.MSG.HEADER.PROPERTY_START_OFFSET);
        this.sbatStart = this.ds.readInt(CONST.MSG.HEADER.SBAT_START_OFFSET);
        this.sbatCount = this.ds.readInt(CONST.MSG.HEADER.SBAT_COUNT_OFFSET);
        this.xbatStart = this.ds.readInt(CONST.MSG.HEADER.XBAT_START_OFFSET);
        this.xbatCount = this.ds.readInt(CONST.MSG.HEADER.XBAT_COUNT_OFFSET);
    }

    private convertName(offset: number): string {
        const nameLength = this.ds.readShort(offset + CONST.MSG.PROP.NAME_SIZE_OFFSET);
        if (nameLength < 1) {
            return '';
        } else {
            return this.ds.readStringAt(offset, nameLength / 2).split('\0')[0];
        }
    }

    private convertProperty(offset: number): Property {
        return {
            type: this.ds.readByte(offset + CONST.MSG.PROP.TYPE_OFFSET),
            name: this.convertName(offset),
            // hierarchy
            previousProperty: this.ds.readInt(offset + CONST.MSG.PROP.PREVIOUS_PROPERTY_OFFSET),
            nextProperty: this.ds.readInt(offset + CONST.MSG.PROP.NEXT_PROPERTY_OFFSET),
            childProperty: this.ds.readInt(offset + CONST.MSG.PROP.CHILD_PROPERTY_OFFSET),
            // data offset
            startBlock: this.ds.readInt(offset + CONST.MSG.PROP.START_BLOCK_OFFSET),
            sizeBlock: this.ds.readInt(offset + CONST.MSG.PROP.SIZE_OFFSET),
        };
    }

    private convertBlockToProperties(propertyBlockOffset: number, props: Property[]): void {
        const propertyCount = this.bigBlockSize / CONST.MSG.PROP.PROPERTY_SIZE;
        let propertyOffset = this.getBlockOffsetAt(propertyBlockOffset);

        for (let i = 0; i < propertyCount; i++) {
            if (this.ds.byteLength < propertyOffset + CONST.MSG.PROP.TYPE_OFFSET) {
                break;
            }

            const propertyType = this.ds.readByte(propertyOffset + CONST.MSG.PROP.TYPE_OFFSET);
            switch (propertyType) {
                case CONST.MSG.PROP.TYPE_ENUM.ROOT:
                case CONST.MSG.PROP.TYPE_ENUM.DIRECTORY:
                case CONST.MSG.PROP.TYPE_ENUM.DOCUMENT:
                    props.push(this.convertProperty(propertyOffset));
                    break;
            }

            propertyOffset += CONST.MSG.PROP.PROPERTY_SIZE;
        }
    }

    private createPropertyHierarchy(props: Property[], nodeProperty: Property): void {
        if (!nodeProperty || nodeProperty.childProperty == CONST.MSG.PROP.NO_INDEX) {
            return;
        }
        nodeProperty.children = [];

        const children = [nodeProperty.childProperty];
        while (children.length != 0) {
            const currentIndex = children.shift();
            const current = props[currentIndex];
            if (current == null) {
                continue;
            }
            nodeProperty.children.push(currentIndex);

            if (current.type == CONST.MSG.PROP.TYPE_ENUM.DIRECTORY) {
                this.createPropertyHierarchy(props, current);
            }
            if (current.previousProperty != CONST.MSG.PROP.NO_INDEX) {
                children.push(current.previousProperty);
            }
            if (current.nextProperty != CONST.MSG.PROP.NO_INDEX) {
                children.push(current.nextProperty);
            }
        }
    }

    private propertyDataReader(propertyStart: number): Property[] {
        const props: Property[] = [];

        let currentOffset = propertyStart;

        while (currentOffset != CONST.MSG.END_OF_CHAIN) {
            this.convertBlockToProperties(currentOffset, props);
            currentOffset = this.getNextBlock(currentOffset);
        }
        this.createPropertyHierarchy(props, props[0]);
        return props;
    }

    parse(): void {
        this.headerData();
        this.batData = this.batDataReader();
        this.sbatData = this.sbatDataReader();
        if (this.xbatCount > 0) {
            this.xbatDataReader();
        }
        this.propertyData = this.propertyDataReader(this.propertyStart);
    }

    private batCountInHeader(): number {
        const maxBatsInHeader = (CONST.MSG.S_BIG_BLOCK_SIZE - CONST.MSG.HEADER.BAT_START_OFFSET) / 4;
        return Math.min(this.batCount, maxBatsInHeader);
    }

    private batDataReader(): number[] {
        const result = new Array(this.batCountInHeader());
        this.ds.seek(CONST.MSG.HEADER.BAT_START_OFFSET);
        for (let i = 0; i < result.length; i++) {
            result[i] = this.ds.readInt32()
        }
        return result;
    }

    private getBlockOffsetAt(offset: number): number {
        return (offset + 1) * this.bigBlockSize;
    }

    private getBlockAt(offset: number): Int32Array {
        const startOffset = this.getBlockOffsetAt(offset);
        this.ds.seek(startOffset);
        return this.ds.readInt32Array(this.bigBlockLength);
    }

    private getNextBlockInner(offset: number, blockOffsetData: number[]): number {
        const currentBlock = Math.floor(offset / this.bigBlockLength);
        const currentBlockIndex = offset % this.bigBlockLength;

        const startBlockOffset = blockOffsetData[currentBlock];
        if (typeof startBlockOffset === "undefined") {
            return CONST.MSG.END_OF_CHAIN;
        }

        return this.getBlockAt(startBlockOffset)[currentBlockIndex];
    }

    private getNextBlock(offset: number): number {
        return this.getNextBlockInner(offset, this.batData);
    }

    private sbatDataReader(): number[] {
        const result = [];
        let startIndex = this.sbatStart;

        for (let i = 0; i < this.sbatCount && startIndex && startIndex != CONST.MSG.END_OF_CHAIN; i++) {
            result.push(startIndex);
            startIndex = this.getNextBlock(startIndex);
        }
        return result;
    }

    private xbatDataReader(): void {
        const batCount = this.batCountInHeader();
        const batCountTotal = this.batCount;
        let remainingBlocks = batCountTotal - batCount;

        let nextBlockAt = this.xbatStart;
        for (let i = 0; i < this.xbatCount; i++) {
            let xBatBlock = this.getBlockAt(nextBlockAt);

            const blocksToProcess = Math.min(remainingBlocks, this.xBlockLength);
            for (let j = 0; j < blocksToProcess; j++) {
                const blockStartAt = xBatBlock[j];
                if (blockStartAt == CONST.MSG.UNUSED_BLOCK || blockStartAt == CONST.MSG.END_OF_CHAIN) {
                    break;
                }
                this.batData.push(blockStartAt);
            }
            remainingBlocks -= blocksToProcess;

            nextBlockAt = xBatBlock[this.xBlockLength];
            if (nextBlockAt == CONST.MSG.UNUSED_BLOCK || nextBlockAt == CONST.MSG.END_OF_CHAIN) {
                break;
            }
        }
    }

    private getNextBlockSmall(offset: number): number {
        return this.getNextBlockInner(offset, this.sbatData);
    }

    private getChainByBlockSmall(fieldProperty: Property): number[] {
        const blockChain = [];
        let nextBlockSmall = fieldProperty.startBlock;
        while (nextBlockSmall != CONST.MSG.END_OF_CHAIN) {
            blockChain.push(nextBlockSmall);
            nextBlockSmall = this.getNextBlockSmall(nextBlockSmall);
        }
        return blockChain;
    }

    private readDataByBlockSmall(startBlock: number, blockSize: number): Uint8Array {
        const byteOffset = startBlock * CONST.MSG.SMALL_BLOCK_SIZE;
        const bigBlockNumber = Math.floor(byteOffset / this.bigBlockSize);
        const bigBlockOffset = byteOffset % this.bigBlockSize;

        const rootProp = this.propertyData[0];

        let nextBlock = rootProp.startBlock;
        for (let i = 0; i < bigBlockNumber; i++) {
            nextBlock = this.getNextBlock(nextBlock);
        }
        const blockStartOffset = this.getBlockOffsetAt(nextBlock);

        this.ds.seek(blockStartOffset + bigBlockOffset);
        return this.ds.readUint8Array(blockSize);
    }

    private readChainDataByBlockSmall(fieldProperty: Property, chain: number[]): Uint8Array {
        let resultData = new Uint8Array(fieldProperty.sizeBlock);

        for (let i = 0, idx = 0; i < chain.length; i++) {
            const data = this.readDataByBlockSmall(chain[i], CONST.MSG.SMALL_BLOCK_SIZE);
            if (resultData.length < idx + data.length) {
                resultData.set(data.subarray(0, resultData.length - idx), idx);
            }
            else {
                resultData.set(data, idx);
            }
            idx += data.length;
        }

        return resultData;
    }

    private readProperty(fieldProperty: Property): Uint8Array {
        if (fieldProperty.sizeBlock < CONST.MSG.BIG_BLOCK_MIN_DOC_SIZE) {
            const chain = this.getChainByBlockSmall(fieldProperty);
            if (chain.length == 1) {
                return this.readDataByBlockSmall(fieldProperty.startBlock, fieldProperty.sizeBlock);
            } else if (chain.length > 1) {
                return this.readChainDataByBlockSmall(fieldProperty, chain);
            }
            return new Uint8Array(0);
        }
        else {
            const offset = this.getBlockOffsetAt(fieldProperty.startBlock);
            this.ds.seek(offset);
            return this.ds.readUint8Array(fieldProperty.sizeBlock);
        }
    }

    readFileOf(index: number): Uint8Array {
        return this.readProperty(this.propertyData[index]);
    }

    private folderOf(index: number): CFolder | null {
        const { propertyData } = this;
        if (!propertyData) {
            return null;
        }
        const folder = propertyData[index];
        return {
            dataId: index,
            name: folder.name,
            fileNames: () => {
                const { children } = folder;
                if (children) {
                    return children
                        .map(subIndex => propertyData[subIndex])
                        .filter(it => it.type === TypeEnum.DOCUMENT)
                        .map(it => it.name);
                }
                return [];
            },
            fileNameSets: () => {
                const { children } = folder;
                if (children) {
                    return children
                        .map(
                            subIndex => ({
                                subIndex,
                                entry: propertyData[subIndex]
                            })
                        )
                        .filter(it => it.entry.type === TypeEnum.DOCUMENT)
                        .map(
                            it => ({
                                name: it.entry.name,
                                length: it.entry.sizeBlock,
                                dataId: it.subIndex,
                                provider: () => this.readProperty(it.entry),
                            })
                        );
                }
                return [];
            },
            subFolders: () => {
                const { children } = folder;
                if (children) {
                    return children
                        .filter(subIndex => propertyData[subIndex].type == TypeEnum.DIRECTORY)
                        .map(subIndex => this.folderOf(subIndex));
                }
                return [];
            },
            readFile: (fileName) => {
                const { children } = folder;
                if (children) {
                    for (let subIndex of children) {
                        const file = propertyData[subIndex];
                        if (file && file.type === TypeEnum.DOCUMENT && file.name === fileName) {
                            return this.readProperty(file);
                        }
                    }
                }
                return null;
            },
        }
    }

    rootFolder(): CFolder {
        return this.folderOf(0);
    }
}
