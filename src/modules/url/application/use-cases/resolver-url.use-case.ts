import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Injectable()
export class ResolveUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepo: UrlRepository,
  ) {}

  async execute(code: string): Promise<string> {
    const url = await this.urlRepo.findByCode(code);
    if (!url) throw new NotFoundError('URL not found');
    await this.urlRepo.updateClicks(code);
    return url.originalUrl;
  }
}
