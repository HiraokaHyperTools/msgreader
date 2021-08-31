import { stringify } from "querystring";

/**
 * @internal
 */
export function arraysEqual(a: ArrayLike<any>, b: ArrayLike<any>): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * @internal
 */
export function uInt2int(data: number[]): number[] {
  var result = new Array(data.length);
  for (var i = 0; i < data.length; i++) {
    result[i] = data[i] << 24 >> 24;
  }
  return result;
}

/**
 * @internal
 */
export function toHexStr(value: number, padding: number): string {
  let text = "";
  while (value != 0) {
    text = "0123456789abcdef"[value & 15] + text;
    value >>= 4;
    text = "0123456789abcdef"[value & 15] + text;
    value >>= 4;
  }
  while (text.length < padding) {
    text = "0" + text;
  }
  return text;
}

const hex = "0123456789abcdef";

/**
 * byte to lower case hex string
 * 
 * @internal
 */
export function toHex1(value: number): string {
  return hex[(value >> 4) & 15]
    + hex[(value) & 15];
}

/**
 * little uint16 to lower case hex string
 * 
 * @internal
 */
export function toHex2(value: number): string {
  return hex[(value >> 12) & 15]
    + hex[(value >> 8) & 15]
    + hex[(value >> 4) & 15]
    + hex[(value) & 15];
}

/**
 * little uint32 to lower case hex string
 * 
 * @internal
 */
export function toHex4(value: number): string {
  return hex[(value >> 28) & 15]
    + hex[(value >> 24) & 15]
    + hex[(value >> 20) & 15]
    + hex[(value >> 16) & 15]
    + hex[(value >> 12) & 15]
    + hex[(value >> 8) & 15]
    + hex[(value >> 4) & 15]
    + hex[(value) & 15];
}

/**
 * Variant 2 UUIDs, historically used in Microsoft's COM/OLE libraries, 
 * use a mixed-endian format, whereby the first three components of the UUID are little-endian,
 * and the last two are big-endian. 
 * For example, `00112233-4455-6677-8899-aabbccddeeff` is encoded as the bytes 
 * `33 22 11 00 55 44 77 66 88 99 aa bb cc dd ee ff`.
 * 
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 * @internal
 */
export function msftUuidStringify(array: ArrayLike<number>, offset: number): string {
  return ""
    + toHex1(array[offset + 3])
    + toHex1(array[offset + 2])
    + toHex1(array[offset + 1])
    + toHex1(array[offset + 0])
    + "-"
    + toHex1(array[offset + 5])
    + toHex1(array[offset + 4])
    + "-"
    + toHex1(array[offset + 7])
    + toHex1(array[offset + 6])
    + "-"
    + toHex1(array[offset + 8])
    + toHex1(array[offset + 9])
    + "-"
    + toHex1(array[offset + 10])
    + toHex1(array[offset + 11])
    + toHex1(array[offset + 12])
    + toHex1(array[offset + 13])
    + toHex1(array[offset + 14])
    + toHex1(array[offset + 15])
    ;
}
