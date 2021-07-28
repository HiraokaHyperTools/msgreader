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
