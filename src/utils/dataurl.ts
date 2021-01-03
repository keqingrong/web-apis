import { isDataURL } from './url';

export interface DataURLParsedResult {
  /** 媒体类型 */
  mediaType: string | undefined;
  /** 字符集 */
  charset: string | undefined;
  /** data 是否使用 base64 编码 */
  base64: boolean;
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
    base64: false,
    data: undefined
  };

  if (!isDataURL(url)) {
    return result;
  }

  const [header = '', body = ''] = url.replace(/^data:/i, '').split(',');
  result.data = body;
  const parts = header.toLowerCase().split(';');
  if (parts[parts.length - 1] === 'base64') {
    result.base64 = true;
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
  const { data = '', mediaType } = pareseDataURL(url);
  const unicodes = window
    .atob(data)
    .split('')
    .map(char => char.charCodeAt(0));
  const bytes = Uint8Array.from(unicodes);
  const options = mediaType ? { type: mediaType } : undefined;
  return new Blob([bytes], options);
}

/**
 * 将 Data URL 转换成 Blob 对象
 */
export function dataURLToBlobAsync(url: string) {
  return fetch(url).then(res => res.blob());
}
