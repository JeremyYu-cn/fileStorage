"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFile = exports.handleUpdate = void 0;
const statusMsg_1 = require("@/utils/statusMsg");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const head_1 = require("./head");
async function handleUpdate(data) {
    const startTime = Date.now();
    const { head } = await (0, head_1.getHeadData)(data.fileName);
    const pagePath = path_1.default.resolve(data.fileName, head);
    const result = await updateFile(Object.assign(data, {
        fileName: pagePath,
    }));
    return (0, statusMsg_1.getSuccessStatus)([], (0, dayjs_1.default)().diff(startTime, 'ms'), `${result} records changed.`);
}
exports.handleUpdate = handleUpdate;
async function updateFile({ fileName, updateValue, handleCondition, pageCount = 0, }) {
    const chunk = await fs_1.promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
        if (handleCondition && handleCondition(JSON.parse(json.data))) {
            json.data = JSON.stringify(updateValue);
            pageCount++;
        }
        val = JSON.stringify(json);
        return val;
    });
    chunkArr.unshift(JSON.stringify(pageHead));
    await fs_1.promises.writeFile(fileName, chunkArr.join('\n'));
    if (pageHead.next) {
        return updateFile({
            fileName: path_1.default.resolve(fileName, '..', pageHead.next),
            updateValue,
            handleCondition,
            pageCount,
        });
    }
    else {
        return pageCount;
    }
}
exports.updateFile = updateFile;
