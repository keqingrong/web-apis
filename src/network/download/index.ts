/**
 * 下载文件，如果请求失败，返回 null
 * @param url
 */
export async function downloadFile(url: string): Promise<Blob | null> {
  return fetch(url, { credentials: 'include' })
    .then(res => res.blob())
    .catch(err => {
      const message =
        window.location.origin !== new URL(url).origin
          ? '下载失败，请检查服务端是否设置 CORS 头避免跨域错误'
          : '下载失败，请检查';
      console.error(`[downloadFile] ${message}`, err);
      return null;
    });
}
