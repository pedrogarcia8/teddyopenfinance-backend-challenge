/* eslint-disable @typescript-eslint/unbound-method */
import { UrlRepositoryImpl } from './url.repository.impl';
import { Repository } from 'typeorm';
import { UrlOrmEntity } from '../entities/url.entity';
import { Url } from '../../domain/entities/url.entity';

describe('Url Repository Impl', () => {
  let urlRepositoryImpl: UrlRepositoryImpl;
  let repository: jest.Mocked<Repository<UrlOrmEntity>>;
  const urlBase = {
    originalUrl: 'https://example.com',
    code: 'abc123',
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<UrlOrmEntity>>;

    urlRepositoryImpl = new UrlRepositoryImpl(repository);
  });

  it('Should create a new url', async () => {
    const url = new Url(urlBase.originalUrl, urlBase.code);

    repository.create.mockReturnValue(url as unknown as UrlOrmEntity);
    repository.save.mockResolvedValue(url as unknown as UrlOrmEntity);

    await urlRepositoryImpl.create(url);

    expect(repository.create).toHaveBeenCalledWith(url);
    expect(repository.save).toHaveBeenCalledWith(url);
  });

  it('Should find url by code', async () => {
    repository.findOne.mockResolvedValue(urlBase as UrlOrmEntity);

    const result = await urlRepositoryImpl.findByCode(urlBase.code);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { code: urlBase.code },
    });
    expect(result).toEqual(new Url(urlBase.originalUrl, urlBase.code));
  });

  it('Should return null if url not found by code', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await urlRepositoryImpl.findByCode(urlBase.code);

    expect(result).toBeNull();
  });

  it('Should find url by original url', async () => {
    repository.findOne.mockResolvedValue(urlBase as UrlOrmEntity);

    const result = await urlRepositoryImpl.findByOriginalUrl(
      urlBase.originalUrl,
    );

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { originalUrl: urlBase.originalUrl },
    });
    expect(result).toEqual(new Url(urlBase.originalUrl, urlBase.code));
  });

  it('Should return null if url not found by original url', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await urlRepositoryImpl.findByOriginalUrl(
      urlBase.originalUrl,
    );

    expect(result).toBeNull();
  });

  it('Should update clicks', async () => {
    const url = { ...urlBase, clicks: 0 } as UrlOrmEntity;

    repository.findOne.mockResolvedValue(url);
    repository.save.mockResolvedValue(url);

    await urlRepositoryImpl.updateClicks(urlBase.code);

    expect(url.clicks).toBe(1);
    expect(repository.save).toHaveBeenCalledWith(url);
  });

  it('Should not update clicks if url not found', async () => {
    repository.findOne.mockResolvedValue(null);

    await urlRepositoryImpl.updateClicks(urlBase.code);

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('Should list urls by user id', async () => {
    const urls = [{ ...urlBase, userId: 'user1' }] as UrlOrmEntity[];

    repository.find.mockResolvedValue(urls);

    const result = await urlRepositoryImpl.listUrlsByUserId('user1');

    expect(repository.find).toHaveBeenCalledWith({
      where: { userId: 'user1', deletedAt: undefined },
    });
    expect(result).toEqual(urls);
  });

  it('Should update user url by id', async () => {
    const url = { ...urlBase, id: 'url1', userId: 'user1' } as UrlOrmEntity;

    repository.findOne.mockResolvedValue(url);
    repository.save.mockResolvedValue(url);

    const result = await urlRepositoryImpl.updateUserUrlById(
      'user1',
      'url1',
      'https://new-url.com',
    );

    expect(url.originalUrl).toBe('https://new-url.com');
    expect(url.clicks).toBe(0);
    expect(repository.save).toHaveBeenCalledWith(url);
    expect(result).toBe(true);
  });

  it('Should return false if url to update not found', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await urlRepositoryImpl.updateUserUrlById(
      'user1',
      'url1',
      'https://new-url.com',
    );

    expect(result).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('Should remove url by id', async () => {
    const url = {
      ...urlBase,
      id: 'url1',
      userId: 'user1',
      deletedAt: null,
    } as UrlOrmEntity;

    repository.findOne.mockResolvedValue(url);
    repository.save.mockResolvedValue(url);

    const result = await urlRepositoryImpl.removeUrlById('user1', 'url1');

    expect(url.deletedAt).toBeInstanceOf(Date);
    expect(repository.save).toHaveBeenCalledWith(url);
    expect(result).toBe(true);
  });

  it('Should return false if url to remove not found', async () => {
    repository.findOne.mockResolvedValue(null);

    const result = await urlRepositoryImpl.removeUrlById('user1', 'url1');

    expect(result).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
