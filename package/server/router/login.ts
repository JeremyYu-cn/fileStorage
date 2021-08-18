import KoaRouter from '@koa/router';

const router = new KoaRouter({
  prefix: '/login',
});

router.post('login', '/', async (ctx) => {
  const { user, pass } = ctx.request.body;
});

export default router;
