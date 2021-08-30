import { checkIsFile } from '@/utils/fileControl';
import { IReadLineFile } from '@/utils/readLine';
import {
  getErrorStatus,
  getSuccessStatus,
  IReadLineResult,
} from '@/utils/statusMsg';
import dayjs from 'dayjs';
import { createReadStream } from 'fs';
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
      const result = await readPage<T>(data);
      resolve(getSuccessStatus(result, dayjs().diff(startTime, 'ms')));
    }
  });
}

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
