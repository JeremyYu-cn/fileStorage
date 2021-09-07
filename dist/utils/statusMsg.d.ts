export interface IReadLineResult<T> {
    code: number;
    msg: string;
    time?: string;
    data?: T;
    length?: number;
}
export declare function getSuccessStatus<T extends Record<string, any>[]>(data: T, time: number, msg?: string, length?: number): IReadLineResult<T>;
export declare function getErrorStatus(msg: string, time?: number, code?: number): IReadLineResult<never>;
