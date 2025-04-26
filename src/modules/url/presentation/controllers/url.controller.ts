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
import { ListUserUrlsUseCase } from '../../application/use-cases/list-user-urls.use-case';
import { GetUser } from './../../../../shared/auth/decorators/get-user.decorator';
import { GetUserDecoratorDto } from './../../../../shared/auth/dto/getUserDecorator.dto';
import { JwtAuthGuard } from './../../../../shared/auth/guards/jwt-auth.guard';
import { UpdateUserUrlByIdUseCase } from '../../application/use-cases/update-user-url-by-id.use-case';
import { RemoveUserUrlByIdUseCase } from '../../application/use-cases/remove-user-url-by-id.use-case';
import { InvalidIdError, NotFoundError } from './../../../../common/errors';
import { Request } from 'express';
import getBaseUrl from './../../../../common/utils/get-base-url';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UrlDto } from '../dto/url.dto';

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
  @ApiOperation({
    summary: 'Shorten a URL',
    description:
      'This endpoint shortens a given URL and returns the shortened version.',
  })
  @ApiBody({
    type: ShortenUrlDto,
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'Shortened URL',
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'List URLs by user ID',
    description:
      'This endpoint lists all URLs associated with the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    type: [UrlDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
  @ApiBearerAuth()
  async listUrlsByUserId(
    @GetUser() user: GetUserDecoratorDto,
  ): Promise<UrlDto[]> {
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
  @ApiOperation({
    summary: 'Update a User URL by URL ID',
    description:
      'This endpoint updates a URL associated with the authenticated user by its ID.',
  })
  @ApiBody({
    type: ShortenUrlDto,
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Url updated successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL ID',
  })
  @ApiResponse({
    status: 403,
    description: 'User without permission',
  })
  @ApiResponse({
    status: 404,
    description: 'The url does not exist or does not belong to you',
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the URL to update',
    type: 'string',
  })
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
  @ApiOperation({
    summary: 'Delete a User URL by URL ID',
    description:
      'This endpoint "soft delete" a URL associated with the authenticated user by its ID.',
  })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL ID',
  })
  @ApiResponse({
    status: 403,
    description: 'User without permission',
  })
  @ApiResponse({
    status: 404,
    description: 'The url does not exist or does not belong to you',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the URL to remove',
    type: 'string',
  })
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
