import { readAsArrayBuffer } from './blob';

export interface MimePattern {
  bytePattern: number[];
  type: string;
  ext: string;
}

/**
 * https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 * - [x] ico
 * - [x] cur
 * - [x] bmp
 * - [x] gif
 * - [x] webp
 * - [x] png
 * - [x] jpg
 * - [ ] apng
 * - [x] avif
 * - [ ] svg
 * - [x] tiff
 */
export const imagePatterns: MimePattern[] = [
  {
    bytePattern: [0x00, 0x00, 0x01, 0x00],
    type: 'image/x-icon',
    ext: '.ico'
  },
  {
    bytePattern: [0x00, 0x00, 0x02, 0x00],
    type: 'image/x-icon',
    ext: '.cur'
  },
  {
    bytePattern: [0x42, 0x4d], // "BM"
    type: 'image/bmp',
    ext: '.bmp'
  },
  {
    bytePattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // "GIF87a"
    type: 'image/gif',
    ext: '.gif'
  },
  {
    bytePattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // ""GIF89a""
    type: 'image/gif',
    ext: '.gif'
  },
  {
    bytePattern: [
      0x52,
      0x49,
      0x46,
      0x46,
      0x00,
      0x00,
      0x00,
      0x00,
      0x57,
      0x45,
      0x42,
      0x50,
      0x56,
      0x50
    ], // "RIFF" "WEBPVP"
    type: 'image/webp',
    ext: '.webp'
  },
  {
    bytePattern: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // "PNG"
    type: 'image/png',
    ext: '.png'
  },
  {
    bytePattern: [0xff, 0xd8, 0xff],
    type: 'image/jpeg',
    ext: '.jpg'
  },
  {
    bytePattern: [0x49, 0x49], // "II" (little endian)
    type: 'image/tiff',
    ext: '.tiff'
  },
  {
    bytePattern: [0x4d, 0x4d], // "MM" (big endian)
    type: 'image/tiff',
    ext: '.tiff'
  },
  {
    bytePattern: [], // TODO: isAVIF
    type: 'image/avif',
    ext: '.avif'
  }
];

/**
 * 判断两个数组是否相等
 * @param array1
 * @param array2
 */
export function isEqual<T>(array1: Array<T>, array2: Array<T>) {
  return (
    array1.length === array2.length &&
    array1.every((val, index) => array2[index] === val)
  );
}

/**
 * 判断是否是 AVIF 格式
 * @param blob
 */
export async function isAVIF(blob: Blob) {
  const header = blob.slice(0, 24);
  const buffer = await readAsArrayBuffer(header);
  return Array.from(new Uint8Array(buffer))
    .map(value => String.fromCharCode(value))
    .join('')
    .includes('avif');
}

/**
 * 比对已知图片 MIME 数据
 * @param blob
 */
export async function checkMime(blob: Blob): Promise<MimePattern | undefined> {
  for (let pattern of imagePatterns) {
    if (pattern.bytePattern.length > 0) {
      const header = blob.slice(0, pattern.bytePattern.length);
      const buffer = await readAsArrayBuffer(header);
      const array = Array.from(new Uint8Array(buffer));
      if (isEqual(array, pattern.bytePattern)) {
        return pattern;
      }
    } else {
      //  TODO: 完善其他图片类型处理
      const avif = await isAVIF(blob);
      if (avif) {
        return imagePatterns.find(item => item.ext === '.avif');
      }
    }
  }
  return undefined;
}

/**
 * 根据图片后缀返回对应媒体类型，例如 image/webp,image/apng,image/png,image/jpeg,image/gif,image/svg+xml,image/bmp
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * @param ext
 */
export function extToMediaType(ext: string): string {
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
