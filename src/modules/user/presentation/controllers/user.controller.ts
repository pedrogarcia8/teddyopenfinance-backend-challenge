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
import {
  InvalidCredentialsError,
  NotFoundError,
  UserAlreadyExistsError,
} from './../../../../common/errors';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'This endpoint creates a new user and returns a JWT token.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT token for the created user',
        },
      },
    },
  })
  @ApiResponse({
    status: 406,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
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
  @ApiOperation({
    summary: 'Authenticate a user',
    description: 'This endpoint authenticates a user and returns a JWT token.',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT token for the authenticated user',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
  })
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
