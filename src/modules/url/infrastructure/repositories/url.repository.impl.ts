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

  async findByCode(code: string): Promise<Url | null> {
    const orm = await this.repository.findOne({ where: { code } });
    if (!orm) return null;

    return new Url(orm.originalUrl, orm.code);
  }

  async findByOriginalUrl(originalUrl: string): Promise<Url | null> {
    const orm = await this.repository.findOne({ where: { originalUrl } });
    if (!orm) return null;

    return new Url(orm.originalUrl, orm.code);
  }

  async updateClicks(code: string): Promise<void> {
    const url = await this.repository.findOne({ where: { code } });
    if (!url) return;

    url.clicks += 1;
    await this.repository.save(url);
  }

  async listUrlsByUserId(userId: string): Promise<Url[]> {
    const urls = await this.repository.find({
      where: { userId, deletedAt: undefined },
    });

    return urls as Url[];
  }

  async updateUserUrlById(
    userId: string,
    urlId: string,
    originalUrl: string,
  ): Promise<boolean> {
    const url = await this.repository.findOne({
      where: { userId, id: urlId },
    });
    if (!url) return false;

    url.originalUrl = originalUrl;
    url.clicks = 0;
    await this.repository.save(url);
    return true;
  }

  async removeUrlById(userId: string, urlId: string): Promise<boolean> {
    const url = await this.repository.findOne({
      where: { userId, id: urlId },
    });
    if (!url) return false;

    url.deletedAt = new Date();
    await this.repository.save(url);
    return true;
  }
}
