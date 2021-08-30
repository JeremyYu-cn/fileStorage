import { createReadStream, promises } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { HEAD_EXTRA } from './config';
import type { collectionDataHead, collectionHeadData } from './create';

export async function getHeadData(
  filePath: string,
  extra: string = HEAD_EXTRA
): Promise<collectionHeadData> {
  return JSON.parse(
    await promises.readFile(resolve(filePath, extra), { encoding: 'utf8' })
  );
}

/**
 * 更新集合信息
 */
export async function updateCollectionHead(
  filePath: string,
  data: collectionHeadData
) {
  await promises.writeFile(filePath, JSON.stringify(data));
}

/**
 * 获取页面头信息
 */
export function getPageHeader(fileName: string): Promise<collectionDataHead> {
  return new Promise((resolve) => {
    const stream = createReadStream(fileName);
    const rl = createInterface({
      input: stream,
    });
    // 读取第一行后立即关闭
    rl.on('line', (chunk) => {
      resolve(JSON.parse(chunk));
      rl.close();
    });
  });
}

/**
 * 更新页面头信息
 */
export async function updatePageHead(
  fileName: string,
  data: collectionDataHead
) {
  const chunk = await promises.readFile(fileName, 'utf8');
  const chunkArr = chunk.split('\n');
  chunkArr[0] = JSON.stringify(data);
  return await promises.writeFile(fileName, chunkArr.join('\n'));
}
