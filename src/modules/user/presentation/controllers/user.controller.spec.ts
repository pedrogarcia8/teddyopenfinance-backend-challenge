/* eslint-disable @typescript-eslint/unbound-method */
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  InvalidCredentialsError,
  NotFoundError,
  UserAlreadyExistsError,
} from './../../../../common/errors';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let createUserUseCase: CreateUserUseCase;
  let authUserUseCase: AuthUserUseCase;
  const userBase = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as CreateUserUseCase;

    authUserUseCase = {
      execute: jest.fn(),
    } as unknown as AuthUserUseCase;

    userController = new UserController(createUserUseCase, authUserUseCase);
  });

  describe('Create', () => {
    it('Should create a user and return a token', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };
      const token = 'fake_token';

      (createUserUseCase.execute as jest.Mock).mockResolvedValue(token);

      const result = await userController.create(body);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(
        body.email,
        body.password,
      );
      expect(result).toEqual({ token });
    });

    it('Should throw NotAcceptableException if user already exists', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };

      (createUserUseCase.execute as jest.Mock).mockRejectedValue(
        new UserAlreadyExistsError(),
      );

      await expect(userController.create(body)).rejects.toThrow(
        NotAcceptableException,
      );
    });

    it('Should throw InternalServerErrorException on unexpected error', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };

      (createUserUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(userController.create(body)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Auth', () => {
    it('Should authenticate a user and return a token', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };
      const token = 'fake_token';

      (authUserUseCase.execute as jest.Mock).mockResolvedValue(token);

      const result = await userController.auth(body);

      expect(authUserUseCase.execute).toHaveBeenCalledWith(
        body.email,
        body.password,
      );
      expect(result).toEqual({ token });
    });

    it('Should throw NotFoundException if user is not found', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };

      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new NotFoundError('User not found'),
      );

      await expect(userController.auth(body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should throw ForbiddenException if credentials are invalid', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };

      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new InvalidCredentialsError(),
      );

      await expect(userController.auth(body)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('Should throw InternalServerErrorException on unexpected error', async () => {
      const body: CreateUserDto = {
        email: userBase.email,
        password: userBase.password,
      };

      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(userController.auth(body)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
