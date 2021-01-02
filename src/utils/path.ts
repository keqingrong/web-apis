/**
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
