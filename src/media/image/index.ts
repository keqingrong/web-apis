import {
  ChooseImageOptions,
  BaseImageInfo,
  ImageInfo,
  ChooseImageFileOptions,
  InputEventTarget
} from '../../types';
import { downloadFile } from '../../network/download';

/**
 * 选择图片，返回URL字符串数组
 */
export function chooseImage(options: ChooseImageOptions) {
  return new Promise<string[]>(async (resolve, reject) => {
    const { url, count = 1, extraFormData = {} } = options || {};
    let imageFileList: File[] = [];

    if (count > 1) {
      const imageList = await chooseImageFile({ multiple: true });
      if (imageList.length > 0) {
        imageFileList = imageList.slice(0, count);
      } else {
        reject(new Error('cancel'));
      }
    } else {
      const imageList = await chooseImageFile({ multiple: false });
      if (imageList.length > 0) {
        imageFileList.push(imageList[0]);
      } else {
        reject(new Error('cancel'));
      }
    }

    if (imageFileList.length === 0) {
      resolve([]);
      return;
    }

    const formData = new FormData();
    imageFileList.forEach(imageFile => {
      formData.append('images', imageFile);
    });
    Object.keys(extraFormData).forEach(extraFormDataKey => {
      // TODO: 处理数组
      formData.append(extraFormDataKey, extraFormData[extraFormDataKey]);
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const json = (await response.json()) as { data: string | string[] };
    // TODO: 暴露response处理函数
    if (json && json.data) {
      const { data } = json;
      if (Array.isArray(data)) {
        resolve(data);
      } else {
        resolve([data]);
      }
    } else {
      reject(new Error(`"${url}" 接口的返回值格式不支持`));
    }
  });
}

/**
 * 选择图片，返回File对象
 */
export function chooseImageFile(options: ChooseImageFileOptions = {}) {
  return new Promise<File[]>((resolve, reject) => {
    const handleChange = (event: Event) => {
      if (event.target) {
        const target = event.target as InputEventTarget;
        resolve(Array.from(target.files || []));
      } else {
        reject(new Error('chooseImageFile 出错，event.target 缺失'));
      }
      inputElement.removeEventListener('change', handleChange);
    };
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    if (options.multiple) {
      inputElement.multiple = true;
    }
    // @ts-ignore
    inputElement.webkitdirectory = false;
    inputElement.style.display = 'none';
    inputElement.addEventListener('change', handleChange, false);
    inputElement.dispatchEvent(new MouseEvent('click'));
  });
}

/**
 * 选择图片，返回Data URL字符串
 */
export function chooseImageDataURL(options: ChooseImageFileOptions = {}) {
  return new Promise<string[]>((resolve, reject) => {
    chooseImageFile(options).then(
      async files => {
        if (Array.isArray(files)) {
          const dataURLs = new Array(files.length).fill(undefined);
          for (let file of files) {
            const dataURL = await readAsDataURL(file);
            dataURLs.push(dataURL);
          }
          resolve(dataURLs);
        } else {
          resolve([]);
        }
      },
      err => reject(err)
    );
  });
}

/**
 * 将 File 对象处理成 Data URL
 */
export function readAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('readAsDataURL 处理失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 根据图片后缀返回对应媒体类型
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * @param ext 如 image/webp,image/apng,image/png,image/jpeg,image/gif,image/svg+xml
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
  return `image/${ext.toLowerCase()}`;
}

/**
 * 获取基本图片信息
 * @param src 图片地址
 */
export function getBaseImageInfo(src: string): Promise<BaseImageInfo> {
  return new Promise<BaseImageInfo>(resolve => {
    const img = document.createElement('img');
    const ext = src.slice(src.lastIndexOf('.') + 1);
    const mediaType = extToMediaType(ext);
    img.src = src;
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: mediaType
      });
    };
    img.onerror = err => {
      console.warn(`[getImageInfo] 图片加载失败`, err);
      resolve({
        width: undefined,
        height: undefined,
        type: mediaType
      });
    };
  });
}

/**
 * 获取图片信息
 * @param src 图片地址或者图片 Blob 对象
 */
export async function getImageInfo(
  src: string | File | Blob
): Promise<ImageInfo> {
  let file: Blob | null = null;
  let imageInfo: ImageInfo = {
    width: undefined,
    height: undefined,
    type: 'unknown',
    orientation: undefined
  };
  if (typeof src === 'string') {
    imageInfo = await getBaseImageInfo(src);
    file = await downloadFile(src);
  } else {
    file = src;
  }
  if (file !== null) {
    // TODO: 从 Blob 对象中获取 EXIF 数据，进而获取 orientation 和更准确的 type
    const { type } = file;
    imageInfo.type = type;
  }
  return imageInfo;
}

/**
 * 压缩图片
 */
export async function compressImage() {
  // TODO: 基于 Canvas 压缩图片
}
