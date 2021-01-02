export interface BaseImageInfo {
  /** 图片宽度，单位px */
  width?: number;
  /** 图片高度，单位px */
  height?: number;
  /** 图片格式，如 "image/png"、"image/svg+xml" */
  type: string;
}

export interface ImageInfo extends BaseImageInfo {
  /** 拍照时设备方向 */
  orientation?: string;
}

export interface ExtraFormData {
  /** 其他参数 */
  [key: string]: string;
}

export interface ChooseImageOptions {
  /** 图片服务接口地址，带 HTTP 协议 */
  url: string;
  /** 最多可以选择的图片张数 */
  count?: number;
  /** 需要额外提交的表单参数 */
  extraFormData?: ExtraFormData;
  /** 客户端不支持时，是否自动回退到 HTML5 实现 */
  autoFallback?: boolean;
}

export interface ChooseImageFileOptions {
  /** 是否允许用户选择多个文件 */
  multiple?: boolean;
}

export interface InputEventTarget extends EventTarget {
  /** 已选择的文件 */
  files: FileList | null;
}
