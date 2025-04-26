/* eslint-disable @typescript-eslint/unbound-method */
import { RemoveUserUrlByIdUseCase } from './remove-user-url-by-id.use-case';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { InvalidIdError } from './../../../../common/errors';
import isValidUUID from './../../../../common/utils/is-valid-uuid';

jest.mock('./../../../../common/utils/is-valid-uuid', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('RemoveUserUrlByIdUseCase', () => {
  let removeUserUrlByIdUseCase: RemoveUserUrlByIdUseCase;
  let urlRepository: jest.Mocked<UrlRepository>;

  beforeEach(() => {
    urlRepository = {
      removeUrlById: jest.fn(),
    } as unknown as jest.Mocked<UrlRepository>;

    removeUserUrlByIdUseCase = new RemoveUserUrlByIdUseCase(urlRepository);
  });

  it('Should throw InvalidIdError if urlId is invalid', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(false);

    await expect(
      removeUserUrlByIdUseCase.execute('user-id', 'invalid-uuid'),
    ).rejects.toThrow(InvalidIdError);

    expect(urlRepository.removeUrlById).not.toHaveBeenCalled();
  });

  it('Should remove a user url and return true if successful', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(true);
    urlRepository.removeUrlById.mockResolvedValue(true);

    const result = await removeUserUrlByIdUseCase.execute(
      'user-id',
      'valid-uuid',
    );

    expect(isValidUUID).toHaveBeenCalledWith('valid-uuid');
    expect(urlRepository.removeUrlById).toHaveBeenCalledWith(
      'user-id',
      'valid-uuid',
    );
    expect(result).toBe(true);
  });

  it('Should remove a user url and return false if url not found', async () => {
    (isValidUUID as jest.Mock).mockReturnValue(true);
    urlRepository.removeUrlById.mockResolvedValue(false);

    const result = await removeUserUrlByIdUseCase.execute(
      'user-id',
      'valid-uuid',
    );

    expect(isValidUUID).toHaveBeenCalledWith('valid-uuid');
    expect(urlRepository.removeUrlById).toHaveBeenCalledWith(
      'user-id',
      'valid-uuid',
    );
    expect(result).toBe(false);
  });
});
