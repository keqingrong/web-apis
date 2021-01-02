import { basename } from '../src/utils';

describe('basename', () => {
  it('renders without crashing', () => {
    expect(basename('/foo/bar/baz/asdf/quux.html')).toBe('quux.html');
  });

  it('renders without crashing2', () => {
    expect(basename('/foo/bar/baz/asdf/quux.html', '.html')).toBe('quux');
  });
});
