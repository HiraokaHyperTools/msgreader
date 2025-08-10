import DataStream from "./DataStream";
import { arraysEqual } from "./utils";
import CONST from './const'
import { TypeEnum } from "./Reader";
import iconv from 'iconv-lite';

/**
 * Read a block from file, located at position in the file
 */
export type ReadFile = (view: Uint8Array, position: number) => Promise<number>;

/**
 * Write a block to file, located at position in the file
 */
export type WriteFile = (view: Uint8Array, position: number) => Promise<void>;

/**
 * A CFBF directory entry
 */
export interface CEntry {
  /**
   * File index in directory entry
   */
  id: number;

  /**
   * Name of file or directory
   */
  name: string;

  /**
   * Object type
   */
  type: TypeEnum;

  /**
   * Not used normally
   */
  clsid: Uint8Array;

  /**
   * Creation time (Windows FILETIME structure, 8 bytes)
   */
  creationTime: Uint8Array;

  /**
   * Modified time (Windows FILETIME structure, 8 bytes)
   */
  modifiedTime: Uint8Array;
}

export interface CStore {
  listEntries(parentId: number): Promise<CEntry[]>;
  deleteEntry(id: number): Promise<void>;
  addFile(name: String): Promise<number>;
  addFolder(name: String): Promise<number>;
  readFile(id: number): Promise<ReadFile>;
  writeFile(id: number, readFile: ReadFile): Promise<void>;
  flush(): Promise<void>;
}

function subArrayOf(buf: Uint8Array, start: number, size: number): Uint8Array {
  return new Uint8Array(buf.buffer, buf.byteOffset + start, size);
}

export async function createNew(read: ReadFile, write: WriteFile): Promise<CStore> {
  const largeBuf = new ArrayBuffer(512 * 3);
  {
    const header = new Uint8Array(largeBuf, 0, 512);
    const headerView = new DataView(largeBuf, 0, 512);
    subArrayOf(header, CONST.HEADER.HeaderSignature, 8).set(CONST.FILE_HEADER);
    subArrayOf(header, CONST.HEADER.HeaderCLSID, 16).fill(0);
    headerView.setUint16(CONST.HEADER.MinorVersion, 0x003E, true);
    headerView.setUint16(CONST.HEADER.MajorVersion, 0x0003, true);
    headerView.setUint16(CONST.HEADER.ByteOrder, 0xFFFE, true);
    headerView.setUint16(CONST.HEADER.SectorShift, 0x0009, true);
    headerView.setUint16(CONST.HEADER.MiniSectorShift, 0x0006, true);
    subArrayOf(header, CONST.HEADER.Reserved, 6).fill(0);
    headerView.setUint32(CONST.HEADER.NumberofDirectorySectors, 0, true);
    headerView.setUint32(CONST.HEADER.NumberofFATSectors, 1, true);
    headerView.setUint32(CONST.HEADER.FirstDirectorySectorLocation, 1, true);
    headerView.setUint32(CONST.HEADER.TransactionSignatureNumber, 0, true);
    headerView.setUint32(CONST.HEADER.MiniStreamCutoffSize, 4096, true);
    headerView.setUint32(CONST.HEADER.FirstMiniFATSectorLocation, 0xFFFFFFFE, true);
    headerView.setUint32(CONST.HEADER.NumberofMiniFATSectors, 0, true);
    headerView.setUint32(CONST.HEADER.FirstDIFATSectorLocation, 0xFFFFFFFE, true);
    headerView.setUint32(CONST.HEADER.NumberofDIFATSectors, 0, true);
    subArrayOf(header, CONST.HEADER.DIFAT, 436).fill(0xFF);
    headerView.setUint32(CONST.HEADER.DIFAT + 4 * 0, 0, true);

    await write(new Uint8Array(headerView.buffer, headerView.byteOffset, 512), 0);
  }
  {
    const fat = new Uint8Array(largeBuf, 512, 512);
    const fatView = new DataView(largeBuf, 512, 512);
    fat.fill(0xFF); // Mark as unused sectors
    fatView.setUint32(4 * 0, 0xFFFFFFFD, true); // FAT sector (this)
    fatView.setUint32(4 * 1, 0xFFFFFFFE, true); // Directory entry sector
    await write(fat, 512);
  }
  {
    const dir = new Uint8Array(largeBuf, 512 * 2, 512);
    const dirView = new DataView(largeBuf, 512 * 2, 512);
    const nameBuf = iconv.encode("Root Entry\0", 'utf16le');
    subArrayOf(dir, 0, 64).set(nameBuf);
    dirView.setUint16(CONST.MSG.PROP.NAME_SIZE_OFFSET, nameBuf.byteLength, true);
    dirView.setUint8(CONST.MSG.PROP.TYPE_OFFSET, CONST.MSG.PROP.TYPE_ENUM.ROOT);
    dirView.setUint32(CONST.MSG.PROP.PREVIOUS_PROPERTY_OFFSET, 0xFFFFFFFF, true);
    dirView.setUint32(CONST.MSG.PROP.NEXT_PROPERTY_OFFSET, 0xFFFFFFFF, true);
    dirView.setUint32(CONST.MSG.PROP.CHILD_PROPERTY_OFFSET, 0xFFFFFFFF, true);
    subArrayOf(dir, 0x64, 8).fill(0);
    subArrayOf(dir, 0x6C, 8).fill(0);
    dirView.setUint32(CONST.MSG.PROP.START_BLOCK_OFFSET, 0xFFFFFFFE, true);
    dirView.setUint32(CONST.MSG.PROP.SIZE_OFFSET, 0, true);

    await write(dir, 512 * 2);
  }

  return await open(read, write);
}

export async function open(read: ReadFile, write: WriteFile): Promise<CStore> {
  async function mustRead(view: Uint8Array, position: number): Promise<number> {
    const readActually = await read(view, position);
    if (readActually != view.byteLength) {
      throw new Error('Read failed');
    }
    return readActually;
  }

  const headerBuf = new ArrayBuffer(512);
  const header = new Uint8Array(headerBuf);
  await mustRead(header, 0);
  if (false
    || header[0] != 0xD0
    || header[1] != 0xCF
    || header[2] != 0x11
    || header[3] != 0xE0
    || header[4] != 0xA1
    || header[5] != 0xB1
    || header[6] != 0x1A
    || header[7] != 0xE1
  ) {
    throw new Error('Invalid header signature');
  }
  const headerView = new DataView(headerBuf);
  if (headerView.getUint16(CONST.HEADER.MajorVersion, true) != 3) {
    throw new Error('Invalid major version');
  }
  if (headerView.getUint16(CONST.HEADER.ByteOrder, true) != 0xFFFE) {
    throw new Error('Invalid byte order');
  }
  if (headerView.getUint16(CONST.HEADER.SectorShift, true) != 0x0009) {
    throw new Error('Invalid sector size must be 512');
  }
  if (headerView.getUint16(CONST.HEADER.MiniSectorShift, true) != 0x0006) {
    throw new Error('Invalid mini sector size must be 64');
  }

  function createGetNextSector(): (currentSector: number) => Promise<number> {
    const tempBuf = new ArrayBuffer(512);
    const tempView = new DataView(tempBuf);
    const tempArray = new Uint8Array(tempBuf, 0, 4);

    return async (currentSector: number): Promise<number> => {
      // 0-126
      // 127-254
      // 255-510
      if (currentSector < 127 * 109) {
        const difatIndex = (currentSector / 127) & 127;
        if ((await read(tempArray, CONST.HEADER.DIFAT + 4 * difatIndex)) != 4) {
          throw new Error('Read failed');
        }
        const fatSector = tempView.getUint32(0, true);
        if (fatSector == 0xFFFFFFFE) {
          throw new Error('End of chain');
        }
        const fatIndex = currentSector % 127;
        if ((await read(tempArray, 512 * (1 + fatSector) + 4 * fatIndex)) != 4) {
          throw new Error('Read failed');
        }
        return tempView.getUint32(0, true);
      }
      else {
        throw new Error('Not implemented');
      }
    };
  }

  async function readOfSector(firstSector: number, position: number, buf: Uint8Array): Promise<void> {
    let remaining = buf.byteLength;
    let offset = 0;
    let currentSector = firstSector;
    const getNextSector = createGetNextSector();
    while (1 <= remaining) {
      if (position < 512) {
        const readSize = Math.min(512 - position, remaining);
        await mustRead(
          new Uint8Array(
            buf.buffer,
            buf.byteOffset + offset,
            readSize
          ),
          512 * (1 + currentSector)
        );
        remaining -= readSize;
        offset += readSize;
      }

      currentSector = await getNextSector(currentSector);

      position -= 512;
    }
  }

  return {
    async listEntries(parentId: number): Promise<CEntry[]> {
      const tempBuf = new ArrayBuffer(128);
      const temp4 = new Uint8Array(tempBuf, 0, 4);
      const temp128 = new Uint8Array(tempBuf, 0, 128);
      const tempView = new DataView(tempBuf);
      await mustRead(temp4, CONST.HEADER.FirstDirectorySectorLocation);
      const firstSector = tempView.getUint32(0, true);
      await readOfSector(firstSector, 128 * parentId + CONST.MSG.PROP.CHILD_PROPERTY_OFFSET, temp4);
      const childIndex = tempView.getUint32(0, true);
      const list: CEntry[] = [];

      await readOfSector(firstSector, 128 * childIndex, temp128);

      return list;
    },
    async deleteEntry(id: number): Promise<void> {
    },
    async addFile(name: String): Promise<number> {
      return 0;
    },
    async addFolder(name: String): Promise<number> {
      return 0;
    },
    async readFile(id: number): Promise<ReadFile> {
      return async (view: Uint8Array, position: number) => {
        return 0;
      };
    },
    async writeFile(id: number, readFile: ReadFile): Promise<void> {
    },
    async flush(): Promise<void> {
    },
  };
}
