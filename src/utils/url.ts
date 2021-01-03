/**
 * 判断是否是 HTTP(S) URL
 */
export function isHttpURL(url: string) {
  return /^https?:/.test(url);
}

/**
 * 判断是否是 Data URL
 * "data:image/jpeg;base64,"
 */
export function isDataURL(url: string) {
  return /^data:/.test(url);
}
