import { InjectRepository } from '@nestjs/typeorm';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { UrlOrmEntity } from '../entities/url.entity';
import { Repository } from 'typeorm';
import { Url } from '../../domain/entities/url.entity';

export class UrlRepositoryImpl implements UrlRepository {
  constructor(
    @InjectRepository(UrlOrmEntity)
    private readonly repository: Repository<UrlOrmEntity>,
  ) {}

  async create(url: Url): Promise<void> {
    const orm = this.repository.create(url);
    await this.repository.save(orm);
  }
}
