import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { message: 'URL must start with http or https' },
  )
  @IsNotEmpty()
  originalUrl: string;
}
