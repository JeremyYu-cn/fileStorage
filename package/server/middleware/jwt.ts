import KoaJwt from 'koa-jwt';
import { JWT_SECRET } from '../config';

const EXCLUDE_ROUTE: string | RegExp | (string | RegExp)[] | undefined = [
  '/logger/append',
  '/logger/get',
  '/logger/list',
  '/logger/create',
  '/login',
];

export const handleJwt = function () {
  return KoaJwt({
    secret: JWT_SECRET,
  }).unless({
    path: EXCLUDE_ROUTE,
  });
};
