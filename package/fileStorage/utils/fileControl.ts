import { access, constants, mkdir, writeFile, stat } from 'fs';
import path from 'path';
/**
 * 判断文件是否存在
 * @param path string
 * @returns
 */
export function getFileIsExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    access(path, constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else resolve(true);
    });
  });
}

/**
 * 验证是否是文件
 * @param fileName
 * @returns
 */
export function checkIsFile(fileName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stat(fileName, (err, stats) => {
      if (err) reject(err);
      else {
        resolve(stats.isFile());
      }
    });
  });
}

/**
 * 创建文件夹
 * @param dirPath
 * @returns
 */
export function mkdirAsync(dirPath: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (await getFileIsExists(dirPath)) {
      throw new Error(`${dirPath} is exists`);
    }
    mkdir(dirPath, (err) => {
      if (!err) resolve(true);
      else {
        console.log(err);
        resolve(false);
      }
    });
  });
}

/**
 * 创建文件
 * @param filePath
 * @returns
 */
export function createFile(
  basePath: string,
  fileName: string
): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (!(await getFileIsExists(basePath))) {
      const createResult = await mkdirAsync(basePath);
    }
    const filePath = path.resolve(basePath, fileName);
    writeFile(filePath, '', { encoding: 'utf-8' }, (err) => {
      if (!err) resolve(true);
      else {
        console.log(err);
        resolve(false);
      }
    });
  });
}
