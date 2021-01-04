import { checkMime } from './mime';
import { isDataURL } from './url';

export interface DataURLParsedResult {
  /** 媒体类型 */
  mediaType: string | undefined;
  /** 字符集 */
  charset: string | undefined;
  /** data 是否使用 base64 编码 */
  isBase64Encoded: boolean;
  /** 数据 */
  data: string | undefined;
}

/**
 * 解析 Data URL
 * `data:image/png;base64,${body}`
 * `data:application/json;base64,${body}`
 * `data:application/json;charset=utf-8;base64,${body}`
 */
export function pareseDataURL(url: string) {
  const result: DataURLParsedResult = {
    mediaType: undefined,
    charset: undefined,
    isBase64Encoded: false,
    data: undefined
  };

  if (!isDataURL(url)) {
    return result;
  }

  const [header = '', body = ''] = url.replace(/^data:/i, '').split(',');
  result.data = body;
  const parts = header.toLowerCase().split(';');
  if (parts[parts.length - 1] === 'base64') {
    result.isBase64Encoded = true;
    parts.pop();
  }
  if (parts[0] && parts[0].includes('/')) {
    result.mediaType = parts[0];

    if (parts[1] && parts[1].includes('charset')) {
      result.charset = parts[1].split('=')[1];
    }
  }

  return result;
}

/**
 * 将 Data URL 转换成 Blob 对象
 */
export function dataURLToBlob(url: string) {
  const { data = '', mediaType, isBase64Encoded } = pareseDataURL(url);
  const buffer = isBase64Encoded
    ? base64ToArrayBuffer(data)
    : stringToArrayBuffer(data);
  const options = mediaType ? { type: mediaType } : undefined;
  return new Blob([buffer], options);
}

/**
 * 将 Data URL 转换成 Blob 对象
 */
export function dataURLToBlobAsync(url: string) {
  return window.fetch(url).then(res => res.blob());
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

/**
 * 将 base64 字符串转换成 ArrayBuffer 对象
 */
export function base64ToArrayBuffer(base64: string) {
  return stringToArrayBuffer(atob(base64));
}

/**
 * 将字符串转换成 ArrayBuffer 对象
 */
export function stringToArrayBuffer(data: string) {
  const len = data.length;
  const unicodes: number[] = [];
  for (let i = 0; i < len; i++) {
    unicodes.push(data.charCodeAt(i));
  }
  return Uint8Array.from(unicodes);
}

/**
 * 将 ArrayBuffer 对象转换成 base64 字符串
 */
export function arrayBufferToBase64(arrayBuffer: Uint8Array) {
  return btoa(arrayBufferToString(arrayBuffer));
}

/**
 * 将 ArrayBuffer 对象转换成字符串
 */
export function arrayBufferToString(arrayBuffer: Uint8Array) {
  const bytes: string[] = [];
  const len = arrayBuffer.length;
  for (let i = 0; i < len; i++) {
    bytes.push(String.fromCharCode(arrayBuffer[i]));
  }
  return bytes.join('');
}
