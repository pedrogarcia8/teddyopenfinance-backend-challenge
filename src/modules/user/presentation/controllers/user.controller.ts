import {
  Controller,
  Post,
  Body,
  HttpCode,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserUseCase } from '../../application/use-cases/auth-user.use-case';
import { InvalidCredentialsError, NotFoundError } from 'src/common/errors';
import { UserAlreadyExistsError } from 'src/common/errors/user-already-exists.error';

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
      if (error instanceof UserAlreadyExistsError) {
        throw new NotAcceptableException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Post('/auth')
  @HttpCode(200)
  async auth(@Body() body: CreateUserDto): Promise<{ token: string }> {
    try {
      const token = await this.authUserUseCase.execute(
        body.email,
        body.password,
      );
      return { token };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof InvalidCredentialsError) {
        throw new ForbiddenException(error.message);
      }

      console.error(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
