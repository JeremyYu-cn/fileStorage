"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorStatus = exports.getSuccessStatus = void 0;
function getSuccessStatus(data, time, msg = 'success', length = 0) {
    return {
        code: 200,
        msg,
        data,
        time: `${time} ms`,
        length: length || data.length,
    };
}
exports.getSuccessStatus = getSuccessStatus;
function getErrorStatus(msg, time, code = 500) {
    return {
        code,
        msg,
        time: `${time} ms`,
    };
}
exports.getErrorStatus = getErrorStatus;
