import { checkIsFile } from '@/utils/fileControl';
import { createReadStream, createWriteStream, write, open } from 'fs';
import { createInterface } from 'readline';
import dayjs from 'dayjs';

export interface IReadLineFile<T> {
  fileName: string;
  page?: number;
  limit?: number;
  handleCondition?: (data: T) => boolean;
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
  limit = 100,
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

      const ignoreNum = (page - 1) * limit;
      let lineIndex = 0;
      let count = 0;

      rl.on('line', (msg) => {
        if (ignoreNum > count) {
          count++;
        } else if (lineIndex > limit) {
          rl.close();
        } else {
          const json: T = JSON.parse(msg);
          if (!handleCondition || handleCondition(json)) {
            arr.push(json);
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
    const str = '{ testwrite: 111 }\n';
    const strBuf = Buffer.alloc(str.length, str);
    open(fileName, 'w', (err, fd) => {
      if (err)
        getErrorStatus(
          `${fileName} is not defined`,
          dayjs().diff(startTime, 'ms')
        );
      else {
        write(fd, strBuf, 0, strBuf.length, 0, (...args) => {
          console.log(args);
        });
      }
    });

    const rl = createInterface({
      input: createReadStream(fileName),
    });

    const ignoreNum = (page - 1) * limit;
    let lineIndex = 0;
    let count = 0;
    rl.on('line', (msg) => {
      if (ignoreNum > count) {
        count++;
      } else if (lineIndex > limit) {
        rl.close();
      } else {
        const json: T = JSON.parse(msg);
        if (!handleCondition || handleCondition(json)) {
        }
        lineIndex++;
      }
    });

    rl.on('close', () => {
      resolve(getSuccessStatus([], dayjs().diff(startTime, 'ms')));
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
