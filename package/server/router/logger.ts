import KoaRouter from '@koa/router';
import {
  appendLogger,
  createLogger,
  getLogger,
  getLoggerList,
} from '../method/logger';

const router = new KoaRouter({
  prefix: '/logger',
});

router.get('getLoggerList', '/list', async (ctx) => {
  ctx.body = await getLoggerList();
});

// 获取具体logger数据
router.get('getLogger', '/get', async (ctx) => {
  const { key = '', page = 1, where = '', limit = 10 } = ctx.query;
  console.log(ctx.query);

  ctx.body = await getLogger({
    collectName: <string>key,
    page: <number>page,
    limit: <number>limit,
    where: where ? JSON.parse(<string>where) : {},
  });
});

router.post('createLogger', '/create', async (ctx, next) => {
  const { collectName } = ctx.request.body;

  if (!collectName) {
    throw new Error('collectName must be send');
  }
  const result = await createLogger({ collectName });
  ctx.body = result;
  await next();
});

router.post('appendLogger', '/append', async (ctx) => {
  const { key, data } = ctx.request.body;
  console.log(data);

  ctx.body = await appendLogger({
    collectName: <string>key,
    data,
  });
});

export default router;
