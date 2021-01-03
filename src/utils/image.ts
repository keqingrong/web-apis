/**
 * 从 image 创建 canvas
 */
export function createCanvas(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  return canvas;
}

/**
 * 将图片处理成 Blob 对象
 * @param {HTMLImageElement | HTMLCanvasElement} element 图片元素
 * @returns {Promise<Blob|null>}
 */
export function imageToBlob(element: HTMLImageElement | HTMLCanvasElement) {
  const image =
    element instanceof HTMLImageElement ? createCanvas(element) : element;
  return new Promise<Blob | null>(resolve => {
    image.toBlob(blob => resolve(blob));
  });
}

/**
 * 根据图片后缀返回对应媒体类型，支持 image/webp,image/apng,image/png,image/jpeg,image/gif,image/svg+xml
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * @param ext
 */
export function extToMediaType(ext: string) {
  const mediaTypeMap = new Map([
    [/\.ico$/i, 'image/vnd.microsoft.icon'],
    [/\.jpe?g$/i, 'image/jpeg'],
    [/\.svg$/i, 'image/svg+xml'],
    [/\.tiff?$/i, 'image/tiff']
  ]);
  for (const [regExp, mediaType] of mediaTypeMap) {
    if (regExp.test(ext)) {
      return mediaType;
    }
  }
  return `image/${ext.slice(1).toLowerCase()}`;
}
