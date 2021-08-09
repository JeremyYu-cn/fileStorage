import { checkIsFile } from '@/utils/fileControl';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import dayjs from 'dayjs';

export interface IReadLineFile<T> {
  fileName: string;
  page?: number;
  limit?: number;
  handleCondition?: (data: T) => boolean;
}

export interface IReadLineResult<T> {
  code: number;
  msg: string;
  time?: string;
  data?: T;
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
          return;
        } else {
          const json: T = JSON.parse(msg);
          if (!handleCondition) {
            arr.push(json);
          } else if (handleCondition(json)) {
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
 * 成功返回格式
 * @param data
 * @param time
 * @returns
 */
function getSuccessStatus<T>(data: T, time: number): IReadLineResult<T> {
  return {
    code: 200,
    msg: 'success',
    data,
    time: `${time} ms`,
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
