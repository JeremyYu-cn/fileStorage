"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertData = void 0;
const statusMsg_1 = require("@/utils/statusMsg");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("./config");
const create_1 = require("./create");
const head_1 = require("./head");
async function insertData({ fileName, data, headData, extra = 'fsdat', }) {
    const startTime = Date.now();
    const insertData = {
        id: (0, uuid_1.v4)(),
        data,
        create: Date.now(),
        next: '',
    };
    const pageHead = await (0, head_1.getPageHeader)(fileName);
    let nextPath = fileName;
    let updateCollectionData = Object.assign(headData, {
        total: ++headData.total,
    });
    const headPath = path_1.default.resolve(fileName, '..', config_1.HEAD_EXTRA);
    if (pageHead.total === pageHead.limit) {
        const newFileName = Date.now();
        nextPath = path_1.default.resolve(fileName, '..', `${newFileName}.${extra}`);
        await (0, create_1.createCollectionDataFile)({
            filePath: path_1.default.resolve(fileName, '..'),
            fileName: `${newFileName}`,
            extra,
            prev: headData.last,
            total: 1,
        });
        updateCollectionData = Object.assign(updateCollectionData, {
            last: `${newFileName}.${extra}`,
        });
    }
    try {
        await fs_1.promises.appendFile(nextPath, `\n${JSON.stringify(insertData)}`, 'utf8');
        await (0, head_1.updateCollectionHead)(headPath, updateCollectionData);
        if (nextPath !== fileName) {
            const writePageHead = Object.assign(pageHead, {
                next: `${path_1.default.basename(nextPath)}`,
            });
            await (0, head_1.updatePageHead)(fileName, writePageHead);
        }
        else {
            await (0, head_1.updatePageHead)(nextPath, Object.assign(pageHead, { total: ++pageHead.total }));
        }
        return (0, statusMsg_1.getSuccessStatus)([], (0, dayjs_1.default)().diff(startTime, 'ms'));
    }
    catch (err) {
        return (0, statusMsg_1.getErrorStatus)(err.message, (0, dayjs_1.default)().diff(startTime, 'ms'));
    }
}
exports.insertData = insertData;
