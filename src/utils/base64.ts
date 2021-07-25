import { arrayBufferToString, latin1ToTypedArray } from './blob';
import { checkMime } from './mime';

export interface Base64Options {
  /** URL 安全 */
  urlSafe?: boolean;
}

/**
 * 对 Latin1 字符串进行 Base64 编码
 */
export function toBase64(data: string, options: Base64Options = {}) {
  if (options.urlSafe) {
    return btoa(data)
      .replace(/\+/g, '-')
      .replace(/\//, '_');
  } else {
    return btoa(data);
  }
}

/**
 * 对 Base64 数据进行解码
 */
export function fromBase64(data: string, options: Base64Options = {}) {
  if (options.urlSafe) {
    return atob(data.replace(/\-/g, '+').replace(/_/g, '/'));
  } else {
    return atob(data);
  }
}

/**
 * 将 ArrayBuffer 对象转换成 base64 字符串
 */
export function arrayBufferToBase64(arrayBuffer: Uint8Array) {
  return btoa(arrayBufferToString(arrayBuffer));
}

/**
 * 将 base64 字符串转成 TypedArray 对象
 */
export function base64ToTypedArray(base64: string): Uint8Array {
  return latin1ToTypedArray(atob(base64));
}

/**
 * 将 base64 字符串转换成 ArrayBuffer 对象
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  return base64ToTypedArray(base64).buffer;
}

/**
 * 将 base64 字符串转换成 Blob 对象
 */
export async function base64ToBlob(base64: string) {
  const buffer = base64ToArrayBuffer(base64);
  const blob = new Blob([buffer]);
  const mime = await checkMime(blob);
  if (mime) {
    return new Blob([blob], { type: mime.type });
  } else {
    return blob;
  }
}
