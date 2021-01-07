/**
 * 将 Blob 或 File 对象处理成 ArrayBuffer
 */
export function readAsArrayBuffer(file: Blob | File) {
  if ('arrayBuffer' in Blob.prototype) {
    return file.arrayBuffer();
  }
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('readAsArrayBuffer 处理失败'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 将 Blob 或 File 对象处理成 Data URL
 */
export function readAsDataURL(file: Blob | File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('readAsDataURL 处理失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 将 Blob 或 File 对象处理成字符串
 * @param file 文件
 * @param encoding 文本编码，如 `UTF-8`
 */
export function readAsText(file: Blob | File, encoding?: string) {
  if ('text' in Blob.prototype) {
    return file.text();
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('readAsText 处理失败'));
    reader.readAsText(file, encoding);
  });
}

/**
 * Latin1 字符串转 TypedArray
 */
export function latin1ToTypedArray(str: string) {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

/**
 * UTF-16 字符串转 TypedArray
 */
export function utf16ToTypedArray(str: string) {
  const arr = new Uint16Array(str.length);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

/**
 * 字符串转 TypedArray
 */
export function stringToTypedArray(str: string) {
  const minUint16Value = 2 ** 8;
  const len = str.length;
  const buffer = new ArrayBuffer(len * 2);
  let view: Uint8Array | Uint16Array = new Uint8Array(buffer);
  let hasExtend = false;
  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (!hasExtend && code >= minUint16Value && view instanceof Uint8Array) {
      hasExtend = true;
      let viewExtend = new Uint16Array(buffer);
      viewExtend.set(view.subarray(0, i), 0);
      view = viewExtend;
    }
    view[i] = code;
  }
  return view;
}

/**
 * 将 ArrayBuffer 对象转换成字符串
 */
export function arrayBufferToString(arrayBuffer: Uint8Array) {
  // TODO: 除了 Uint8Array ，应该真正完整支持 ArrayBuffer
  const bytes: string[] = [];
  const len = arrayBuffer.length;
  for (let i = 0; i < len; i++) {
    bytes.push(String.fromCharCode(arrayBuffer[i]));
  }
  return bytes.join('');
}

/**
 * 将字符串转换成 ArrayBuffer 对象，基于 `charCodeAt`
 */
export function stringToArrayBufferExperimental1(data: string) {
  return stringToTypedArrayExperimental1(data).buffer;
}

/**
 * 将字符串转换成 ArrayBuffer 对象，基于 `codePointAt`
 */
export function stringToArrayBufferExperimental2(data: string) {
  return stringToTypedArrayExperimental2(data).buffer;
}

/**
 * 将字符串转换成 TypedArray 对象，基于 `charCodeAt`
 */
export function stringToTypedArrayExperimental1(data: string) {
  const len = data.length;
  const unicodes: number[] = [];
  for (let i = 0; i < len; i++) {
    // [0, 65535]
    unicodes.push(data.charCodeAt(i));
  }
  if (unicodes.length > 0) {
    if (unicodes.every(unicode => unicode < 2 ** 8)) {
      // 255 (0xFF)
      return Uint8Array.from(unicodes);
    } else {
      // 65535 (0xFFFF)
      return Uint16Array.from(unicodes);
    }
  }
  return Uint8Array.from(unicodes);
}

/**
 * 将字符串转换成 TypedArray 对象，基于 `codePointAt`
 */
export function stringToTypedArrayExperimental2(data: string) {
  const unicodes: number[] = [];
  for (let char of data) {
    const value = char.codePointAt(0);
    if (value !== undefined) {
      unicodes.push(value);
    }
  }
  if (unicodes.length > 0) {
    if (unicodes.every(unicode => unicode < 2 ** 8)) {
      // 255 (0xFF)
      return Uint8Array.from(unicodes);
    } else if (unicodes.every(unicode => unicode < 2 ** 16)) {
      // 65535 (0xFFFF)
      return Uint16Array.from(unicodes);
    } else if (unicodes.every(unicode => unicode < 2 ** 32)) {
      // 4294967295 (0xFFFFFFFF)
      return Uint32Array.from(unicodes);
    } else {
      return BigUint64Array.from(unicodes.map(unicode => BigInt(unicode)));
    }
  }
  return Uint8Array.from(unicodes);
}

export {
  readAsArrayBuffer as blobToArrayBuffer,
  readAsDataURL as blobToDataURL,
  readAsText as blobToText
};
