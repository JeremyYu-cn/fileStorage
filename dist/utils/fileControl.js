"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFile = exports.mkdirAsync = exports.checkIsFile = exports.getFileIsExists = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function getFileIsExists(path) {
    return new Promise((resolve) => {
        (0, fs_1.access)(path, fs_1.constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            else
                resolve(true);
        });
    });
}
exports.getFileIsExists = getFileIsExists;
function checkIsFile(fileName) {
    return new Promise((resolve, reject) => {
        (0, fs_1.stat)(fileName, (err, stats) => {
            if (err)
                reject(err);
            else {
                resolve(stats.isFile());
            }
        });
    });
}
exports.checkIsFile = checkIsFile;
function mkdirAsync(dirPath) {
    return new Promise(async (resolve) => {
        if (await getFileIsExists(dirPath)) {
            throw new Error(`${dirPath} is exists`);
        }
        (0, fs_1.mkdir)(dirPath, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}
exports.mkdirAsync = mkdirAsync;
function createFile(basePath, fileName, data = '') {
    return new Promise(async (resolve) => {
        if (!(await getFileIsExists(basePath))) {
            const createResult = await mkdirAsync(basePath);
        }
        const filePath = path_1.default.resolve(basePath, fileName);
        (0, fs_1.writeFile)(filePath, data, { encoding: 'utf-8' }, (err) => {
            if (!err)
                resolve(true);
            else {
                console.log(err);
                resolve(false);
            }
        });
    });
}
exports.createFile = createFile;
