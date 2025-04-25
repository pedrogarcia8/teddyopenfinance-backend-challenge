import {
  Controller,
  Post,
  Body,
  HttpCode,
  InternalServerErrorException,
  Get,
  UseGuards,
  Patch,
  ForbiddenException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ShortenUrlDto } from '../dto/shortenUrl.dto';
import { Url } from '../../domain/entities/url.entity';
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { GetUser } from 'src/shared/auth/decorators/get-user.decorator';
import { GetUserDecoratorDto } from 'src/shared/auth/dto/getUserDecorator.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { UpdateUserUrlByIdUseCase } from '../../application/use-cases/update-user-url-by-id.user-case';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Controller('url')
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly listUserUrlsUseCase: ListUserUrlsUseCase,
    private readonly updateUserUrlsByIdUseCase: UpdateUserUrlByIdUseCase,
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

  @UseGuards(JwtAuthGuard)
  @Patch('/user/:id')
  @HttpCode(200)
  async updateUserUrlById(
    @GetUser() user: GetUserDecoratorDto,
    @Body() body: ShortenUrlDto,
    @Param('id') urlId: string,
  ): Promise<{ message: string }> {
    try {
      if (!user.id) throw new ForbiddenException('User without permission');

      const isUpdated = await this.updateUserUrlsByIdUseCase.execute(
        user.id,
        urlId,
        body.originalUrl,
      );

      if (!isUpdated) {
        throw new NotFoundError(
          'The url does not exist or does not belong to you',
        );
      }
      return { message: 'Url updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
