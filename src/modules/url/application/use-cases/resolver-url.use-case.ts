import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Injectable()
export class ResolveUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(code: string): Promise<string> {
    const url = await this.urlRepository.findByCode(code);
    if (!url) throw new NotFoundError('URL not found');
    await this.urlRepository.updateClicks(code);
    return url.originalUrl;
  }
}
