# @keqingrong/web-apis (WIP)

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
import { chooseImage, getImageInfo } from '@keqingrong/web-apis';

(async () => {
  const [imageUrl] = await chooseImage({
    url: 'http://api.example.com/upload/image'
  });

  const { width, height, type } = await getImageInfo(imageUrl);
})();
```

## APIs

- Base
  - `base64ToArrayBuffer()`
  - `arrayBufferToBase64()`
- Device
  - Phone
    - `makePhoneCall()`
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
  - `saveJSON()`
  - `saveText()`
- Internal Utils
  - Base64
    - `arrayBufferToBase64()`
    - `base64ToTypedArray()`
    - `base64ToArrayBuffer()`
    - `base64ToBlob()`
  - Blob
    - `blobToArrayBuffer()`/`readAsArrayBuffer()`
    - `blobToDataURL()`/`readAsDataURL()`
    - `blobToText()`/`readAsText()`
    - `latin1ToTypedArray()`
    - `utf16ToTypedArray()`
    - `stringToTypedArray()`
    - `arrayBufferToString()`
  - Data URL
    - `pareseDataURL()`
    - `dataURLToArrayBuffer()`
    - `dataURLToBlob()`
    - `dataURLToImageData()`
  - Image
    - `imageToBlob()`
  - URL
    - `isHttpURL()`
    - `isDataURL()`
    - `isHttps()`
    - `httpsToHttp()`
    - `parseURL()`
    - `parseScheme()`
    - `getSubdomain()`
    - `isSameOrigin()`
    - `isCorssOrigin()`
    - `isSameSite()`
    - `isCrossSite()`
    - `isSchemefulSameSite()`
    - `isSchemefulCrossSite()`

## License

MIT © Qingrong Ke
