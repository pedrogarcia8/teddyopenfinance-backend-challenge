import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class ShortenUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(originalUrl: string, userId: string | null): Promise<string> {
    const existingUrl = await this.urlRepository.findByOriginalUrl(originalUrl);
    if (existingUrl) return existingUrl.code;

    const code = randomBytes(6).toString('hex').substring(0, 6);

    const existingCode = await this.urlRepository.findByCode(code);
    if (existingCode) return this.execute(originalUrl, userId);

    const url = new Url(originalUrl, code, userId);

    await this.urlRepository.create(url);

    return code;
  }
}
