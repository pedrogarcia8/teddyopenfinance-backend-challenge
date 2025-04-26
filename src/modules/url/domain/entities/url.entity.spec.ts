import { Url } from './url.entity';

describe('Url Entity', () => {
  it('Should create a url with all properties', () => {
    const now = new Date();
    const url = new Url(
      'https://example.com',
      'abc123',
      'd8c3c7c2-d874-47fb-8a6f-6945d9447e9d',
      'd8c3c7c2-d874-47fb-8a6f-6945d9447e9e',
      0,
      now,
      now,
      null,
    );

    expect(url.originalUrl).toBe('https://example.com');
    expect(url.code).toBe('abc123');
    expect(url.userId).toBe('d8c3c7c2-d874-47fb-8a6f-6945d9447e9d');
    expect(url.id).toBe('d8c3c7c2-d874-47fb-8a6f-6945d9447e9e');
    expect(url.clicks).toBe(0);
    expect(url.createdAt).toBe(now);
    expect(url.updatedAt).toBe(now);
    expect(url.deletedAt).toBeNull();
  });

  it('Should create a url with only required properties', () => {
    const url = new Url('https://example.com', 'abc123');

    expect(url.originalUrl).toBe('https://example.com');
    expect(url.code).toBe('abc123');
    expect(url.userId).toBeNull();
    expect(url.id).toBeUndefined();
    expect(url.clicks).toBeUndefined();
    expect(url.createdAt).toBeUndefined();
    expect(url.updatedAt).toBeUndefined();
    expect(url.deletedAt).toBeNull();
  });
});
