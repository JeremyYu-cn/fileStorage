import KoaRouter from '@koa/router';
import { appendLogger, getLogger } from '../method/logger';

const router = new KoaRouter({
  prefix: '/logger',
});

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

router.post('appendLogger', '/append', async (ctx) => {
  const { key, data } = ctx.request.body;

  ctx.body = await appendLogger({
    collectName: <string>key,
    data,
  });
});

export default router;
