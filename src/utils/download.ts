import { isBlobURL, isCorssOrigin } from './url';

declare global {
  interface Navigator {
    msSaveBlob?(blob: Blob, defaultName: string): void;
    msSaveOrOpenBlob?(blob: Blob, defaultName: string): void;
  }
}

/**
 * 保存文件或 URL 资源到本地
 * @param {string | File | Blob} src 文件对象或 URL（同源 URL 或 Blob URL 或 Data URL）
 * @param {string} filename 文件名
 * @returns {Promise<boolean>}
 */
export async function saveBlobOrURL(
  src: string | File | Blob,
  filename?: string
) {
  let defaultName = filename ?? '';
  let file: File | Blob | null = null;

  if (src instanceof File || src instanceof Blob) {
    file = src;

    if (defaultName.length === 0 && 'name' in src) {
      defaultName = src.name;
    }
  }

  if (defaultName.length === 0) {
    defaultName = new Date().getTime().toString(10);
  }

  // Microsoft Edge/IE 10+
  if (navigator.msSaveOrOpenBlob && file) {
    navigator.msSaveOrOpenBlob(file, defaultName);
    return true;
  }

  if (typeof URL !== 'undefined' && 'download' in HTMLAnchorElement.prototype) {
    // Data URL or Blob URL
    const url = typeof src === 'string' ? src : URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultName;
    link.addEventListener(
      'click',
      () => {
        // 结束后释放 URL 对象，但如果立即调用 revokeObjectURL 会导致网络错误。
        // 如 Chrome 会提示 "Failed - Network error"，此处放在回调函数中异步处理。
        setTimeout(() => {
          if (isBlobURL(url)) {
            URL.revokeObjectURL(url);
          }
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

  // https://caniuse.com/mdn-html_elements_a_download
  throw new Error('该浏览器不支持文件保存');
}

/**
 * 下载文件，如果请求失败，返回 null
 * @param url
 */
export async function downloadFile(url: string): Promise<Blob | null> {
  return fetch(url, { credentials: 'include' })
    .then(res => res.blob())
    .catch(err => {
      const message = isCorssOrigin(window.location, url)
        ? '下载失败，请检查服务端是否设置 CORS 头避免跨域错误'
        : '下载失败，请检查';
      console.error(`[downloadFile] ${message}`, err);
      return null;
    });
}
