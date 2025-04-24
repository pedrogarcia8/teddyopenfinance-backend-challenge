import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;
}
