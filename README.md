# @keqingrong/web-apis

[![npm version](https://img.shields.io/npm/v/@keqingrong/web-apis.svg)](https://www.npmjs.com/package/@keqingrong/web-apis)

Web APIs

## Installation

```bash
# npm
npm install @keqingrong/web-apis

# yarn
yarn add @keqingrong/web-apis
```

## Usage

```ts
import { chooseImage } from '@keqingrong/web-apis';

(async () => {
  // 上传单张图片
  const [imageUrl] = await chooseImage({
    url: 'http://api.example.com/upload/image'
  });

  // 上传多张图片
  const imageUrls = await chooseImage({
    url: 'http://api.example.com/upload/image',
    count: 5
  });
})();
```

## APIs

- Media
  - Image
    - `getImageInfo()`
    - `getBaseImageInfo()`
    - `compressImage()`
    - `chooseImage()`
    - `chooseImageFile()`
    - `chooseImageDataURL()`
- Network
  - Download
    - `downloadFile()`
- Route
  - `navigateTo()`
- File
  - `saveFile()`
  - `saveJSONFile()`

## License

MIT © Qingrong Ke
