/* eslint-disable @typescript-eslint/unbound-method */
import { UrlController } from './url.controller';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { UpdateUserUrlByIdUseCase } from '../../application/use-cases/update-user-url-by-id.use-case';
import { RemoveUserUrlByIdUseCase } from '../../application/use-cases/remove-user-url-by-id.use-case';
import {
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InvalidIdError } from './../../../../common/errors';
import { Request } from 'express';

describe('UrlController', () => {
  let controller: UrlController;
  let shortenUrlUseCase: jest.Mocked<ShortenUrlUseCase>;
  let listUserUrlsUseCase: jest.Mocked<ListUserUrlsUseCase>;
  let updateUserUrlByIdUseCase: jest.Mocked<UpdateUserUrlByIdUseCase>;
  let removeUserUrlByIdUseCase: jest.Mocked<RemoveUserUrlByIdUseCase>;
  const userBase = {
    id: 'user-id',
    email: 'user-email',
  };
  const reqBase = {
    protocol: 'https',
    get: () => 'localhost:3000',
  } as unknown as Request;

  beforeEach(() => {
    shortenUrlUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ShortenUrlUseCase>;

    listUserUrlsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListUserUrlsUseCase>;

    updateUserUrlByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateUserUrlByIdUseCase>;

    removeUserUrlByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RemoveUserUrlByIdUseCase>;

    controller = new UrlController(
      shortenUrlUseCase,
      listUserUrlsUseCase,
      updateUserUrlByIdUseCase,
      removeUserUrlByIdUseCase,
    );
  });

  describe('Shorten', () => {
    it('Should return shortened url', async () => {
      const body = { originalUrl: 'https://example.com' };
      const user = userBase;
      const req = reqBase;

      shortenUrlUseCase.execute.mockResolvedValueOnce('abc123');

      const result = await controller.shorten(body, user, req);

      expect(result).toEqual({ url: 'https://localhost:3000/abc123' });
      expect(shortenUrlUseCase.execute).toHaveBeenCalledWith(
        'https://example.com',
        userBase.id,
      );
    });

    it('Should throw InternalServerErrorException on error', async () => {
      shortenUrlUseCase.execute.mockRejectedValueOnce(
        new Error('Unexpected error'),
      );

      const body = { originalUrl: 'https://example.com' };
      const user = userBase;
      const req = reqBase;

      await expect(controller.shorten(body, user, req)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('ListUrlsByUserId', () => {
    it('Should return list of urls', async () => {
      const user = userBase;
      const urls = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          code: 'abc123',
          userId: userBase.id,
        },
      ];

      listUserUrlsUseCase.execute.mockResolvedValueOnce(urls);

      const result = await controller.listUrlsByUserId(user);

      expect(result).toEqual(urls);
      expect(listUserUrlsUseCase.execute).toHaveBeenCalledWith(userBase.id);
    });

    it('Should return empty array if no user id', async () => {
      const user = { id: '', email: '' };

      const result = await controller.listUrlsByUserId(user);

      expect(result).toEqual([]);
    });
  });

  describe('UpdateUserUrlById', () => {
    it('Should update url successfully', async () => {
      const user = userBase;
      const body = { originalUrl: 'https://example-updated.com' };
      const urlId = 'url-id';

      updateUserUrlByIdUseCase.execute.mockResolvedValueOnce(true);

      const result = await controller.updateUserUrlById(user, body, urlId);

      expect(result).toEqual({ message: 'Url updated successfully' });
      expect(updateUserUrlByIdUseCase.execute).toHaveBeenCalledWith(
        userBase.id,
        urlId,
        'https://example-updated.com',
      );
    });

    it('Should throw NotFoundException if url not found', async () => {
      const user = userBase;
      const body = { originalUrl: 'https://example-updated.com' };
      const urlId = 'url-id';

      updateUserUrlByIdUseCase.execute.mockResolvedValueOnce(false);

      await expect(
        controller.updateUserUrlById(user, body, urlId),
      ).rejects.toThrow(NotFoundException);
    });

    it('Should throw ForbiddenException if no user id', async () => {
      const user = { id: '', email: '' };
      const body = { originalUrl: 'https://example-updated.com' };
      const urlId = 'url-id';

      await expect(
        controller.updateUserUrlById(user, body, urlId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('Should throw BadRequestException if InvalidIdError is thrown', async () => {
      const user = userBase;
      const body = { originalUrl: 'https://example-updated.com' };
      const urlId = 'url-id';

      updateUserUrlByIdUseCase.execute.mockRejectedValueOnce(
        new InvalidIdError('Invalid URL ID'),
      );

      await expect(
        controller.updateUserUrlById(user, body, urlId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('RemoveUserUrlById', () => {
    it('Should remove url successfully', async () => {
      const user = userBase;
      const urlId = 'url-id';

      removeUserUrlByIdUseCase.execute.mockResolvedValueOnce(true);

      const result = await controller.removeUserUrlById(user, urlId);

      expect(result).toBeUndefined();
      expect(removeUserUrlByIdUseCase.execute).toHaveBeenCalledWith(
        user.id,
        urlId,
      );
    });

    it('Sshould throw NotFoundException if url not found', async () => {
      const user = userBase;
      const urlId = 'url-id';

      removeUserUrlByIdUseCase.execute.mockResolvedValueOnce(false);

      await expect(controller.removeUserUrlById(user, urlId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should throw ForbiddenException if no user id', async () => {
      const user = { id: '', email: '' };
      const urlId = 'url-id';

      await expect(controller.removeUserUrlById(user, urlId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('Should throw BadRequestException if InvalidIdError is thrown', async () => {
      const user = userBase;
      const urlId = 'url-id';

      removeUserUrlByIdUseCase.execute.mockRejectedValueOnce(
        new InvalidIdError('Invalid URL ID'),
      );

      await expect(controller.removeUserUrlById(user, urlId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
