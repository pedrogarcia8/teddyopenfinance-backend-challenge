import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.entity';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const orm = this.repository.create(user);
    return await this.repository.save(orm);
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { email } });
    if (!orm) return null;

    return new User(orm.email, orm.password, orm.id);
  }
}
