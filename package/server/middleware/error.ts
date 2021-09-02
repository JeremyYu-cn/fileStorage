import Koa from 'koa';

export const handleError: Koa.Middleware = async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    const code = handleErrorCode(err);
    console.log(err);
    ctx.response.status = code;
    ctx.response.body = {
      msg: err.toString(),
    };
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
