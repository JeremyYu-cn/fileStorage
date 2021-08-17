import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';
import { handleError } from './middleware/error';

const app = new Koa();
const PORT = 8899;
app.use(handleError);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
