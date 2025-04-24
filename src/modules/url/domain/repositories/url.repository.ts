import { Url } from '../entities/url.entity';

export interface UrlRepository {
  create(url: Url): Promise<void>;
  findByCode(code: string): Promise<Url | null>;
  findByOriginalUrl(originalUrl: string): Promise<Url | null>;
  updateClicks(code: string): Promise<void>;
  listUrlsByUserId(userId: string): Promise<Url[]>;
}
