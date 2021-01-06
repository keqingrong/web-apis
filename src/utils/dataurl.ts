import { base64ToArrayBuffer } from './base64';
import { stringToTypedArrayLegacy } from './blob';
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
 * 将 Data URL 转换成 ArrayBuffer 对象
 */
export function dataURLToArrayBuffer(url: string) {
  const { data = '', isBase64Encoded } = pareseDataURL(url);
  return isBase64Encoded
    ? base64ToArrayBuffer(data)
    : stringToTypedArrayLegacy(data);
}

/**
 * 将 Data URL 转换成 Blob 对象
 */
export function dataURLToBlob(url: string) {
  const { data = '', mediaType, isBase64Encoded } = pareseDataURL(url);
  const buffer = isBase64Encoded
    ? base64ToArrayBuffer(data)
    : stringToTypedArrayLegacy(data);
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
 * 将 Data URL 转换成 ImageData 对象
 */
export function dataURLToImageData(url: string) {
  return new Promise<ImageData>((resolve, reject) => {
    const image = document.createElement('img');
    image.src = url;
    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;
      const canvas = document.createElement('canvas');
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('dataURLToImageData 处理失败'));
        return;
      }
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, naturalWidth, naturalHeight);
      resolve(imageData);
    };
    image.onerror = err => {
      reject(err);
    };
  });
}
