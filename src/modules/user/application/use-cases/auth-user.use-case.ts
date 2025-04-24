import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import JwtTokenGenerator from '../../../../common/utils/jwt-token-generator';

@Injectable()
export class AuthUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new NotFoundException('User not found');

      const isAuthorized = await bcrypt.compare(password, user.password);
      if (!isAuthorized) throw new ForbiddenException('Incorrect password');

      const token = JwtTokenGenerator(email);

      return token;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Unexpected error in authUserUseCase:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
