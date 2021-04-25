import {
  getSubdomain,
  isSameOrigin,
  isSameSite,
  isSchemefulSameSite
} from '../src/utils/url';

test('getSubdomain', () => {
  expect(getSubdomain('http://proxy.example.com:8080/')).toBe('example.com');
  expect(getSubdomain('https://login.example.com/auth')).toBe('example.com');
  expect(getSubdomain('http://www.example.com')).toBe('example.com');
  expect(getSubdomain('http://example.com')).toBe('example.com');
  expect(getSubdomain('www.example.com')).toBe('example.com');
  expect(getSubdomain('example.com')).toBe('example.com');
  expect(getSubdomain('www.nintendo.co.jp')).toBe('nintendo.co.jp');
  expect(getSubdomain('www.nintendoswitch.com.cn')).toBe(
    'nintendoswitch.com.cn'
  );
  expect(getSubdomain('www.amazon.co.uk')).toBe('amazon.co.uk');
});

test('isSameOrigin', () => {
  const url = 'https://www.example.com:443';

  expect(isSameOrigin(url, 'https://www.evil.com:443')).toBeFalsy();
  expect(isSameOrigin(url, 'https://example.com:443')).toBeFalsy();
  expect(isSameOrigin(url, 'https://login.example.com:443')).toBeFalsy();
  expect(isSameOrigin(url, 'http://www.example.com:443')).toBeFalsy();
  expect(isSameOrigin(url, 'https://www.example.com:80')).toBeFalsy();
  expect(isSameOrigin(url, 'https://www.example.com:443')).toBeTruthy();
  expect(isSameOrigin(url, 'https://www.example.com')).toBeTruthy();
});

test('isSameSite', () => {
  const url = 'https://www.example.com:443';

  expect(isSameSite(url, 'https://www.evil.com:443')).toBeFalsy();
  expect(isSameSite(url, 'https://example.com:443')).toBeTruthy();
  expect(isSameSite(url, 'https://login.example.com:443')).toBeTruthy();
  expect(isSameSite(url, 'http://www.example.com:443')).toBeTruthy();
  expect(isSameSite(url, 'https://www.example.com:80')).toBeTruthy();
  expect(isSameSite(url, 'https://www.example.com:443')).toBeTruthy();
  expect(isSameSite(url, 'https://www.example.com')).toBeTruthy();
});

test('isSchemefulSameSite', () => {
  const url = 'https://www.example.com:443';

  expect(isSchemefulSameSite(url, 'https://www.evil.com:443')).toBeFalsy();
  expect(isSchemefulSameSite(url, 'https://example.com:443')).toBeTruthy();
  expect(
    isSchemefulSameSite(url, 'https://login.example.com:443')
  ).toBeTruthy();
  expect(isSchemefulSameSite(url, 'http://www.example.com:443')).toBeFalsy();
  expect(isSchemefulSameSite(url, 'https://www.example.com:80')).toBeTruthy();
  expect(isSchemefulSameSite(url, 'https://www.example.com:443')).toBeTruthy();
  expect(isSchemefulSameSite(url, 'https://www.example.com')).toBeTruthy();
});

describe('Test schemeful same-site', () => {
  const originalLocation = window.location;
  const fakeLocation: Location = {
    ...originalLocation,
    hash: '',
    host: 'www.example.com',
    hostname: 'www.example.com',
    href: 'https://www.example.com',
    origin: 'https://www.example.com',
    pathname: '/',
    port: '',
    protocol: 'https:',
    search: ''
  };

  beforeEach(() => {
    // @ts-ignore
    delete global.window.location;
    global.window.location = fakeLocation;
  });

  afterEach(() => {
    global.window.location = originalLocation;
  });

  it('isSchemefulSameSite', async () => {
    const url = 'https://www.example.com:443';

    expect(isSchemefulSameSite(url, 'https://www.evil.com:443')).toBeFalsy();
    expect(isSchemefulSameSite(url, 'https://example.com:443')).toBeTruthy();
    expect(
      isSchemefulSameSite(url, 'https://login.example.com:443')
    ).toBeTruthy();
    expect(isSchemefulSameSite(url, 'http://www.example.com:443')).toBeFalsy();
    expect(isSchemefulSameSite(url, 'https://www.example.com:80')).toBeTruthy();
    expect(
      isSchemefulSameSite(url, 'https://www.example.com:443')
    ).toBeTruthy();
    expect(isSchemefulSameSite(url, 'https://www.example.com')).toBeTruthy();
    expect(
      isSchemefulSameSite(window.location, '//www.example.com')
    ).toBeTruthy();
  });
});
