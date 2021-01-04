import {
  base64ToBlob,
  base64ToArrayBuffer,
  arrayBufferToBase64
} from '../src/utils/base64';

test('base64ToBlob', async () => {
  const blob = await base64ToBlob(
    'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  );
  expect(blob.type).toBe('image/png');
});

test('base64ToArrayBuffer', () => {
  const buffer = base64ToArrayBuffer('iVBORw0KGgo=');
  expect(buffer).toEqual(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]));
});

test('arrayBufferToBase64', () => {
  const base64 = arrayBufferToBase64(
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
  );
  expect(base64).toBe('iVBORw0KGgo=');
});
