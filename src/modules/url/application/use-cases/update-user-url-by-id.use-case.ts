import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { InvalidIdError } from 'src/common/errors/invalid-id.error';
import isValidUUID from 'src/common/utils/is-valid-uuid';

@Injectable()
export class UpdateUserUrlByIdUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(
    userId: string,
    urlId: string,
    originalUrl: string,
  ): Promise<boolean> {
    if (!isValidUUID(urlId)) throw new InvalidIdError('Invalid URL ID');

    return await this.urlRepository.updateUserUrlById(
      userId,
      urlId,
      originalUrl,
    );
  }
}
