import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';

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
    return await this.urlRepository.updateUserUrlById(
      userId,
      urlId,
      originalUrl,
    );
  }
}
