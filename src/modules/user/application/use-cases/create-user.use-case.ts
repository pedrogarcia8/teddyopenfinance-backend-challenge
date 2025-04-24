import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import JwtTokenGenerator from '../../../../common/utils/jwt-token-generator';
import { UserAlreadyExistsError } from 'src/common/errors/user-already-exists.error';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new UserAlreadyExistsError();

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User(email, encryptedPassword);
    await this.userRepository.create(user);
    const token = JwtTokenGenerator(email);
    return token;
  }
}
