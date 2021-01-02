import { downloadFile } from '../network/download';
import { basename } from '../utils/path';

/**
 * 保存文件到本地
 * @param {string | File | Blob} src 文件 URL 或对象
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveFile(src: string | File | Blob, filename?: string) {
  let defaultName = '';
  let file: File | Blob | null = null;
  if (typeof src === 'string') {
    defaultName = filename ?? basename(src);
    file = await downloadFile(src);
  } else if (src instanceof File) {
    defaultName = filename ?? src.name;
    file = src;
  } else {
    file = src;
  }
  if (defaultName.length === 0) {
    defaultName = new Date().getTime().toString(10);
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

  console.warn(
    '不支持 IE9 等低版本浏览器和 Safari for iOS、Chrome for iOS 等 iOS 平台浏览器'
  );
  throw new Error('该浏览器不支持文件保存');
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

export interface SaveJSONFileOptions {
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
 * 保存 JSON 文件到本地
 * @param {any} json JSON 对象
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveJSONFile(
  json: any,
  filename?: string,
  options?: SaveJSONFileOptions
) {
  const { spaces = 2, replacer = null, EOL = '\n' } = { ...options };
  // TODO: 优化类型定义
  const content = JSON.stringify(json, replacer as any, spaces) + EOL;
  const blob = new Blob([content], { type: 'application/json' });
  return saveFile(blob, filename);
}
