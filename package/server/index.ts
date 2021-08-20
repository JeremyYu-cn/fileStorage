import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';
import { handleError, handleJwt, handleReturn, handlCORS } from './middleware';

const app = new Koa();
const PORT = 8899;
// 错误处理
app.use(handleError);
// 跨域处理
app.use(handlCORS);
// jwt处理
app.use(handleJwt());
// 传入参数处理
app.use(bodyParser());
// 路由
app.use(router.routes());
app.use(router.allowedMethods());
// 公共返回
app.use(handleReturn);

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
