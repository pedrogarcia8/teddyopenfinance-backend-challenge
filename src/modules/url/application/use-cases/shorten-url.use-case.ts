import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class ShortenUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(originalUrl: string): Promise<string> {
    try {
      const code = randomBytes(6).toString('hex').substring(0, 6);
      const url = new Url(originalUrl, code);

      await this.urlRepository.create(url);

      return code;
    } catch (error) {
      console.log('Error in shortenUrlUseCase: ', error);
      throw error;
    }
  }
}
