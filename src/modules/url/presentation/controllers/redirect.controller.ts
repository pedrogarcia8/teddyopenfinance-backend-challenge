import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResolveUrlUseCase } from '../../application/use-cases/resolver-url.use-case';

@Controller()
export class RedirectController {
  constructor(private readonly resolveUrlUseCase: ResolveUrlUseCase) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const originalUrl = await this.resolveUrlUseCase.execute(code);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}
