"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.deleteRecord = exports.handleDeleteRecord = void 0;
const statusMsg_1 = require("../utils/statusMsg");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function handleDeleteRecord(data) {
    const startTime = Date.now();
    const num = await deleteRecord(data);
    return (0, statusMsg_1.getSuccessStatus)([], (0, dayjs_1.default)().diff(startTime, 'ms'), `${num} data was deleted`);
}
exports.handleDeleteRecord = handleDeleteRecord;
async function deleteRecord({ fileName, handleCondition, pageCount = 0, }) {
    const chunk = await fs_1.promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
        if (handleCondition && handleCondition(JSON.parse(json.data))) {
            json.isDelete = true;
            pageCount++;
        }
        val = JSON.stringify(json);
        return val;
    });
    chunkArr.unshift(JSON.stringify(pageHead));
    await fs_1.promises.writeFile(fileName, chunkArr.join('\n'));
    if (pageHead.next) {
        return deleteRecord({
            fileName: path_1.default.resolve(fileName, '..', pageHead.next),
            handleCondition,
            pageCount,
        });
    }
    else {
        return pageCount;
    }
}
exports.deleteRecord = deleteRecord;
async function deleteCollection(fileName) {
    try {
        await fs_1.promises.rm(fileName, {
            recursive: true,
        });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.deleteCollection = deleteCollection;
