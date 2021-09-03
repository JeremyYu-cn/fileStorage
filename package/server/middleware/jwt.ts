import KoaJwt from 'koa-jwt';
import { JWT_SECRET } from '../config';

const EXCLUDE_ROUTE: string | RegExp | (string | RegExp)[] | undefined = [
  '/login',
];

export const handleJwt = function () {
  return KoaJwt({
    secret: JWT_SECRET,
    passthrough: true,
  }).unless({
    path: EXCLUDE_ROUTE,
  });
};
