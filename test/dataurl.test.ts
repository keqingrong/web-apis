import { pareseDataURL, dataURLToBlob } from '../src/utils/dataurl';

test('pareseDataURL', () => {
  expect(pareseDataURL('data:,Hello%2C%20World!')).toEqual({
    base64: false,
    data: 'Hello%2C%20World!'
  });

  expect(pareseDataURL('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toEqual({
    base64: true,
    data: 'SGVsbG8sIFdvcmxkIQ==',
    mediaType: 'text/plain'
  });

  expect(
    pareseDataURL('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E')
  ).toEqual({
    base64: false,
    data: '%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
    mediaType: 'text/html'
  });

  expect(pareseDataURL(`data:text/html,<script>alert('hi');</script>`)).toEqual(
    {
      base64: false,
      data: `<script>alert('hi');</script>`,
      mediaType: 'text/html'
    }
  );

  expect(
    pareseDataURL(
      `data:image/gif;base64,R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAwAAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFzByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSpa/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJlZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uisF81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PHhhx4dbgYKAAA7`
    )
  ).toEqual({
    base64: true,
    data: `R0lGODdhMAAwAPAAAAAAAP///ywAAAAAMAAwAAAC8IyPqcvt3wCcDkiLc7C0qwyGHhSWpjQu5yqmCYsapyuvUUlvONmOZtfzgFzByTB10QgxOR0TqBQejhRNzOfkVJ+5YiUqrXF5Y5lKh/DeuNcP5yLWGsEbtLiOSpa/TPg7JpJHxyendzWTBfX0cxOnKPjgBzi4diinWGdkF8kjdfnycQZXZeYGejmJlZeGl9i2icVqaNVailT6F5iJ90m6mvuTS4OK05M0vDk0Q4XUtwvKOzrcd3iq9uisF81M1OIcR7lEewwcLp7tuNNkM3uNna3F2JQFo97Vriy/Xl4/f1cf5VWzXyym7PHhhx4dbgYKAAA7`,
    mediaType: 'image/gif'
  });
});

test('dataURLToBlob', () => {
  const blob = dataURLToBlob(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  );
  expect(blob.type).toBe('image/png');
});
