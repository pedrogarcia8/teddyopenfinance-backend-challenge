/* eslint-disable @typescript-eslint/unbound-method */
import { Url } from '../entities/url.entity';
import { UrlRepository } from './url.repository';

describe('UrlRepository (mocked)', () => {
  let urlRepository: jest.Mocked<UrlRepository>;
  const UrlBase = {
    code: 'abc123',
    originalUrl: 'https://example.com',
  };

  beforeEach(() => {
    urlRepository = {
      create: jest.fn(),
      findByCode: jest.fn(),
      findByOriginalUrl: jest.fn(),
      updateClicks: jest.fn(),
      listUrlsByUserId: jest.fn(),
      updateUserUrlById: jest.fn(),
      removeUrlById: jest.fn(),
    };
  });

  it('Should create a url', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code);

    urlRepository.create.mockResolvedValue();

    await urlRepository.create(url);

    expect(urlRepository.create).toHaveBeenCalledWith(url);
  });

  it('Should find a url by code', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code);

    urlRepository.findByCode.mockResolvedValue(url);

    const foundUrl = await urlRepository.findByCode(url.code);

    expect(foundUrl).toEqual(url);
    expect(urlRepository.findByCode).toHaveBeenCalledWith(url.code);
  });

  it('Should return null if url is not found', async () => {
    urlRepository.findByCode.mockResolvedValue(null);

    const foundUser = await urlRepository.findByCode(UrlBase.code);

    expect(foundUser).toBeNull();
    expect(urlRepository.findByCode).toHaveBeenCalledWith(UrlBase.code);
  });

  it('Should find a url by originalUrl', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code);

    urlRepository.findByOriginalUrl.mockResolvedValue(url);

    const foundUrl = await urlRepository.findByOriginalUrl(url.originalUrl);

    expect(foundUrl).toEqual(url);
    expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(
      url.originalUrl,
    );
  });

  it('Should return null if url is not found', async () => {
    urlRepository.findByOriginalUrl.mockResolvedValue(null);

    const foundUser = await urlRepository.findByOriginalUrl(
      UrlBase.originalUrl,
    );

    expect(foundUser).toBeNull();
    expect(urlRepository.findByOriginalUrl).toHaveBeenCalledWith(
      UrlBase.originalUrl,
    );
  });

  it('Should update url clicks', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code);

    urlRepository.create.mockResolvedValue();

    await urlRepository.create(url);

    expect(urlRepository.create).toHaveBeenCalledWith(url);
    await urlRepository.updateClicks(url.code);
    expect(urlRepository.updateClicks).toHaveBeenCalledWith(url.code);
  });

  it('Should list user urls', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code, 'userId');

    urlRepository.create.mockResolvedValue();

    await urlRepository.create(url);

    expect(urlRepository.create).toHaveBeenCalledWith(url);
    urlRepository.listUrlsByUserId.mockResolvedValue([url]);
    const urls = await urlRepository.listUrlsByUserId(url.userId as string);
    expect(urls).toEqual([url]);
    expect(urlRepository.listUrlsByUserId).toHaveBeenCalledWith(url.userId);
  });

  it('Should update user url by id', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code, 'userId');

    urlRepository.create.mockResolvedValue();

    await urlRepository.create(url);

    expect(urlRepository.create).toHaveBeenCalledWith(url);
    urlRepository.updateUserUrlById.mockResolvedValue(true);
    const updated = await urlRepository.updateUserUrlById(
      url.userId as string,
      url.id as string,
      url.originalUrl,
    );
    expect(updated).toBe(true);
    expect(urlRepository.updateUserUrlById).toHaveBeenCalledWith(
      url.userId,
      url.id,
      url.originalUrl,
    );
  });

  it('Should remove user url by id', async () => {
    const url = new Url(UrlBase.originalUrl, UrlBase.code, 'userId');

    urlRepository.create.mockResolvedValue();

    await urlRepository.create(url);

    expect(urlRepository.create).toHaveBeenCalledWith(url);
    urlRepository.removeUrlById.mockResolvedValue(true);
    const removed = await urlRepository.removeUrlById(
      url.userId as string,
      url.id as string,
    );
    expect(removed).toBe(true);
    expect(urlRepository.removeUrlById).toHaveBeenCalledWith(
      url.userId,
      url.id,
    );
  });
});
