import Koa from 'koa';
import { CommonReturn } from '../common/code';

export const handleReturn: Koa.Middleware = async function (ctx, next) {
  ctx.body = CommonReturn(200, 'success', ctx.body);
  await next();
};
