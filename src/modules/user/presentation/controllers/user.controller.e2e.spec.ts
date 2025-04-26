import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';
import {
  InvalidCredentialsError,
  NotFoundError,
  UserAlreadyExistsError,
} from './../../../../common/errors';
import { App } from 'supertest/types';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createUserUseCase: CreateUserUseCase;
  let authUserUseCase: AuthUserUseCase;
  const userBase = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as CreateUserUseCase;

    authUserUseCase = {
      execute: jest.fn(),
    } as unknown as AuthUserUseCase;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: createUserUseCase },
        { provide: AuthUserUseCase, useValue: authUserUseCase },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/user (POST)', () => {
    it('Should create a user and return a token', async () => {
      const token = 'fake_token';
      (createUserUseCase.execute as jest.Mock).mockResolvedValue(token);

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/user')
        .send({ ...userBase })
        .expect(201);

      expect(response.body).toEqual({ token });
    });

    it('Should return 406 if user already exists', async () => {
      (createUserUseCase.execute as jest.Mock).mockRejectedValue(
        new UserAlreadyExistsError(),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/user')
        .send({ ...userBase })
        .expect(406);
    });

    it('Should return 422 if user email is invalid', async () => {
      await request(app.getHttpServer() as unknown as App)
        .post('/user')
        .send({ ...userBase, email: 'invalid-email' })
        .expect(422);
    });

    it('Should return 422 if user password is invalid', async () => {
      await request(app.getHttpServer() as unknown as App)
        .post('/user')
        .send({ ...userBase, password: '' })
        .expect(422);
    });

    it('Should return 500 on unexpected error', async () => {
      (createUserUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected'),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/user')
        .send({ ...userBase })
        .expect(500);
    });
  });

  describe('/user/auth (POST)', () => {
    it('Should authenticate a user and return a token', async () => {
      const token = 'fake_token';
      (authUserUseCase.execute as jest.Mock).mockResolvedValue(token);

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/user/auth')
        .send({ ...userBase })
        .expect(200);

      expect(response.body).toEqual({ token });
    });

    it('Should return 404 if user not found', async () => {
      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new NotFoundError('User not found'),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/user/auth')
        .send({ ...userBase })
        .expect(404);
    });

    it('Should return 403 if invalid credentials', async () => {
      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new InvalidCredentialsError(),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/user/auth')
        .send({ ...userBase, password: 'wrongpassword' })
        .expect(403);
    });

    it('Should return 500 on unexpected error', async () => {
      (authUserUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Unexpected'),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/user/auth')
        .send({ ...userBase })
        .expect(500);
    });
  });
});
