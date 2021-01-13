
function stringToTypedArray1(str) {
  const len = str.length;
  const codes = [];
  for (let i = 0; i < len; i++) {
    codes.push(str.charCodeAt(i));
  }
  return Uint8Array.from(codes);
}

function stringToTypedArray2(str) {
  const len = str.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}

function stringToTypedArray3(str) {
  const view = new Uint8Array(str.length);
  for (let i = 0; i < view.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}

function stringToTypedArray4(str) {
  const len = str.length;
  const view = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    view[i] = str.charCodeAt(i);
  }
  return view;
}

module.exports = {
  stringToTypedArray1,
  stringToTypedArray2,
  stringToTypedArray3,
  stringToTypedArray4
}
