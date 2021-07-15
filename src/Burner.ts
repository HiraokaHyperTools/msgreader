import { TypeEnum } from "./Reader";
import { CompoundFile, StorageDirectoryEntry } from 'compound-binary-file-js';

export interface Entry {
    name: string;
    type: TypeEnum;

    binaryProvider?: () => Iterable<number> | ArrayLike<number>;

    children?: number[];
}

function burnTo(entries: Entry[], index: number, storage: StorageDirectoryEntry) {
    const { children } = entries[index];
    if (children) {
        for (let subIndex of children) {
            const entry = entries[subIndex];
            if (0) { }
            else if (entry.type === TypeEnum.DOCUMENT) {
                const { binaryProvider } = entry;
                storage.addStream(
                    entry.name,
                    (binaryProvider !== undefined)
                        ? Array.from(binaryProvider())
                        : []
                );
            }
            else if (entry.type === TypeEnum.DIRECTORY) {
                const subStorage = storage.addStorage(entry.name);
                burnTo(entries, subIndex, subStorage);
            }
        }
    }
}

export function burn(entries: Entry[]): Uint8Array {
    const compoundFile = new CompoundFile();

    burnTo(entries, 0, compoundFile.getRootStorage());

    return Buffer.from(compoundFile.asBytes());
}
