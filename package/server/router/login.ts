import { getErrorStatus } from '@/../fileStorage/utils/statusMsg';
import { Login } from '../method/login';
import KoaRouter from '@koa/router';

const router = new KoaRouter({
  prefix: '/login',
});

router.post('login', '/', async (ctx, next) => {
  const { user, password } = ctx.request.body;
  if (!user || !password) {
    ctx.body = getErrorStatus('用户名或密码不能为空');
    return;
  }
  ctx.body = await Login({ user, password });
  next();
});

export default router;
