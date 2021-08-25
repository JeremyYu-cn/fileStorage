import { checkIsFile } from '../utils/fileControl';
import { createReadStream, createWriteStream, appendFile } from 'fs';
import { createInterface } from 'readline';
import dayjs from 'dayjs';

export interface IReadLineFile<T> {
  fileName: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  totalLimit?: number;
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
export function readlineFile<T extends Record<string, any> = {}>({
  fileName,
  handleCondition,
  page = 1,
  pageSize = 100,
  limit = 100,
  totalLimit = 10000,
}: IReadLineFile<T>): Promise<IReadLineResult<T[]>> {
  return new Promise(async (resolve, reject) => {
    if (!(await checkIsFile(fileName))) {
      reject(getErrorStatus(`${fileName} is not exists`));
    } else {
      const startTime = Date.now();
      const arr: T[] = [];
      const rl = createInterface({
        input: createReadStream(fileName),
      });

      const ignoreNum = (page - 1) * pageSize;
      let lineIndex = 0;
      let count = 0;

      rl.on('line', (msg) => {
        if (count === 0) {
          count++;
          return;
        }
        if (msg === '') return;
        if (ignoreNum > count) {
          count++;
        } else if (lineIndex > totalLimit) {
          rl.close();
        } else {
          const json: T = JSON.parse(msg);
          if (
            (!handleCondition || handleCondition(json)) &&
            arr.length < limit
          ) {
            arr.push(JSON.parse(json.data));
            if (arr.length >= limit) {
              rl.close();
            }
          }
          lineIndex++;
        }
      });

      rl.on('close', () =>
        resolve(getSuccessStatus(arr, dayjs().diff(startTime, 'ms')))
      );
    }
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
