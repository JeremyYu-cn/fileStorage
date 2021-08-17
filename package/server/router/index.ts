import KoaRouter from '@koa/router';
import Logger from './logger';

const router = new KoaRouter();

router.use(Logger.routes());
router.use(Logger.allowedMethods());

export default router;
