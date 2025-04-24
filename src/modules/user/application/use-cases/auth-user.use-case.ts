import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import JwtTokenGenerator from '../../../../common/utils/jwt-token-generator';
import { InvalidCredentialsError, NotFoundError } from 'src/common/errors';

@Injectable()
export class AuthUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');

    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) throw new InvalidCredentialsError();

    const token = JwtTokenGenerator(email, user.id as string);

    return token;
  }
}
