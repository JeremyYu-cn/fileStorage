import { IReadLineResult } from '../utils/statusMsg';
export interface IUpdateOption {
    data: Record<string, any>;
}
declare type OrderType = 'asc' | 'desc';
declare type createConditionParam = {
    order?: OrderType;
    where?: Record<string, any>;
    limit?: number | number[];
};
export default class Select {
    private headData;
    private filePath;
    private totalLimit;
    constructor(filePath: string);
    init(): Promise<this>;
    private getHead;
    createCondition(condition: createConditionParam): {
        select: () => Promise<IReadLineResult<any>>;
        update: (data: IUpdateOption) => Promise<IReadLineResult<any>>;
        count: (...args: any[]) => Promise<number>;
        delete: () => Promise<IReadLineResult<never[]>>;
    } & Record<string, any>;
    count(...args: any): Promise<number>;
    select(): Promise<IReadLineResult<any>>;
    private controlFun;
    update({ data }: IUpdateOption, condition: Record<string, any>): Promise<IReadLineResult<any>>;
    insert(data: Record<string, any>): Promise<IReadLineResult<[]>>;
    delete(condition: Record<string, any>): Promise<IReadLineResult<never[]>>;
    private handleSelectCondition;
    private handleUpdate;
}
export {};
