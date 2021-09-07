"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionDataFile = exports.createCollection = void 0;
const fileControl_1 = require("../utils/fileControl");
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
async function createCollection({ fileName, filePath, extra, }) {
    const collectionPath = path_1.default.resolve(filePath, fileName);
    const collectionFileName = `${Date.now()}`;
    return await createCollectionHeadFile({
        fileName: collectionFileName,
        filePath: collectionPath,
        extra,
    });
}
exports.createCollection = createCollection;
async function createCollectionHeadFile({ fileName, filePath, extra, }) {
    const headName = `${fileName}.${extra}`;
    const headData = {
        total: 0,
        head: headName,
        last: headName,
        indexPath: '',
    };
    const headResult = await (0, fileControl_1.createFile)(filePath, `.head`, JSON.stringify(headData));
    const dataResult = await createCollectionDataFile({
        fileName,
        filePath,
        extra,
    });
    return headResult && dataResult;
}
async function createCollectionDataFile({ fileName, filePath, extra, prev = '', next = '', total = 0, }) {
    const writeDate = {
        prev,
        next,
        total,
        limit: config_1.DEFAULT_PAGE_TOTAL,
    };
    return await (0, fileControl_1.createFile)(filePath, `${fileName}.${extra}`, JSON.stringify(writeDate));
}
exports.createCollectionDataFile = createCollectionDataFile;
