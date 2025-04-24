import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) throw new Error('User already exists');

      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = new User(email, encryptedPassword);
      await this.userRepository.create(user);
      return user;
    } catch (error) {
      console.log('Error in shortenUrlUseCase: ', error);
      throw error;
    }
  }
}
