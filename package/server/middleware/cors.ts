import type Koa from 'koa';

export const handlCORS: Koa.Middleware = async function (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Request-Methods', '*');
  ctx.set('Access-Control-Allow-Headers', '*');
  await next();
};
