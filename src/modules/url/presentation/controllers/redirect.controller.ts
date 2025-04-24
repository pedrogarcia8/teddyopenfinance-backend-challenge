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
import { NotFoundError } from 'src/common/errors/not-found.error';

@Controller()
export class RedirectController {
  constructor(private readonly resolveUrlUseCase: ResolveUrlUseCase) {}

  @Get(':code')
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
