import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlModule } from './modules/url/url.module';
import { AppDataSource } from './shared/database/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './shared/auth/auth.module';
import { OptionalJwtMiddleware } from './shared/auth/middlewares/optional-jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UrlModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalJwtMiddleware).forRoutes('*');
  }
}
