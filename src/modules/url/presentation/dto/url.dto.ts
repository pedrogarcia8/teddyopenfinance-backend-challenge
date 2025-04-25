import { ApiProperty } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty({
    type: 'string',
    example: 'https://example.com',
    format: 'url',
    description: 'Original URL',
    required: true,
  })
  originalUrl: string;

  @ApiProperty({
    type: 'string',
    example: 'abc123',
    description: 'Shortened URL code',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: 'string',
    example: 'c8918573-d9fc-43d6-b50d-af2edf8a64d9',
    description: 'User ID',
    required: false,
  })
  userId?: string | null;

  @ApiProperty({
    type: 'string',
    example: 'c8918573-d9fc-43d6-b50d-af2edf8a64d8',
    description: 'URL ID',
    required: false,
  })
  id?: string;

  @ApiProperty({
    type: 'number',
    example: 100,
    description: 'Number of clicks',
    required: false,
  })
  clicks?: number | null;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T00:00:00Z',
    description: 'Creation date',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T00:00:00Z',
    description: 'Last update date',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2023-10-01T00:00:00Z',
    description: 'Sof delete date',
    required: false,
  })
  deletedAt?: Date | null;
}
