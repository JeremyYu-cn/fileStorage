"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileByLine = void 0;
const readline_1 = require("readline");
const fs_1 = require("fs");
const fileControl_1 = require("./fileControl");
async function readFileByLine({ fileName, onLine, onEnd, }) {
    if (!(0, fileControl_1.getFileIsExists)(fileName)) {
        throw new Error('file is not exists');
    }
    const rl = (0, readline_1.createInterface)({
        input: (0, fs_1.createReadStream)(fileName),
    });
    rl.on('line', (chunk) => {
        onLine(chunk, rl);
    });
    rl.on('close', () => {
        onEnd();
    });
}
exports.readFileByLine = readFileByLine;
