"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.descReadPage = exports.readPageWithCount = exports.readPage = exports.readlineFile = void 0;
const fileControl_1 = require("@/utils/fileControl");
const readLine_1 = require("@/utils/readLine");
const statusMsg_1 = require("@/utils/statusMsg");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const readline_1 = require("readline");
function readlineFile(data) {
    return new Promise(async (resolve, reject) => {
        const { fileName } = data;
        if (!(await (0, fileControl_1.checkIsFile)(fileName))) {
            reject((0, statusMsg_1.getErrorStatus)(`${fileName} is not exists`));
        }
        else {
            const startTime = Date.now();
            const result = data.order === 'desc'
                ? await descReadPage(data)
                : await readPage(data);
            resolve((0, statusMsg_1.getSuccessStatus)(result, (0, dayjs_1.default)().diff(startTime, 'ms')));
        }
    });
}
exports.readlineFile = readlineFile;
function readPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
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
        (0, readLine_1.readFileByLine)({
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
                    const nextPath = path_1.default.resolve(fileName, '..', pageHead.next);
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
exports.readPage = readPage;
async function readPageWithCount({ fileName, handleCondition }, count = 0) {
    return new Promise((resolve) => {
        let ignoreCount = 0;
        const rl = (0, readline_1.createInterface)({
            input: (0, fs_1.createReadStream)(fileName),
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
                const nextPath = path_1.default.resolve(fileName, '..', pageHead.next);
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
exports.readPageWithCount = readPageWithCount;
async function descReadPage({ fileName, handleCondition, limit = 100, order = 'asc' }, prevData = [], ignoreCount = 0) {
    const chunk = await fs_1.promises.readFile(fileName, 'utf8');
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
            fileName: path_1.default.resolve(fileName, '..', pageHead.prev),
            handleCondition,
            limit,
            order,
        }, prevData, ignoreCount);
    }
    else {
        return prevData;
    }
}
exports.descReadPage = descReadPage;
