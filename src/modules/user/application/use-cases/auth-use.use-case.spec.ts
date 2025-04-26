/* eslint-disable @typescript-eslint/unbound-method */
import { AuthUserUseCase } from './auth-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  InvalidCredentialsError,
  NotFoundError,
} from '../../../../common/errors';
import * as bcrypt from 'bcryptjs';
import JwtTokenGenerator from '../../../../common/utils/jwt-token-generator';

jest.mock('bcryptjs');
jest.mock('../../../../common/utils/jwt-token-generator');

describe('AuthUserUseCase', () => {
  let authUserUseCase: AuthUserUseCase;
  let userRepositoryMock: UserRepository;
  const userBase = {
    email: 'test@example.com',
    password: 'password123',
    id: 'd8c3c7c2-d874-47fb-8a6f-6945d9447e9d',
  };

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
    } as unknown as UserRepository;

    authUserUseCase = new AuthUserUseCase(userRepositoryMock);
  });

  it('Should authenticate a user and return a token', async () => {
    const user = userBase;
    const token = 'fake_token';

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (JwtTokenGenerator as jest.Mock).mockReturnValue(token);

    const result = await authUserUseCase.execute(user.email, user.password);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
    expect(JwtTokenGenerator).toHaveBeenCalledWith(user.email, user.id);
    expect(result).toBe(token);
  });

  it('Should throw NotFoundError if user is not found', async () => {
    const user = userBase;

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      authUserUseCase.execute(user.email, user.password),
    ).rejects.toThrow(NotFoundError);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
  });

  it('Should throw InvalidCredentialsError if password is invalid', async () => {
    const user = { ...userBase, password: 'hashed_password' };
    const password = 'wrong_password';

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authUserUseCase.execute(user.email, password)).rejects.toThrow(
      InvalidCredentialsError,
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
  });

  it('Should call JwtTokenGenerator with correct parameters', async () => {
    const user = userBase;
    const token = 'fake_token';

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (JwtTokenGenerator as jest.Mock).mockReturnValue(token);

    const result = await authUserUseCase.execute(user.email, user.password);

    expect(JwtTokenGenerator).toHaveBeenCalledWith(user.email, user.id);
    expect(result).toBe(token);
  });
});
