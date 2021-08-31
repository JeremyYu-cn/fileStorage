import { checkIsFile } from '@/utils/fileControl';
import { IReadLineFile } from '@/utils/readLine';
import {
  getErrorStatus,
  getSuccessStatus,
  IReadLineResult,
} from '@/utils/statusMsg';
import dayjs from 'dayjs';
import { createReadStream, promises } from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import { collectionDataHead } from './create';

/**
 * 按条件读取文件行
 * @param param0
 * @returns
 */
export function readlineFile<T extends Record<string, any> = {}>(
  data: IReadLineFile<T>
): Promise<IReadLineResult<T[]>> {
  return new Promise(async (resolve, reject) => {
    const { fileName } = data;
    if (!(await checkIsFile(fileName))) {
      reject(getErrorStatus(`${fileName} is not exists`));
    } else {
      const startTime = Date.now();
      const result =
        data.order === 'desc'
          ? await descReadPage<T>(data)
          : await readPage<T>(data);
      resolve(getSuccessStatus(result, dayjs().diff(startTime, 'ms')));
    }
  });
}

// 顺序查询
export function readPage<T extends Record<string, any> = {}>(
  {
    fileName,
    handleCondition,
    page = 1,
    pageSize = 100,
    limit = 100,
    order = 'asc',
  }: IReadLineFile<T>,
  prevData: T[] = []
): Promise<T[]> {
  return new Promise((resolve) => {
    const arr: T[] = prevData;
    const rl = createInterface({
      input: createReadStream(fileName),
    });

    const ignoreNum = (page - 1) * pageSize;
    let pageHead: collectionDataHead = {
      prev: '',
      next: '',
      total: 0,
      limit: 0,
    };
    let count = 0;

    rl.on('line', (msg) => {
      if (count === 0) {
        pageHead = JSON.parse(msg);
        count++;
        return;
      }
      if (msg === '') return;
      if (ignoreNum > count) {
        count++;
      } else {
        const json: T = JSON.parse(msg);
        const data: T = JSON.parse(json.data);
        if ((!handleCondition || handleCondition(data)) && arr.length < limit) {
          arr.push(data);
          if (arr.length >= limit) {
            rl.close();
          }
        }
      }
    });

    rl.on('close', async () => {
      if (arr.length < limit && pageHead.next) {
        const nextPath = path.resolve(fileName, '..', pageHead.next);
        console.log(nextPath);
        const result = await readPage(
          {
            fileName: nextPath,
            handleCondition,
            page,
            pageSize,
            limit,
            order,
          },
          arr
        );
        resolve(result);
      } else {
        resolve(arr);
      }
    });
  });
}

// 倒序查询
export async function descReadPage<T extends Record<string, any> = {}>(
  {
    fileName,
    handleCondition,
    page = 1,
    pageSize = 100,
    limit = 100,
    order = 'asc',
  }: IReadLineFile<T>,
  prevData: T[] = []
): Promise<T[]> {
  const chunk = await promises.readFile(fileName, 'utf8');
  let chunkArr = chunk.split('\n');
  const pageHead: collectionDataHead = JSON.parse(chunkArr[0]);
  chunkArr = chunkArr.reverse();

  // do not use the first line
  for (let i = 0, max = chunkArr.length - 1; i < max; i++) {
    const data: string = JSON.parse(chunkArr[i]).data;
    const json: T = JSON.parse(data);
    if (handleCondition && handleCondition(json)) {
      prevData.push(json);
    }
    if (prevData.length >= limit) {
      break;
    }
  }

  if (pageHead.prev && prevData.length < limit) {
    return await descReadPage(
      {
        fileName: path.resolve(fileName, '..', pageHead.prev),
        handleCondition,
        page,
        limit,
        order,
      },
      prevData
    );
  } else {
    return prevData;
  }
}
