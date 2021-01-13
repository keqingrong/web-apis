/**
 * 作为普通数组处理，处理完生成 TypedArray
 */
function stringToTypedArray1(str) {
  const len = str.length;
  const buffer = [];
  let isOutOfUint8 = false;
  for (let i = 0; i < len; i++) {
    // [0, 65535]
    let code = str.charCodeAt(i);
    if (!isOutOfUint8 && code >= 2 ** 8) {
      isOutOfUint8 = true;
    }
    buffer.push(str.charCodeAt(i));
  }
  if (isOutOfUint8) {
    // 65535 (0xFFFF)
    return Uint16Array.from(buffer);
  } else {
    // 255 (0xFF)
    return Uint8Array.from(buffer);
  }
}

/**
 * 直接生成 TypedArray
 */
function stringToTypedArray2(str) {
  const len = str.length;
  let view = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (code >= 2 ** 8 && view instanceof Uint8Array) {
      const viewExtend = new Uint16Array(view);
      viewExtend.set(view.slice(0, i), 0);
      view = viewExtend;
    }
    view[i] = code;
  }
  return view;
}

/**
 * 提前创建 ArrayBuffer 分配连续内存，再使用 TypedArray 处理
 */
function stringToTypedArray3(str) {
  const len = str.length;
  const buffer = new ArrayBuffer(len * 2);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (code >= 2 ** 8 && view instanceof Uint8Array) {
      const viewExtend = new Uint16Array(buffer);
      viewExtend.set(view.slice(0, i), 0);
      view = viewExtend;
    }
    view[i] = code;
  }
  return view;
}

/**
 * 使用 subarray() 代替 slice()，复用 ArrayBuffer
 */
function stringToTypedArray4(str) {
  const len = str.length;
  const buffer = new ArrayBuffer(len * 2);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (code >= 2 ** 8 && view instanceof Uint8Array) {
      const viewExtend = new Uint16Array(buffer);
      viewExtend.set(view.subarray(0, i), 0);
      view = viewExtend;
    }
    view[i] = code;
  }
  return view;
}

/**
 * 减少判断次数
 */
function stringToTypedArray5(str) {
  const len = str.length;
  const buffer = new ArrayBuffer(len * 2);
  let view = new Uint8Array(buffer);
  let hasExtend = false;
  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (!hasExtend && code >= 2 ** 8 && view instanceof Uint8Array) {
      hasExtend = true;
      let viewExtend = new Uint16Array(buffer);
      viewExtend.set(view.subarray(0, i), 0);
      view = viewExtend;
    }
    view[i] = code;
  }
  return view;
}

module.exports = {
  stringToTypedArray1,
  stringToTypedArray2,
  stringToTypedArray3,
  stringToTypedArray4,
  stringToTypedArray5
};
