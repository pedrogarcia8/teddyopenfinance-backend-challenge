import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UrlController } from './url.controller';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { UpdateUserUrlByIdUseCase } from '../../application/use-cases/update-user-url-by-id.use-case';
import { RemoveUserUrlByIdUseCase } from '../../application/use-cases/remove-user-url-by-id.use-case';
import { NotFoundError } from './../../../../common/errors';
import { AuthModule } from './../../../../shared/auth/auth.module';
import jwtTokenGenerator from './../../../../common/utils/jwt-token-generator';

describe('UrlController (e2e)', () => {
  let app: INestApplication;
  let shortenUrlUseCase: ShortenUrlUseCase;
  let listUserUrlsUseCase: ListUserUrlsUseCase;
  let updateUserUrlByIdUseCase: UpdateUserUrlByIdUseCase;
  let removeUserUrlByIdUseCase: RemoveUserUrlByIdUseCase;
  let token: string;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'secret';

    token = jwtTokenGenerator('user-email', 'user-id');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      imports: [AuthModule],
      providers: [
        {
          provide: ShortenUrlUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListUserUrlsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateUserUrlByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RemoveUserUrlByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
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

    shortenUrlUseCase = moduleFixture.get<ShortenUrlUseCase>(ShortenUrlUseCase);
    listUserUrlsUseCase =
      moduleFixture.get<ListUserUrlsUseCase>(ListUserUrlsUseCase);
    updateUserUrlByIdUseCase = moduleFixture.get<UpdateUserUrlByIdUseCase>(
      UpdateUserUrlByIdUseCase,
    );
    removeUserUrlByIdUseCase = moduleFixture.get<RemoveUserUrlByIdUseCase>(
      RemoveUserUrlByIdUseCase,
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /url/shorten', () => {
    it('Should shorten a url successfully', async () => {
      const originalUrl = 'https://example.com';
      const code = 'abc123';

      (shortenUrlUseCase.execute as jest.Mock).mockResolvedValueOnce(code);

      const response = await request(app.getHttpServer() as unknown as App)
        .post('/url/shorten')
        .set('Authorization', `Bearer ${token}`)
        .send({ originalUrl })
        .expect(201);

      expect(response.body).toBeDefined();
      expect((response.body as { url: string }).url).toContain(code);
    });

    it('Should return 500 if an unexpected error occurs', async () => {
      (shortenUrlUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      );

      await request(app.getHttpServer() as unknown as App)
        .post('/url/shorten')
        .send({ originalUrl: 'https://example.com' })
        .expect(500);
    });
  });

  describe('GET /url/user', () => {
    it('Should return user urls', async () => {
      const urls = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          code: 'abc123',
          userId: 'user1',
        },
      ];

      (listUserUrlsUseCase.execute as jest.Mock).mockResolvedValueOnce(urls);

      const response = await request(app.getHttpServer() as unknown as App)
        .get('/url/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(urls);
    });

    it('Should return 500 if an unexpected error occurs', async () => {
      (listUserUrlsUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      );

      await request(app.getHttpServer() as unknown as App)
        .get('/url/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });

  describe('PATCH /url/user/:id', () => {
    it('Should update a user url successfully', async () => {
      (updateUserUrlByIdUseCase.execute as jest.Mock).mockResolvedValueOnce(
        true,
      );

      await request(app.getHttpServer() as unknown as App)
        .patch('/url/user/abc123')
        .set('Authorization', `Bearer ${token}`)
        .send({ originalUrl: 'https://updated.com' })
        .expect(200)
        .expect({ message: 'Url updated successfully' });
    });

    it('Should return 404 if url not found', async () => {
      (updateUserUrlByIdUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new NotFoundError('Url not found'),
      );

      await request(app.getHttpServer() as unknown as App)
        .patch('/url/user/invalidid')
        .set('Authorization', `Bearer ${token}`)
        .send({ originalUrl: 'https://updated.com' })
        .expect(404);
    });

    it('Should return 500 if an unexpected error occurs', async () => {
      (updateUserUrlByIdUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      );

      await request(app.getHttpServer() as unknown as App)
        .patch('/url/user/abc123')
        .set('Authorization', `Bearer ${token}`)
        .send({ originalUrl: 'https://updated.com' })
        .expect(500);
    });
  });

  describe('DELETE /url/user/:id', () => {
    it('Should delete a user url successfully', async () => {
      (removeUserUrlByIdUseCase.execute as jest.Mock).mockResolvedValueOnce(
        true,
      );

      await request(app.getHttpServer() as unknown as App)
        .delete('/url/user/abc123')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('Should return 404 if url not found', async () => {
      (removeUserUrlByIdUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new NotFoundError('Url not found'),
      );

      await request(app.getHttpServer() as unknown as App)
        .delete('/url/user/invalidid')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('Should return 500 if an unexpected error occurs', async () => {
      (removeUserUrlByIdUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new Error('Unexpected error'),
      );

      await request(app.getHttpServer() as unknown as App)
        .delete('/url/user/abc123')
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });
});
