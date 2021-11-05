/**
 * 获取文件 basename
 * @param path
 * @param ext An optional file extension
 * @see https://nodejs.org/dist/latest/docs/api/path.html#path_path_basename_path_ext
 * @example
 * basename('/foo/bar/baz/asdf/quux.html')
 * // 'quux.html'
 * basename('/foo/bar/baz/asdf/quux.html', '.html')
 * // 'quux'
 */
export function basename(path: string, ext: string = '') {
  const filename = path.slice(path.lastIndexOf('/') + 1);
  return ext.length === 0
    ? filename
    : filename.slice(0, filename.lastIndexOf(ext));
}

/**
 * 获取文件后缀名
 * @param path
 * @see https://nodejs.org/dist/latest/docs/api/path.html#pathextnamepath
 * @example
 * extname('index.html')
 * // '.html'
 */
export function extname(path: string) {
  const lastDotIndex = path.lastIndexOf('.');
  return lastDotIndex === -1 || lastDotIndex === 0
    ? ''
    : path.slice(lastDotIndex);
}
