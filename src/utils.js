export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function uInt2int(data) {
  var result = new Array(data.length);
  for (var i = 0; i < data.length; i++) {
    result[i] = data[i] << 24 >> 24;
  }
  return result;
}