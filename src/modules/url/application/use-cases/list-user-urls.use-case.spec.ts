/* eslint-disable @typescript-eslint/unbound-method */
import { ListUserUrlsUseCase } from './list-user-urls.use-case';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';

describe('ListUserUrlsUseCase', () => {
  let listUserUrlsUseCase: ListUserUrlsUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    urlRepository = {
      listUrlsByUserId: jest.fn(),
    } as unknown as jest.Mocked<UrlRepository>;

    listUserUrlsUseCase = new ListUserUrlsUseCase(urlRepository);
  });

  it('Should list user urls', async () => {
    const urls = [
      new Url('https://example1.com', 'abc123', 'user1'),
      new Url('https://example2.com', 'def456', 'user1'),
    ];

    urlRepository.listUrlsByUserId.mockResolvedValue(urls);

    const result = await listUserUrlsUseCase.execute('user1');

    expect(urlRepository.listUrlsByUserId).toHaveBeenCalledWith('user1');
    expect(result).toEqual(urls);
  });

  it('Should return an empty array if user has no urls', async () => {
    urlRepository.listUrlsByUserId.mockResolvedValue([]);

    const result = await listUserUrlsUseCase.execute('user1');

    expect(urlRepository.listUrlsByUserId).toHaveBeenCalledWith('user1');
    expect(result).toEqual([]);
  });
});
