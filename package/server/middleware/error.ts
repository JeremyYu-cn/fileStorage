import Koa from 'koa';

export const handleError: Koa.Middleware = async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.body = { code: 500, msg: err.toString() };
    console.log(err);
  }
};
