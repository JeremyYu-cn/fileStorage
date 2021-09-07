import { checkIsFile } from '../utils/fileControl';
import { readFileByLine } from '../utils/readLine';
import { getErrorStatus, getSuccessStatus, } from '../utils/statusMsg';
import dayjs from 'dayjs';
import { createReadStream, promises } from 'fs';
import path from 'path';
import { createInterface } from 'readline';
export function readlineFile(data) {
    return new Promise(async (resolve, reject) => {
        const { fileName } = data;
        if (!(await checkIsFile(fileName))) {
            reject(getErrorStatus(`${fileName} is not exists`));
        }
        else {
            const startTime = Date.now();
            const result = data.order === 'desc'
                ? await descReadPage(data)
                : await readPage(data);
            resolve(getSuccessStatus(result, dayjs().diff(startTime, 'ms')));
        }
    });
}
export function readPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
    return new Promise((resolve) => {
        const arr = prevData;
        const ignoreNum = Array.isArray(limit) ? limit[0] : null;
        const limitNum = Array.isArray(limit) ? limit[1] : limit;
        let pageHead = {
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
                if (msg === '')
                    return;
                const json = JSON.parse(msg);
                const data = JSON.parse(json.data);
                if (json.isDelete)
                    return;
                if ((!handleCondition || handleCondition(data)) &&
                    arr.length < limitNum) {
                    if (ignoreNum && ignoreNum > ignoreCount) {
                        ignoreCount++;
                    }
                    else {
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
                    const result = await readPage({
                        fileName: nextPath,
                        handleCondition,
                        limit,
                        order,
                    }, arr);
                    resolve(result);
                }
                else {
                    resolve(arr);
                }
            },
        });
    });
}
export async function readPageWithCount({ fileName, handleCondition }, count = 0) {
    return new Promise((resolve) => {
        let ignoreCount = 0;
        const rl = createInterface({
            input: createReadStream(fileName),
        });
        let pageHead = {
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
            if (msg === '')
                return;
            const json = JSON.parse(msg);
            const data = JSON.parse(json.data);
            if (json.isDelete)
                return;
            if (!handleCondition || handleCondition(data)) {
                count++;
            }
        });
        rl.on('close', async () => {
            if (pageHead.next) {
                const nextPath = path.resolve(fileName, '..', pageHead.next);
                const result = await readPageWithCount({
                    fileName: nextPath,
                    handleCondition,
                }, count);
                resolve(result);
            }
            else {
                resolve(count);
            }
        });
    });
}
export async function descReadPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
    const chunk = await promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr[0]);
    chunkArr = chunkArr.reverse();
    const ignoreNum = Array.isArray(limit) ? limit[0] : null;
    const limitNum = Array.isArray(limit) ? limit[1] : limit;
    for (let i = 0, max = chunkArr.length - 1; i < max; i++) {
        const data = JSON.parse(chunkArr[i]).data;
        const json = JSON.parse(data);
        if (handleCondition && handleCondition(json)) {
            if (ignoreNum && ignoreNum > ignoreCount) {
                ignoreCount++;
            }
            else {
                prevData.push(json);
            }
        }
        if (prevData.length >= limitNum) {
            break;
        }
    }
    if (pageHead.prev && prevData.length < limitNum) {
        return await descReadPage({
            fileName: path.resolve(fileName, '..', pageHead.prev),
            handleCondition,
            limit,
            order,
        }, prevData, ignoreCount);
    }
    else {
        return prevData;
    }
}
