import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import isValidUUID from './../../../../common/utils/is-valid-uuid';
import { InvalidIdError } from './../../../../common/errors';

@Injectable()
export class RemoveUserUrlByIdUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(userId: string, urlId: string): Promise<boolean> {
    if (!isValidUUID(urlId)) throw new InvalidIdError('Invalid URL ID');

    return await this.urlRepository.removeUrlById(userId, urlId);
  }
}
