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
export function stringToArrayBufferLegacy(data: string) {
  return stringToTypedArrayLegacy(data).buffer;
}

/**
 * 将字符串转换成 ArrayBuffer 对象，基于 `codePointAt`
 */
export function stringToArrayBuffer(data: string) {
  return stringToTypedArray(data).buffer;
}

/**
 * 将字符串转换成 TypedArray 对象，基于 `charCodeAt`
 */
export function stringToTypedArrayLegacy(data: string) {
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
export function stringToTypedArray(data: string) {
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
