/* eslint-disable @typescript-eslint/unbound-method */
import { RedirectController } from './redirect.controller';
import { ResolveUrlUseCase } from '../../application/use-cases/resolver-url.use-case';
import { NotFoundError } from './../../../../common/errors';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

describe('RedirectController', () => {
  let controller: RedirectController;
  let resolveUrlUseCase: jest.Mocked<ResolveUrlUseCase>;
  let response: Response;

  beforeEach(() => {
    resolveUrlUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ResolveUrlUseCase>;

    response = {
      redirect: jest.fn(),
    } as unknown as Response;

    controller = new RedirectController(resolveUrlUseCase);
  });

  it('Should redirect to the original url when found', async () => {
    const code = 'abc123';
    const originalUrl = 'https://example.com';
    resolveUrlUseCase.execute.mockResolvedValue(originalUrl);

    await controller.redirect(code, response);

    expect(resolveUrlUseCase.execute).toHaveBeenCalledWith(code);
    expect(response.redirect).toHaveBeenCalledWith(302, originalUrl);
  });

  it('Should throw NotFoundException if url is not found', async () => {
    const code = 'abc123';
    resolveUrlUseCase.execute.mockRejectedValue(
      new NotFoundError('URL not found'),
    );

    await expect(controller.redirect(code, response)).rejects.toThrow(
      NotFoundException,
    );

    expect(resolveUrlUseCase.execute).toHaveBeenCalledWith(code);
    expect(response.redirect).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const code = 'abc123';
    resolveUrlUseCase.execute.mockRejectedValue(new Error('Unexpected error'));

    await expect(controller.redirect(code, response)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(resolveUrlUseCase.execute).toHaveBeenCalledWith(code);
    expect(response.redirect).not.toHaveBeenCalled();
  });
});
