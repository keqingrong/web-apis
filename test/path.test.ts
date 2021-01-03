import { basename, extname } from '../src/utils/path';

test('basename', () => {
  expect(basename('/foo/bar/baz/asdf/quux.html')).toBe('quux.html');
  expect(basename('/foo/bar/baz/asdf/quux.html', '.html')).toBe('quux');
});

test('extname', () => {
  expect(extname('index.html')).toBe('.html');
  expect(extname('index.coffee.md')).toBe('.md');
  expect(extname('index.')).toBe('.');
  expect(extname('index')).toBe('');
  expect(extname('.index')).toBe('');
  expect(extname('.index.md')).toBe('.md');
});
