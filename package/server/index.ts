import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const PORT = 8899;

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
