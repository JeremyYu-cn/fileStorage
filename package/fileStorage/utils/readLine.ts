import { checkIsFile } from '../utils/fileControl';
import { createReadStream, createWriteStream, appendFile } from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import dayjs from 'dayjs';
import { collectionDataHead } from '@/collection/create';

export interface IReadLineFile<T> {
  fileName: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  handleCondition?: (data: T) => boolean;
}

export interface IInsertFile {
  fileName: string;
  data: string;
}

export interface IUpdateFile<T> extends IReadLineFile<T> {
  updateValue: Record<string, any>;
}

export interface IReadLineResult<T> {
  code: number;
  msg: string;
  time?: string;
  data?: T;
  length?: number;
}

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

function readPage<T extends Record<string, any> = {}>(
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

/**
 * 更新文件
 * @param param0
 */
export function updateFile<T extends Record<string, any>>({
  fileName,
  updateValue,
  handleCondition,
  page = 1,
  limit = 100,
}: IUpdateFile<T>): Promise<IReadLineResult<T[]>> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const readStream = createReadStream(fileName);
    let data = '';

    const stream = createWriteStream(fileName);
    // cursorTo(stream, 0, 1, () => {
    //   stream.write(JSON.stringify({ data: 111 }));
    // });

    // clearLine(stream, -1);
    resolve(getSuccessStatus([], 1));
    // const rl = createInterface({
    //   input: createReadStream(fileName),
    // });

    // const ignoreNum = (page - 1) * limit;
    // let lineIndex = 0;
    // let count = 0;
    // rl.on('line', (msg) => {
    //   if (ignoreNum > count) {
    //     count++;
    //   } else if (lineIndex > limit) {
    //     rl.close();
    //   } else {
    //     const json: T = JSON.parse(msg);
    //     if (!handleCondition || handleCondition(json)) {
    //     }
    //     lineIndex++;
    //   }
    // });

    // rl.on('close', () => {
    //   resolve(getSuccessStatus([], dayjs().diff(startTime, 'ms')));
    // });
  });
}

/**
 * 插入数据
 * @returns
 */
export function insertData({
  fileName,
  data,
}: IInsertFile): Promise<IReadLineResult<[]>> {
  const startTime = Date.now();
  // @TODO add id and next link
  const insertData = {
    id: '',
    data,
    create: Date.now(),
    next: '',
  };
  return new Promise((resolve) => {
    appendFile(fileName, `\n${JSON.stringify(insertData)}`, 'utf-8', (err) => {
      if (err) {
        resolve(getErrorStatus(err.message, dayjs().diff(startTime, 'ms')));
      } else {
        resolve(getSuccessStatus([], dayjs().diff(startTime, 'ms')));
      }
    });
  });
}

/**
 * 成功返回格式
 * @param data
 * @param time
 * @returns
 */
function getSuccessStatus<T extends Record<string, any>[]>(
  data: T,
  time: number
): IReadLineResult<T> {
  return {
    code: 200,
    msg: 'success',
    data,
    time: `${time} ms`,
    length: data.length,
  };
}

/**
 * 失败返回格式
 * @param msg
 * @param time
 * @returns
 */
function getErrorStatus(msg: string, time?: number): IReadLineResult<never> {
  return {
    code: 500,
    msg,
    time: `${time} ms`,
  };
}
