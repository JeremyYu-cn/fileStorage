import type Koa from 'koa';

export const handlCORS: Koa.Middleware = async function (ctx, next) {
  ctx.set('access-control-allow-origin', '*');
  ctx.set('access-control-request-methods', 'GET,POST,PUT,DELETE,OPTION');
  ctx.set('access-control-allow-headers', '*');
  await next();
};
