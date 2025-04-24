import {
  Controller,
  Post,
  Body,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
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
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
