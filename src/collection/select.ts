import { checkIsFile } from '@/utils/fileControl';
import { IReadLineFile, readFileByLine } from '@/utils/readLine';
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
  { fileName, handleCondition, limit = 100, order = 'asc' }: IReadLineFile<T>,
  prevData: T[] = [],
  ignoreCount: number = 0
): Promise<T[]> {
  return new Promise((resolve) => {
    const arr: T[] = prevData;
    const ignoreNum = Array.isArray(limit) ? limit[0] : null;
    const limitNum = Array.isArray(limit) ? limit[1] : limit;
    let pageHead: collectionDataHead = {
      prev: '',
      next: '',
      total: 0,
      limit: 0,
    };
    readFileByLine({
      fileName,
      onLine: (msg, rl) => {
        if (ignoreCount === 0) {
          pageHead = JSON.parse(msg);
          ignoreCount++;
          return;
        }
        if (msg === '') return;
        const json: T = JSON.parse(msg);
        const data: T = JSON.parse(json.data);
        if (json.isDelete) return;
        if (
          (!handleCondition || handleCondition(data)) &&
          arr.length < limitNum
        ) {
          if (ignoreNum && ignoreNum > ignoreCount) {
            ignoreCount++;
          } else {
            arr.push(data);
          }
        }
        if (arr.length >= limitNum) {
          rl.close();
        }
      },
      onEnd: async () => {
        if (arr.length < limit && pageHead.next) {
          const nextPath = path.resolve(fileName, '..', pageHead.next);
          const result = await readPage(
            {
              fileName: nextPath,
              handleCondition,
              limit,
              order,
            },
            arr
          );
          resolve(result);
        } else {
          resolve(arr);
        }
      },
    });
  });
}

/**
 * 查询一共有多少条记录
 */
export async function readPageWithCount<T extends Record<string, any>>(
  { fileName, handleCondition }: IReadLineFile<T>,
  count: number = 0
): Promise<number> {
  return new Promise((resolve) => {
    let ignoreCount = 0;
    const rl = createInterface({
      input: createReadStream(fileName),
    });

    let pageHead: collectionDataHead = {
      prev: '',
      next: '',
      total: 0,
      limit: 0,
    };

    rl.on('line', (msg) => {
      if (ignoreCount === 0) {
        ignoreCount++;
        pageHead = JSON.parse(msg);
        return;
      }
      if (msg === '') return;
      const json: T = JSON.parse(msg);
      const data: T = JSON.parse(json.data);
      if (json.isDelete) return;
      if (!handleCondition || handleCondition(data)) {
        count++;
      }
    });

    rl.on('close', async () => {
      if (pageHead.next) {
        const nextPath = path.resolve(fileName, '..', pageHead.next);
        const result = await readPageWithCount(
          {
            fileName: nextPath,
            handleCondition,
          },
          count
        );
        resolve(result);
      } else {
        resolve(count);
      }
    });
  });
}

// 倒序查询
export async function descReadPage<T extends Record<string, any> = {}>(
  { fileName, handleCondition, limit = 100, order = 'asc' }: IReadLineFile<T>,
  prevData: T[] = [],
  ignoreCount: number = 0
): Promise<T[]> {
  const chunk = await promises.readFile(fileName, 'utf8');
  let chunkArr = chunk.split('\n');
  const pageHead: collectionDataHead = JSON.parse(chunkArr[0]);
  chunkArr = chunkArr.reverse();

  const ignoreNum = Array.isArray(limit) ? limit[0] : null;
  const limitNum = Array.isArray(limit) ? limit[1] : limit;
  // do not use the first line

  for (let i = 0, max = chunkArr.length - 1; i < max; i++) {
    const data: string = JSON.parse(chunkArr[i]).data;
    const json: T = JSON.parse(data);
    if (handleCondition && handleCondition(json)) {
      if (ignoreNum && ignoreNum > ignoreCount) {
        ignoreCount++;
      } else {
        prevData.push(json);
      }
    }
    if (prevData.length >= limitNum) {
      break;
    }
  }

  if (pageHead.prev && prevData.length < limitNum) {
    return await descReadPage(
      {
        fileName: path.resolve(fileName, '..', pageHead.prev),
        handleCondition,
        limit,
        order,
      },
      prevData,
      ignoreCount
    );
  } else {
    return prevData;
  }
}
