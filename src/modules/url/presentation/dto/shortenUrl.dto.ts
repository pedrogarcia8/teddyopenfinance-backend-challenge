import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    {
      message: 'The URL must start with http or https and must be a valid URL',
    },
  )
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'https://example.com',
    format: 'url',
    description: 'Original URL',
    required: true,
  })
  originalUrl: string;
}
