/* eslint-disable @typescript-eslint/unbound-method */
import { ShortenUrlUseCase } from './shorten-url.use-case';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';
import { randomBytes } from 'crypto';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('ShortenUrlUseCase', () => {
  let shortenUrlUseCase: ShortenUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;
  const urlBase = {
    originalUrl: 'https://example.com',
    code: 'abc123',
  };

  beforeEach(() => {
    urlRepository = {
      findByOriginalUrl: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UrlRepository>;

    shortenUrlUseCase = new ShortenUrlUseCase(urlRepository);
  });

  it('Should return existing code if original URL already exists', async () => {
    const existingUrl = new Url(urlBase.originalUrl, urlBase.code);
    urlRepository.findByOriginalUrl.mockResolvedValue(existingUrl);

    const result = await shortenUrlUseCase.execute(urlBase.originalUrl, null);

    expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(
      urlBase.originalUrl,
    );
    expect(result).toBe(urlBase.code);
    expect(urlRepository.create).not.toHaveBeenCalled();
  });

  it('Should generate a new code, create url and return code if original url does not exist', async () => {
    urlRepository.findByOriginalUrl.mockResolvedValue(null);
    urlRepository.findByCode.mockResolvedValue(null);
    (randomBytes as jest.Mock).mockReturnValue(urlBase.code);

    const result = await shortenUrlUseCase.execute(urlBase.originalUrl, null);

    expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(
      urlBase.originalUrl,
    );
    expect(urlRepository.findByCode).toHaveBeenCalledWith(urlBase.code);
    expect(urlRepository.create).toHaveBeenCalledWith(expect.any(Url));
    expect(result).toBe(urlBase.code);
  });

  it('Should retry generating code if generated code already exists', async () => {
    urlRepository.findByOriginalUrl.mockResolvedValue(null);
    (randomBytes as jest.Mock)
      .mockReturnValueOnce(urlBase.code)
      .mockReturnValueOnce('unique');

    urlRepository.findByCode
      .mockResolvedValueOnce(new Url(urlBase.originalUrl, urlBase.code))
      .mockResolvedValueOnce(null);

    const result = await shortenUrlUseCase.execute('http://example2.com', null);

    expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(
      'http://example2.com',
    );
    expect(urlRepository.findByCode).toHaveBeenNthCalledWith(1, urlBase.code);
    expect(urlRepository.findByCode).toHaveBeenNthCalledWith(2, 'unique');
    expect(urlRepository.create).toHaveBeenCalledWith(expect.any(Url));
    expect(result).toBe('unique');
  });
});
