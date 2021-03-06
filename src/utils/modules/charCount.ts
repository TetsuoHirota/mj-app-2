export const charCount = (value: string) => {
  let length = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (
      (c >= 0x0 && c < 0x81) ||
      c === 0xf8f0 ||
      (c >= 0xff61 && c < 0xffa0) ||
      (c >= 0xf8f1 && c < 0xf8f4)
    ) {
      length += 1;
    } else {
      length += 2;
    }
  }
  return length;
};
