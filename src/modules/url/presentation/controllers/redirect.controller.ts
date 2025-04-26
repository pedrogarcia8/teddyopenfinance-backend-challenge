import {
  Controller,
  Get,
  Param,
  Res,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResolveUrlUseCase } from '../../application/use-cases/resolver-url.use-case';
import { NotFoundError } from './../../../../common/errors';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class RedirectController {
  constructor(private readonly resolveUrlUseCase: ResolveUrlUseCase) {}

  @Get(':code')
  @ApiOperation({
    summary: 'Redirect to the original URL',
    description:
      'This endpoint redirects to the original URL based on the provided code.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Url not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
  async redirect(@Param('code') code: string, @Res() res: Response) {
    try {
      const originalUrl = await this.resolveUrlUseCase.execute(code);
      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
