import { access, constants, mkdir, writeFile, stat } from 'fs';
import path from 'path';
export function getFileIsExists(path) {
    return new Promise((resolve) => {
        access(path, constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            else
                resolve(true);
        });
    });
}
export function checkIsFile(fileName) {
    return new Promise((resolve, reject) => {
        stat(fileName, (err, stats) => {
            if (err)
                reject(err);
            else {
                resolve(stats.isFile());
            }
        });
    });
}
export function mkdirAsync(dirPath) {
    return new Promise(async (resolve) => {
        if (await getFileIsExists(dirPath)) {
            throw new Error(`${dirPath} is exists`);
        }
        mkdir(dirPath, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}
export function createFile(basePath, fileName, data = '') {
    return new Promise(async (resolve) => {
        if (!(await getFileIsExists(basePath))) {
            const createResult = await mkdirAsync(basePath);
        }
        const filePath = path.resolve(basePath, fileName);
        writeFile(filePath, data, { encoding: 'utf-8' }, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}
