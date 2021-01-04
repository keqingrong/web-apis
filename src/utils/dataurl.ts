import { base64ToArrayBuffer } from './base64';
import { stringToArrayBuffer } from './blob';
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
