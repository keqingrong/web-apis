import { imageToBlob, imageToDataURL } from '../utils/image';
import { basename } from '../utils/path';
import { isHttpURL, isDataURL, isBlobURL, isSameOrigin } from '../utils/url';
import { saveBlobOrURL, downloadFile } from '../utils/download';

/**
 * 保存文件到本地
 * @param {string | File | Blob} src URL 或文件对象
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveFile(src: string | File | Blob, filename?: string) {
  let defaultName = filename ?? '';
  let file: File | Blob | null = null;

  if (typeof src === 'string') {
    if (isHttpURL(src)) {
      if (defaultName.length === 0) {
        defaultName = basename(src);
      }

      if (isSameOrigin(window.location, src)) {
        try {
          return await saveBlobOrURL(src, defaultName);
        } catch (err) {
          // 忽略
        }
      }

      file = await downloadFile(src);
    } else if (isDataURL(src) || isBlobURL(src)) {
      return await saveBlobOrURL(src, defaultName);
    } else {
      throw new Error(
        `第一个参数为 URL 或文件对象，若要保存文件内容，请使用 saveText API`
      );
    }
  } else {
    file = src;
  }

  if (file === null) {
    return false;
  }

  return await saveBlobOrURL(file, defaultName);
}

/**
 * 保存图片到本地
 * @param {HTMLImageElement | HTMLCanvasElement} element 图片元素
 * @param {string} filename 文件名
 * @param {string} type 媒体类型，默认 `image/png`
 * @param {number} quality 图片质量，[0, 1] 数字
 * @returns {Promise<boolean>}
 */
export async function saveImage(
  element: HTMLImageElement | HTMLCanvasElement,
  filename?: string,
  type?: string,
  quality?: number
) {
  let image = element;
  if (element instanceof HTMLImageElement) {
    try {
      return await saveFile(element.src, filename);
    } catch (err) {
      // 忽略
    }
  }
  const blob = await imageToBlob(image, type, quality);
  if (blob !== null) {
    return await saveBlobOrURL(blob, filename);
  }
  const dataURL = imageToDataURL(image, type, quality);
  if (dataURL.length > 0) {
    return await saveBlobOrURL(dataURL, filename);
  }
  throw new Error('无法转换成 Blob 对象');
}

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | {
      [K in string]?: JSONValue;
    }
  | JSONValue[];

export interface SaveJSONOptions {
  /** 缩进字符 */
  spaces?: number | string;
  /** EOL 字符 */
  EOL?: string;
  /** JSON replacer */
  replacer?:
    | ((this: any, key: string, value: any) => JSONValue)
    | (number | string)[]
    | null;
}

/**
 * 保存 JSON 内容到本地
 * @param {any} json JSON 对象
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveJSON(
  json: any,
  filename?: string,
  options?: SaveJSONOptions
) {
  const { spaces = 2, replacer = null, EOL = '\n' } = { ...options };
  // TODO: 优化类型定义
  const content = JSON.stringify(json, replacer as any, spaces) + EOL;
  const blob = new Blob([content], { type: 'application/json' });
  return saveBlobOrURL(blob, filename);
}

/**
 * 保存文本内容到本地
 * @param {string} content 文本内容
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveText(content: string, filename?: string) {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  return saveBlobOrURL(blob, filename);
}
