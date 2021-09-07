import { IReadLineFile } from '../utils/readLine';
import { IReadLineResult } from '../utils/statusMsg';
export declare function readlineFile<T extends Record<string, any> = {}>(data: IReadLineFile<T>): Promise<IReadLineResult<T[]>>;
export declare function readPage<T extends Record<string, any> = {}>({ fileName, handleCondition, limit, order }: IReadLineFile<T>, prevData?: T[], ignoreCount?: number): Promise<T[]>;
export declare function readPageWithCount<T extends Record<string, any>>({ fileName, handleCondition }: IReadLineFile<T>, count?: number): Promise<number>;
export declare function descReadPage<T extends Record<string, any> = {}>({ fileName, handleCondition, limit, order }: IReadLineFile<T>, prevData?: T[], ignoreCount?: number): Promise<T[]>;
