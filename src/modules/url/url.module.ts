import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlOrmEntity } from './infrastructure/entities/url.entity';
import { UrlController } from './presentation/controllers/url.controller';
import { ShortenUrlUseCase } from './application/use-cases/shorten-url.use-case';
import { UrlRepositoryImpl } from './infrastructure/repositories/url.repository.impl';
import { ResolveUrlUseCase } from './application/use-cases/resolver-url.use-case';
import { RedirectController } from './presentation/controllers/redirect.controller';
import { ListUserUrlsUseCase } from './application/use-cases/list-user-urls.use-case';
import { UpdateUserUrlByIdUseCase } from './application/use-cases/update-user-url-by-id.use-case';
import { RemoveUserUrlByIdUseCase } from './application/use-cases/remove-user-url-by-id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UrlOrmEntity])],
  controllers: [UrlController, RedirectController],
  providers: [
    ShortenUrlUseCase,
    ResolveUrlUseCase,
    ListUserUrlsUseCase,
    UpdateUserUrlByIdUseCase,
    RemoveUserUrlByIdUseCase,
    {
      provide: 'UrlRepository',
      useClass: UrlRepositoryImpl,
    },
  ],
})
export class UrlModule {}
