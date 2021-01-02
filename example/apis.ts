import { chooseImageFile, getImageInfo, makePhoneCall } from '../src';
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
  ['makePhoneCall', apiName => makePhoneCall('10086')]
];
