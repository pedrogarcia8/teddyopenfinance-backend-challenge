import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';

@Injectable()
export class ResolveUrlUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepo: UrlRepository,
  ) {}

  async execute(code: string): Promise<string> {
    const url = await this.urlRepo.findByCode(code);
    if (!url) throw new NotFoundException('URL not found');
    await this.urlRepo.updateClicks(code);
    return url.originalUrl;
  }
}
