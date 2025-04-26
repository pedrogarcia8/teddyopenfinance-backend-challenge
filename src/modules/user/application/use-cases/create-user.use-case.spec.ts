/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserAlreadyExistsError } from './../../../../common/errors/user-already-exists.error';
import * as bcrypt from 'bcryptjs';
import JwtTokenGenerator from './../../../../common/utils/jwt-token-generator';

jest.mock('bcryptjs');
jest.mock('../../../../common/utils/jwt-token-generator');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepositoryMock: UserRepository;
  const userBase = {
    email: 'test@example.com',
    password: 'password123',
    id: 'd8c3c7c2-d874-47fb-8a6f-6945d9447e9d',
  };

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as UserRepository;

    createUserUseCase = new CreateUserUseCase(userRepositoryMock);
  });

  it('Should create a user and return a token', async () => {
    const encryptedPassword = 'hashed_password';
    const user = userBase;
    const token = 'fake_token';

    (bcrypt.hash as jest.Mock).mockResolvedValue(encryptedPassword);

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepositoryMock.create as jest.Mock).mockResolvedValue(user);

    (JwtTokenGenerator as jest.Mock).mockReturnValue(token);

    const result = await createUserUseCase.execute(user.email, user.password);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(user.email);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: user.email,
        password: encryptedPassword,
      }),
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
    expect(JwtTokenGenerator).toHaveBeenCalledWith(user.email, user.id);
    expect(result).toBe(token);
  });

  it('Should throw UserAlreadyExistsError if the user already exists', async () => {
    const user = userBase;
    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue({
      email: user.email,
    });

    await expect(
      createUserUseCase.execute(user.email, user.password),
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  it('Should call bcrypt.hash with correct password', async () => {
    const user = userBase;
    const encryptedPassword = 'hashed_password';

    (bcrypt.hash as jest.Mock).mockResolvedValue(encryptedPassword);

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepositoryMock.create as jest.Mock).mockResolvedValue({
      email: user.email,
      password: encryptedPassword,
    });

    await createUserUseCase.execute(user.email, user.password);

    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
  });

  it('Should call JwtTokenGenerator with the correct parameters', async () => {
    const encryptedPassword = 'hashed_password';
    const user = userBase;
    const token = 'fake_token';

    (bcrypt.hash as jest.Mock).mockResolvedValue(encryptedPassword);

    (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepositoryMock.create as jest.Mock).mockResolvedValue(user);

    (JwtTokenGenerator as jest.Mock).mockReturnValue(token);

    const result = await createUserUseCase.execute(user.email, user.password);

    expect(JwtTokenGenerator).toHaveBeenCalledWith(user.email, user.id);
    expect(result).toBe(token);
  });
});
