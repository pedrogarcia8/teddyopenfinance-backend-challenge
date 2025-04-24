import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlOrmEntity } from './infrastructure/entities/url.entity';
import { UrlController } from './presentation/controllers/url.controller';
import { ShortenUrlUseCase } from './application/use-cases/shorten-url.use-case';
import { UrlRepositoryImpl } from './infrastructure/repositories/url.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([UrlOrmEntity])],
  controllers: [UrlController],
  providers: [
    ShortenUrlUseCase,
    {
      provide: 'UrlRepository',
      useClass: UrlRepositoryImpl,
    },
  ],
})
export class UrlModule {}
