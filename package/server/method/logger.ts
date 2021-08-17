/**
 * name logger business
 * date 2021-08-17
 * update 2021-08-17
 * author Jeremy Yu
 */

import Collection from '../../fileStorage/collection';
import Select from '../../fileStorage/select';
const collection = new Collection();

const CollectionCache: Record<string, Select> = {};

export type getCollectionOption = {
  collectName: string;
  page: number;
  limit: number;
  where: Record<string, any>;
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

export async function getLogger({
  collectName,
  limit,
  where,
}: getCollectionOption) {
  const collect = await getCollection(collectName);
  return await collect.where({ test1: 111 }).limit(limit).select();
}
