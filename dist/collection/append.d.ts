import { IReadLineResult } from '@/utils/statusMsg';
import { collectionHeadData } from './create';
export interface IInsertFile {
    fileName: string;
    data: string;
    headData: collectionHeadData;
    extra?: string;
}
export declare type IInsertData = {
    id: string;
    data: string;
    isDelete?: boolean;
    create: number;
    next: string;
};
export declare function insertData({ fileName, data, headData, extra, }: IInsertFile): Promise<IReadLineResult<[]>>;
