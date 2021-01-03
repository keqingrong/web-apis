import {
  chooseImageFile,
  getImageInfo,
  makePhoneCall,
  saveFile,
  saveJSON,
  saveText
} from '../src';
import { openModal } from './utils';

interface ApiHandler {
  (apiName: string): void;
}

export const apis: [string, ApiHandler][] = [
  ['刷新测试页面', () => location.reload()],
  ['chooseImageFile', apiName => openModal(apiName, chooseImageFile())],
  [
    'getImageInfo (cross-origin)',
    apiName =>
      openModal(
        apiName,
        getImageInfo(
          'http://image1.suning.cn/uimg/cms/img/159642507148437980.png'
        )
      )
  ],
  [
    'getImageInfo (same-origin)',
    apiName =>
      openModal(
        apiName,
        getImageInfo('http://localhost:8080/159642507148437980.png')
      )
  ],
  ['makePhoneCall', apiName => makePhoneCall('10086')],
  [
    'saveFile (SVG image)',
    () => {
      const str = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke-width="1" fill="#f60" />
</svg>`;
      const blob = new Blob([str], { type: 'image/svg+xml' });
      saveFile(blob, 'circle.svg');
    }
  ],
  [
    'saveFile (Canvas)',
    () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#f60';
        ctx.fill();
  
        // save canvas as PNG image
        // canvas.toBlob(blob => {
        //   blob && saveFile(blob, 'circle.png');
        // });
  
        // or sava it as JPEG image
        canvas.toBlob(
          blob => {
            blob && saveFile(blob, 'circle.jpg');
          },
          'image/jpeg',
          1
        );
      }
    }
  ],
  [
    'saveText',
    () => {
      const str = `# Lorem ipsum
Lorem ipsum dolor sit amet
Consectetur adipiscing elit
`;
      saveText(str, 'README.md');
    }
  ],
  [
    'saveJSON',
    () => {
      saveJSON({
        bool: true,
        num: 3.14159,
        str: '字符串',
        obj: {
          foo: 'bar'
        }
      });
    }
  ]
];
