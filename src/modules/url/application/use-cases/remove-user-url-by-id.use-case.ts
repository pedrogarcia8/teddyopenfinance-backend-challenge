import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import isValidUUID from 'src/common/utils/is-valid-uuid';
import { InvalidIdError } from 'src/common/errors/invalid-id.error';

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
