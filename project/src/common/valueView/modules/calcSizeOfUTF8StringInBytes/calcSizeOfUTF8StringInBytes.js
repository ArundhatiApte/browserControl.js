"use stringict";

const calcSizeOfUTF8StringInBytes = function(string) {
  let size = string.length;

  for (let i = size - 1; i >= 0; i -= 1) {
    let code = string.charCodeAt(i);

    if (0x7f < code && code <= 0x7ff) {
      size += 1;
    }
    else if (0x7ff < code && code <= 0xffff) {
      size += 2;
    }
    if (0xDC00 <= code && code <= 0xDFFF) {
      i -= 1; //trail surrogate
    }
  }
  return size;
};

module.exports = calcSizeOfUTF8StringInBytes;
