"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageHead = exports.getPageHeader = exports.updateCollectionHead = exports.getHeadData = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const readline_1 = require("readline");
const config_1 = require("./config");
async function getHeadData(filePath, extra = config_1.HEAD_EXTRA) {
    return JSON.parse(await fs_1.promises.readFile((0, path_1.resolve)(filePath, extra), { encoding: 'utf8' }));
}
exports.getHeadData = getHeadData;
async function updateCollectionHead(filePath, data) {
    await fs_1.promises.writeFile(filePath, JSON.stringify(data));
}
exports.updateCollectionHead = updateCollectionHead;
function getPageHeader(fileName) {
    return new Promise((resolve) => {
        const stream = (0, fs_1.createReadStream)(fileName);
        const rl = (0, readline_1.createInterface)({
            input: stream,
        });
        rl.on('line', (chunk) => {
            resolve(JSON.parse(chunk));
            rl.close();
        });
    });
}
exports.getPageHeader = getPageHeader;
async function updatePageHead(fileName, data) {
    const chunk = await fs_1.promises.readFile(fileName, 'utf8');
    const chunkArr = chunk.split('\n');
    chunkArr[0] = JSON.stringify(data);
    return await fs_1.promises.writeFile(fileName, chunkArr.join('\n'));
}
exports.updatePageHead = updatePageHead;
