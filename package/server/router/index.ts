import KoaRouter from '@koa/router';
import Logger from './logger';
import Login from './login';

const router = new KoaRouter();

router.use(Login.routes());
router.use(Login.allowedMethods());
router.use(Logger.routes());
router.use(Logger.allowedMethods());

export default router;
