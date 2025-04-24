import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserDecoratorDto } from '../dto/getUserDecorator.dto';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user: GetUserDecoratorDto }>();
  return req.user;
});
