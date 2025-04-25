import { Inject, Injectable } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { Url } from '../../domain/entities/url.entity';
import { UrlDto } from '../../presentation/dto/url.dto';

@Injectable()
export class ListUserUrlsUseCase {
  constructor(
    @Inject('UrlRepository') private readonly urlRepository: UrlRepository,
  ) {}

  async execute(userId: string): Promise<UrlDto[]> {
    const urls = await this.urlRepository.listUrlsByUserId(userId);
    return urls;
  }
}
