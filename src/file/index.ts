import { downloadFile } from '../network/download';
import { imageToBlob } from '../utils/image';
import { basename } from '../utils/path';
import { isHttpURL } from '../utils/url';

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
    if (!isHttpURL(src)) {
      throw new Error(
        `第一个参数为 URL 或文件对象，若要保存文件内容，请使用 saveTextFile API`
      );
    }
    if (defaultName.length === 0) {
      defaultName = basename(src);
    }
    file = await downloadFile(src);
  } else if (src instanceof File) {
    if (defaultName.length === 0) {
      defaultName = src.name;
    }
    file = src;
  } else {
    if (defaultName.length === 0) {
      defaultName = new Date().getTime().toString(10);
    }
    file = src;
  }

  // Microsoft Edge/IE 10+
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(file, defaultName);
    return true;
  }

  if (typeof URL !== 'undefined' && 'download' in HTMLAnchorElement.prototype) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = defaultName;
    link.addEventListener(
      'click',
      () => {
        // 结束后释放 URL 对象，但如果立即调用 revokeObjectURL 会导致网络错误。
        // 如 Chrome 会提示 "Failed - Network error"，此处放在回调函数中异步处理。
        requestAnimationFrame(() => {
          URL.revokeObjectURL(link.href);
          link.remove();
        });
      },
      false
    );

    // 没有必要调用 document.body.appendChild() 将 link 元素真的添加到页面中。
    // 因为没有添加到页面中，此处调用 link.click() 对 Firefox 来说不会触发下载，
    // 使用 link.dispatchEvent() 代替。
    link.dispatchEvent(new MouseEvent('click'));
    return true;
  }

  // 不支持 IE9 等低版本浏览器和 Safari for iOS、Chrome for iOS 等 iOS 平台浏览器
  throw new Error('该浏览器不支持文件保存');
}

/**
 * 保存图片到本地
 * @param {HTMLImageElement | HTMLCanvasElement} element 图片元素
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveImage(
  element: HTMLImageElement | HTMLCanvasElement,
  filename?: string
) {
  if (element instanceof HTMLCanvasElement) {
    const blob = await imageToBlob(element);
    if (blob === null) {
      throw new Error('无法转换成 Blob 对象');
    }
    return saveFile(blob, filename);
  } else {
    return saveFile(element.src, filename);
  }
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
  return saveFile(blob, filename);
}

/**
 * 保存文本内容到本地
 * @param {string} content 文本内容
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveText(content: string, filename?: string) {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  return saveFile(blob, filename);
}
