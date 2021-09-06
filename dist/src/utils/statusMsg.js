export function getSuccessStatus(data, time, msg = 'success', length = 0) {
    return {
        code: 200,
        msg,
        data,
        time: `${time} ms`,
        length: length || data.length,
    };
}
export function getErrorStatus(msg, time, code = 500) {
    return {
        code,
        msg,
        time: `${time} ms`,
    };
}
