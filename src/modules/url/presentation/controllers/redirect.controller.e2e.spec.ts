import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RedirectController } from './redirect.controller';
import { ResolveUrlUseCase } from '../../application/use-cases/resolver-url.use-case';
import { NotFoundError } from './../../../../common/errors';
import { App } from 'supertest/types';

describe('RedirectController (e2e)', () => {
  let app: INestApplication;
  let resolveUrlUseCase: ResolveUrlUseCase;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: ResolveUrlUseCase,
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
    resolveUrlUseCase = moduleFixture.get<ResolveUrlUseCase>(ResolveUrlUseCase);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Should redirect to the original url when found', async () => {
    const code = 'abc123';
    const originalUrl = 'https://example.com';

    (resolveUrlUseCase.execute as jest.Mock).mockResolvedValueOnce(originalUrl);

    const response = await request(app.getHttpServer() as unknown as App)
      .get(`/${code}`)
      .expect(302);

    expect(response.header['location']).toBe(originalUrl);
  });

  it('Should return 404 if url not found', async () => {
    const code = 'notfound123';

    (resolveUrlUseCase.execute as jest.Mock).mockRejectedValueOnce(
      new NotFoundError('URL not found'),
    );

    await request(app.getHttpServer() as unknown as App)
      .get(`/${code}`)
      .expect(404);
  });

  it('Should return 500 if an unexpected error occurs', async () => {
    const code = 'error123';

    (resolveUrlUseCase.execute as jest.Mock).mockRejectedValueOnce(
      new Error('Unexpected error'),
    );

    await request(app.getHttpServer() as unknown as App)
      .get(`/${code}`)
      .expect(500);
  });
});
