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
  Delete,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { ShortenUrlDto } from '../dto/shortenUrl.dto';
import { Url } from '../../domain/entities/url.entity';
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { GetUser } from 'src/shared/auth/decorators/get-user.decorator';
import { GetUserDecoratorDto } from 'src/shared/auth/dto/getUserDecorator.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { UpdateUserUrlByIdUseCase } from '../../application/use-cases/update-user-url-by-id.use-case';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { RemoveUserUrlByIdUseCase } from '../../application/use-cases/remove-user-url-by-id.use-case';
import { InvalidIdError } from 'src/common/errors/invalid-id.error';
import { Request } from 'express';
import getBaseUrl from 'src/common/utils/get-base-url';

@Controller('url')
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly listUserUrlsUseCase: ListUserUrlsUseCase,
    private readonly updateUserUrlByIdUseCase: UpdateUserUrlByIdUseCase,
    private readonly removeUserUrlByIdUseCase: RemoveUserUrlByIdUseCase,
  ) {}

  @Post('/shorten')
  @HttpCode(201)
  async shorten(
    @Body() body: ShortenUrlDto,
    @GetUser() user: GetUserDecoratorDto,
    @Req() req: Request,
  ): Promise<{ url: string }> {
    try {
      const code = await this.shortenUrlUseCase.execute(
        body.originalUrl,
        user?.id || null,
      );
      return { url: `${getBaseUrl(req)}/${code}` };
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

      const isUpdated = await this.updateUserUrlByIdUseCase.execute(
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

      if (error instanceof InvalidIdError) {
        throw new BadRequestException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/user/:id')
  @HttpCode(204)
  async removeUserUrlById(
    @GetUser() user: GetUserDecoratorDto,
    @Param('id') urlId: string,
  ): Promise<void> {
    try {
      if (!user.id) throw new ForbiddenException('User without permission');

      const isRemoved = await this.removeUserUrlByIdUseCase.execute(
        user.id,
        urlId,
      );

      if (!isRemoved) {
        throw new NotFoundError(
          'The url does not exist or does not belong to you',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof InvalidIdError) {
        throw new BadRequestException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
