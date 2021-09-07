import { IUpdateFile } from '../utils/readLine';
import { IReadLineResult } from '../utils/statusMsg';
export declare function handleUpdate<T extends Record<string, any>>(data: IUpdateFile<T>): Promise<IReadLineResult<string>>;
export declare function updateFile<T extends Record<string, any>>({ fileName, updateValue, handleCondition, pageCount, }: IUpdateFile<T>): Promise<number>;
