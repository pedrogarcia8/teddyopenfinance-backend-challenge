/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateUserUrlByIdUseCase } from './update-user-url-by-id.use-case';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { InvalidIdError } from './../../../../common/errors';
import isValidUUID from './../../../../common/utils/is-valid-uuid';

jest.mock('./../../../../common/utils/is-valid-uuid', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('UpdateUserUrlByIdUseCase', () => {
  let updateUserUrlByIdUseCase: UpdateUserUrlByIdUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    urlRepository = {
      updateUserUrlById: jest.fn(),
    } as unknown as jest.Mocked<UrlRepository>;

    updateUserUrlByIdUseCase = new UpdateUserUrlByIdUseCase(urlRepository);
  });

  it('Should throw InvalidIdError if urlId is not a valid UUID', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(false);

    await expect(
      updateUserUrlByIdUseCase.execute(
        'user-id',
        'invalid-uuid',
        'https://example.com',
      ),
    ).rejects.toThrow(InvalidIdError);

    expect(urlRepository.updateUserUrlById).not.toHaveBeenCalled();
  });

  it('Should call repository and return true when update succeeds', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(true);
    urlRepository.updateUserUrlById.mockResolvedValue(true);

    const result = await updateUserUrlByIdUseCase.execute(
      'user-id',
      'valid-uuid',
      'https://example.com',
    );

    expect(isValidUUID).toHaveBeenCalledWith('valid-uuid');
    expect(urlRepository.updateUserUrlById).toHaveBeenCalledWith(
      'user-id',
      'valid-uuid',
      'https://example.com',
    );
    expect(result).toBe(true);
  });

  it('Should call repository and return false when update fails', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(true);
    urlRepository.updateUserUrlById.mockResolvedValue(false);

    const result = await updateUserUrlByIdUseCase.execute(
      'user-id',
      'valid-uuid',
      'https://example.com',
    );

    expect(isValidUUID).toHaveBeenCalledWith('valid-uuid');
    expect(urlRepository.updateUserUrlById).toHaveBeenCalledWith(
      'user-id',
      'valid-uuid',
      'https://example.com',
    );
    expect(result).toBe(false);
  });
});
