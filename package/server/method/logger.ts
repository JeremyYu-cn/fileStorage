/**
 * name logger business
 * date 2021-08-17
 * update 2021-08-18
 * author Jeremy Yu
 */

import { IReadLineResult } from '@/../fileStorage/utils/statusMsg';
import Collection from '../../fileStorage/collection';
import Select from '../../fileStorage/select';
import { getMd5Code } from '../common/crypto';
import { SYSTEM_COLLECT_NAME } from '../config';

const collection = new Collection();
const CollectionCache: Record<string, Select> = {};

export type getCollectionOption = {
  key: string;
  page: number;
  limit: number;
  where: Record<string, any>;
};

export type appendDataOption = {
  collectName: string;
  data: Record<string, any>;
};

export type createLoggerOption = {
  collectName: string;
};

export type returnData<T> = {
  total: number;
} & IReadLineResult<T>;

type systemPostData = {
  id: number;
  name: string;
  key: string;
  createAt?: number;
  updateAt?: number;
};

async function getCollection(collectName: string) {
  const collect =
    CollectionCache[collectName] ||
    (await collection.getConnection(collectName));
  if (!CollectionCache[collectName]) {
    CollectionCache[collectName] = collect;
  }
  return collect;
}

/**
 * 获取所有logger列表(获取所有logger的集合)
 */
export async function getLoggerList() {
  const collect = await collection.getConnection(SYSTEM_COLLECT_NAME);
  return await collect.select();
}

/**
 * 查询服务
 * @returns
 */
export async function getLogger({ key, limit, where }: getCollectionOption) {
  const collect = await getCollection(`${key}`);
  const count = await collect.createCondition({ where }).count();
  const result = await collect
    .createCondition({ where, limit, order: 'desc' })
    .select();
  return Object.assign(
    {
      total: count,
    },
    result
  );
}

/**
 * 插入数据
 * @returns
 */
export async function appendLogger({ collectName, data }: appendDataOption) {
  const collect = await getCollection(collectName);
  const postData = Object.assign(
    {
      createAt: Date.now(),
    },
    data
  );
  return await collect.insert(postData);
}

/**
 * 创建logger
 * @param param0
 */
export async function createLogger({ collectName }: createLoggerOption) {
  const code = getMd5Code(`collection_${collectName}_${Date.now()}`);
  const isExistsSystem = await collection.getCollectionIsExists(
    SYSTEM_COLLECT_NAME
  );

  if (!isExistsSystem) {
    await collection.createConnection(SYSTEM_COLLECT_NAME);
  }
  const systemCollect = await collection.getConnection(SYSTEM_COLLECT_NAME);

  const appendName: string = `${collectName}_${code}`;
  const createDate = Date.now();
  const systemData: systemPostData = {
    id: createDate,
    name: collectName,
    key: appendName,
    createAt: createDate,
  };

  await systemCollect.insert(systemData);
  const collect = await collection.createConnection(appendName);
  return { status: collect, code };
}
