import DataStream from "./DataStream";
import { arraysEqual } from "./utils";
import CONST from './const'

/**
 * `Object Type` in `2.6.1 Compound File Directory Entry`
 * 
 * See also: [[MS-CFB]: Compound File Directory Entry | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/60fe8611-66c3-496b-b70d-a504c94c9ace)
 */
export enum TypeEnum {
  /**
   * `Storage Object`
   * 
   * storage object: An object in a compound file that is analogous to a file system directory. The parent object of a storage object must be another storage object or the root storage object.
   * 
   * See also:
   * 
   * - [[MS-CFB]: Other Directory Entries | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/b37413bb-f3ef-4adc-b18e-29bddd62c26e)
   * - [[MS-CFB]: Glossary | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/59ccb2ef-1ce5-41e3-bc30-075dea759d0a#gt_c3ddf892-3f55-4561-8804-20325dbc8fba)
   */
  DIRECTORY = 1,

  /**
   * `Stream Object`
   * 
   * - stream object: An object in a compound file that is analogous to a file system file. The parent object of a stream object must be a storage object or the root storage object.
   * 
   * See also:
   * - [[MS-CFB]: Compound File User-Defined Data Sectors | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/b089deda-be20-4b4a-aad5-fbe68bb19672)
   * - [[MS-CFB]: Glossary | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/59ccb2ef-1ce5-41e3-bc30-075dea759d0a#gt_9f598e1c-0d65-4845-8f06-8d50f7a32fd5)
   */
  DOCUMENT = 2,

  /**
   * `Root Storage Object`
   * 
   * - root storage object: A storage object in a compound file that must be accessed before any other storage objects and stream objects are referenced. It is the uppermost parent object in the storage object and stream object hierarchy.
   * 
   * See also:
   * - [[MS-CFB]: Root Directory Entry | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/026fde6e-143d-41bf-a7da-c08b2130d50e)
   * - [[MS-CFB]: Glossary | Microsoft Docs](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/59ccb2ef-1ce5-41e3-bc30-075dea759d0a#gt_d49237e3-04dd-4823-a0a5-5e23f750a5f4)
   */
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

/**
 * The reader access to CFBF storage
 */
export interface CFolder {
  /**
   * CFBF entry index.
   */
  dataId: number;

  /**
   * Storage name.
   */
  name: string;

  /**
   * Sub folders.
   */
  subFolders(): CFolder[];

  /**
   * Sub name set of streams.
   */
  fileNames(): string[];

  /**
   * Sub read access set of stream.
   */
  fileNameSets(): CFileSet[];

  /**
   * Read stream as binary to memory.
   */
  readFile(fileName: string): Uint8Array | null;
}

/**
 * The reader access to CFBF stream
 */
export interface CFileSet {
  /**
   * CFBF entry index.
   */
  dataId: number;

  /**
   * Stream name.
   */
  name: string;

  /**
   * The stream binary length in byte unit.
   */
  length: number;

  /**
   * Read stream contents and get memory data.
   */
  provider: () => Uint8Array;
}

/**
 * Original msg file (CFBF) reader which was implemented in MsgReader.
 */
export class Reader {
  private ds: DataStream;
  private bigBlockSize: number;
  private bigBlockLength: number;
  private xBlockLength: number;
  private batCount: number;
  private propertyStart: number;
  private sbatStart: number;
  private sbatCount: number;
  private xbatStart: number;
  private xbatCount: number;

  private batData?: number[];
  private sbatData?: number[];
  private propertyData?: Property[];

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

  /**
   * Parse msg file.
   */
  parse(): void {
    this.headerData();
    this.batData = this.batDataReader();
    if (this.xbatCount > 0) {
      this.xbatDataReader();
    }
    this.sbatData = this.sbatDataReader();
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

  private getBlockValueAt(offset: number, index: number): number {
    const startOffset = this.getBlockOffsetAt(offset);
    this.ds.seek(startOffset + 4 * index);
    return this.ds.readInt32();
  }

  private getNextBlockInner(offset: number, blockOffsetData: number[]): number {
    const currentBlock = Math.floor(offset / this.bigBlockLength);
    const currentBlockIndex = offset % this.bigBlockLength;

    const startBlockOffset = blockOffsetData[currentBlock];
    if (typeof startBlockOffset === "undefined") {
      return CONST.MSG.END_OF_CHAIN;
    }

    return this.getBlockValueAt(startBlockOffset, currentBlockIndex);
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
    if (!fieldProperty.sizeBlock) {
      return new Uint8Array(0);
    }
    else if (fieldProperty.sizeBlock < CONST.MSG.BIG_BLOCK_MIN_DOC_SIZE) {
      const chain = this.getChainByBlockSmall(fieldProperty);
      if (chain.length == 1) {
        return this.readDataByBlockSmall(fieldProperty.startBlock, fieldProperty.sizeBlock);
      } else if (chain.length > 1) {
        return this.readChainDataByBlockSmall(fieldProperty, chain);
      }
      return new Uint8Array(0);
    }
    else {
      let nextBlock = fieldProperty.startBlock;
      let remaining = fieldProperty.sizeBlock;
      let position = 0;
      const resultData = new Uint8Array(fieldProperty.sizeBlock);
      while (1 <= remaining) {
        const blockStartOffset = this.getBlockOffsetAt(nextBlock);
        this.ds.seek(blockStartOffset);
        const partSize = Math.min(remaining, this.bigBlockSize);
        const part = this.ds.readUint8Array(partSize);
        resultData.set(part, position);
        position += partSize;
        remaining -= partSize;
        nextBlock = this.getNextBlock(nextBlock);
      }
      return resultData;
    }
  }

  /**
   * Get binary from document in CFBF.
   * 
   * @param index entry index
   * @returns binary
   * @internal
   */
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

  /**
   * Get reader access to CFBF (valid after successful call of {@link parse}).
   * 
   * @returns root folder
   */
  rootFolder(): CFolder {
    return this.folderOf(0);
  }
}
