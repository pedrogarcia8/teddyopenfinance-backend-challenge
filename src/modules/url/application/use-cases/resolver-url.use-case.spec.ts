/* eslint-disable @typescript-eslint/unbound-method */
import { ResolveUrlUseCase } from './resolver-url.use-case';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { NotFoundError } from './../../../../common/errors';
import { Url } from '../../domain/entities/url.entity';

describe('ResolveUrlUseCase', () => {
  let resolveUrlUseCase: ResolveUrlUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    urlRepository = {
      findByCode: jest.fn(),
      updateClicks: jest.fn(),
    } as unknown as jest.Mocked<UrlRepository>;

    resolveUrlUseCase = new ResolveUrlUseCase(urlRepository);
  });

  it('Should throw NotFoundError if url not found', async () => {
    urlRepository.findByCode.mockResolvedValue(null);

    await expect(resolveUrlUseCase.execute('invalid-code')).rejects.toThrow(
      NotFoundError,
    );

    expect(urlRepository.findByCode).toHaveBeenCalledWith('invalid-code');
    expect(urlRepository.updateClicks).not.toHaveBeenCalled();
  });

  it('Should return original url and update clicks if URL is found', async () => {
    const url = new Url('https://example.com', 'test-code');
    urlRepository.findByCode.mockResolvedValue(url);
    urlRepository.updateClicks.mockResolvedValue();

    const result = await resolveUrlUseCase.execute('test-code');

    expect(urlRepository.findByCode).toHaveBeenCalledWith('test-code');
    expect(urlRepository.updateClicks).toHaveBeenCalledWith('test-code');
    expect(result).toBe('https://example.com');
  });
});
