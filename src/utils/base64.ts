import { arrayBufferToString, latin1ToTypedArray } from './blob';
import { checkMime } from './mime';

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
