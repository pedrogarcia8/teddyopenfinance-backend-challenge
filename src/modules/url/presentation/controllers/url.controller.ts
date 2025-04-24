import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ShortenUrlDto } from '../dto/shortenUrl.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly shortenUrlUseCase: ShortenUrlUseCase) {}

  @Post('/shorten')
  @HttpCode(201)
  async shorten(@Body() body: ShortenUrlDto): Promise<{ url: string }> {
    try {
      const code = await this.shortenUrlUseCase.execute(body.originalUrl);
      return { url: `${process.env.BASE_URL}/${code}` };
    } catch (error: any) {
      throw new HttpException(
        typeof error === 'string' ? error : JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
