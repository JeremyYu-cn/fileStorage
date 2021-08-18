import Koa from 'koa';

export const handleError: Koa.Middleware = async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    const code = handleErrorCode(err);
    ctx.body = { code: code, msg: err.toString() };
    console.log(err);
  }
};

function handleErrorCode(err: Error) {
  switch (err.toString()) {
    case 'UnauthorizedError: Authentication Error':
      return 401;
    default:
      return 500;
  }
}
