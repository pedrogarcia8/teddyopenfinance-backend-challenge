import { Url } from '../entities/url.entity';

export interface UrlRepository {
  create(url: Url): Promise<void>;
}
