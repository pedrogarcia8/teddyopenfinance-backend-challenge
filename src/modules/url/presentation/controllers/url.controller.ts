import {
  Controller,
  Post,
  Body,
  HttpCode,
  InternalServerErrorException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ShortenUrlDto } from '../dto/shortenUrl.dto';
import { Url } from '../../domain/entities/url.entity';
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { GetUser } from 'src/shared/auth/decorators/get-user.decorator';
import { GetUserDecoratorDto } from 'src/shared/auth/dto/getUserDecorator.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@Controller('url')
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly listUserUrlsUseCase: ListUserUrlsUseCase,
  ) {}

  @Post('/shorten')
  @HttpCode(201)
  async shorten(
    @Body() body: ShortenUrlDto,
    @GetUser() user: GetUserDecoratorDto,
  ): Promise<{ url: string }> {
    try {
      const code = await this.shortenUrlUseCase.execute(
        body.originalUrl,
        user?.id || null,
      );
      return { url: `${process.env.BASE_URL}/${code}` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @HttpCode(200)
  async listUrlsByUserId(@GetUser() user: GetUserDecoratorDto): Promise<Url[]> {
    try {
      if (!user.id) return [];

      return await this.listUserUrlsUseCase.execute(user.id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
