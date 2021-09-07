/// <reference types="node" />
import { Interface } from 'readline';
export interface IReadLineFile<T> {
    fileName: string;
    limit?: number | number[];
    order?: 'asc' | 'desc';
    handleCondition?: (data: T) => boolean;
}
export interface IUpdateFile<T> extends IReadLineFile<T> {
    updateValue: Record<string, any>;
    pageCount?: number;
}
export declare type readFileLineParam = {
    fileName: string;
    onLine: (data: string, rl: Interface) => void;
    onEnd: () => void;
};
export declare function readFileByLine({ fileName, onLine, onEnd, }: readFileLineParam): Promise<void>;
