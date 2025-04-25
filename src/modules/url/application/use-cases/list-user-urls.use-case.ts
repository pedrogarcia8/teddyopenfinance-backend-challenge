import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';

@Injectable()
export class ListUserUrlsUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(userId: string): Promise<Url[]> {
    const urls = await this.urlRepository.listUrlsByUserId(userId);
    return urls;
  }
}
