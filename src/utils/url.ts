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

/**
 * 判断是否是 HTTPS URL
 * @param url
 */
export function isHttps(url: string) {
  return /^https/.test(url);
}

/**
 * HTTPS 转 HTTP
 */
export function httpsToHttp(url: string) {
  return url.replace(/^https/, 'http');
}

/**
 * 解析 URL 字符串
 * @param {string} s - URL string
 * @returns {URL|null}
 */
export function parseURL(s: string) {
  let url: URL | null = null;
  try {
    url = new URL(s);
  } catch (err) {
    console.error(`[parseURL]`, err);
  }
  return url;
}

/**
 * 解析 URL 协议
 * @param url
 * @example
 * parseScheme("http://www.example.com") // "http"
 */
export function parseScheme(url: string | URL | Location): string {
  if (typeof url === 'object' && 'protocol' in url) {
    return url.protocol.replace(':', '');
  }
  const [, scheme = ''] = /^(https?):\/\//.exec(url) || [];
  if (scheme.length > 0) {
    return scheme;
  }
  if (/^\/\//.test(url)) {
    return parseScheme(window.location);
  }
  return scheme;
}

/**
 * 获取 URL 二级域名
 * @param url
 * @example
 * getSubdomain("http://www.example.com") // "example.com"
 * getSubdomain("www.example.com") // "example.com"
 *
 * @see <http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Country_code_top-level_domains>
 */
export const getSubdomain = (url: string | URL | Location) => {
  let hostname = '';
  if (typeof url !== 'string') {
    hostname = url.hostname;
  } else if (/^https?:\/\//.test(url)) {
    try {
      hostname = new URL(url).hostname;
    } catch (err) {
      console.error(`[getSubdomain]`, err);
      hostname = url.replace(/^https?:\/\//, '').split('/')[0] || '';
    }
  } else {
    hostname = url;
  }
  // TODO: TLD
  const suffixList = ['com.cn', 'co.uk', 'co.jp', 'co.kr'];
  const sliceIndex = suffixList.some(suffix => hostname.endsWith(suffix))
    ? -3
    : -2;
  return hostname
    .split('.')
    .slice(sliceIndex)
    .join('.');
};

/**
 * 判断两个 URL 是否属于 same-origin
 * @param url1
 * @param url2
 *
 * @see <https://html.spec.whatwg.org/multipage/origin.html#same-origin>
 * @see <https://nodejs.org/dist/latest/docs/api/url.html>
 */
export function isSameOrigin(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  const urlA = typeof url1 === 'string' ? parseURL(url1) : url1;
  const urlB = typeof url2 === 'string' ? parseURL(url2) : url2;
  if (!urlA || !urlB) {
    return false;
  }
  if (urlA.origin === urlB.origin) {
    return true;
  }
  if (
    urlA.protocol === urlB.protocol &&
    urlA.hostname === urlB.hostname &&
    urlA.port === urlB.port
  ) {
    return true;
  }
  return false;
}

/**
 * 判断两个 URL 是否属于 cross-origin
 * @param url1
 * @param url2
 * @returns
 */
export function isCorssOrigin(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  return !isSameOrigin(url1, url2);
}

/**
 * 判断两个 URL 是否属于 same-site
 * @param url1
 * @param url2
 */
export function isSameSite(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  return getSubdomain(url1) === getSubdomain(url2);
}

/**
 * 判断两个 URL 是否属于 cross-site
 * @param url1
 * @param url2
 */
export function isCrossSite(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  return !isSameSite(url1, url2);
}

/**
 * 判断两个 URL 是否属于 schemeful same-site
 * @param url1
 * @param url2
 */
export function isSchemefulSameSite(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  return parseScheme(url1) === parseScheme(url2) && isSameSite(url1, url2);
}

/**
 * 判断两个 URL 是否属于 cross-site
 * @param url1
 * @param url2
 */
export function isSchemefulCrossSite(
  url1: string | URL | Location,
  url2: string | URL | Location
) {
  return !isSchemefulSameSite(url1, url2);
}
