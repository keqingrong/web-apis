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
