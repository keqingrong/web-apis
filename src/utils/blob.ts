/**
 * 将 Blob 或 File 对象处理成 ArrayBuffer
 */
export function readAsArrayBuffer(file: Blob | File) {
  if ('arrayBuffer' in Blob.prototype) {
    return file.arrayBuffer();
  }
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('readAsArrayBuffer 处理失败'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 将 Blob 或 File 对象处理成 Data URL
 */
export function readAsDataURL(file: Blob | File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('readAsDataURL 处理失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 将 Blob 或 File 对象处理成字符串
 */
export function readAsText(file: Blob | File, encoding?: string) {
  if ('text' in Blob.prototype) {
    return file.text();
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('readAsText 处理失败'));
    reader.readAsText(file, encoding);
  });
}

export {
  readAsArrayBuffer as blobToArrayBuffer,
  readAsDataURL as blobToDataURL,
  readAsText as blobToText
};
