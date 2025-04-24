import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  async create(@Body() body: CreateUserDto): Promise<{ token: string }> {
    try {
      const token = await this.createUserUseCase.execute(
        body.email,
        body.password,
      );
      return { token };
    } catch (error: any) {
      if (error instanceof Error && error.message === 'User already exists') {
        throw new HttpException(
          'User already exists',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      throw new HttpException(
        typeof error === 'string' ? error : JSON.stringify(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/auth')
  @HttpCode(200)
  async auth(@Body() body: CreateUserDto): Promise<{ token: string }> {
    const token = await this.authUserUseCase.execute(body.email, body.password);
    return { token };
  }
}
