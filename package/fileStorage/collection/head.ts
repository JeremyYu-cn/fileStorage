import { promises } from 'fs';
import { resolve } from 'path';
import type { collectionHeadData } from './create';

export async function getHeadData(
  filePath: string,
  extra: string = '.head'
): Promise<collectionHeadData> {
  return JSON.parse(
    await promises.readFile(resolve(filePath, extra), { encoding: 'utf8' })
  );
}
