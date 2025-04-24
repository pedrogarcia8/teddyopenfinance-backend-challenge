import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserOrmEntity } from './infrastructure/entities/user.entity';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { UserController } from './presentation/controllers/user.controller';
import { AuthUserUseCase } from './application/use-cases/auth-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    AuthUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
