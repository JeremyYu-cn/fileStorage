/**
 * name logger business
 * date 2021-08-17
 * update 2021-09-02
 * author Jeremy Yu
 */

import {
  getErrorStatus,
  IReadLineResult,
} from '@/../fileStorage/utils/statusMsg';
import Collection from '../../fileStorage/collection';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import dayjs from 'dayjs';

type LoginParam = {
  user: string;
  password: string;
};

type LoginResult = {
  createAt: number;
  id: string;
  password: string;
  user: string;
  token?: string;
};

const collection = new Collection();

export async function Login({ user, password }: LoginParam) {
  const collect = await collection.getConnection('user');
  const data: IReadLineResult<LoginResult[]> = await collect
    .createCondition({
      where: { user, password },
    })
    .select();
  if (!data.length) {
    return getErrorStatus('用户名或密码错误', 0, 501);
  } else {
    const result = (data.data || [])[0];
    const { id, user, createAt } = result;
    return {
      id,
      user,
      createAt,
      token: jwt.sign(result, JWT_SECRET, {
        expiresIn: '2h',
      }),
    };
  }
}
