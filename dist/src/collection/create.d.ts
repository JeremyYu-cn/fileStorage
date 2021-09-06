declare type collectionParam = {
    filePath: string;
    fileName: string;
    extra: string;
    prev?: string;
    next?: string;
    total?: number;
};
export declare type collectionHeadData = {
    total: number;
    head: string;
    last: string;
    indexPath?: string;
};
export declare type collectionDataHead = {
    prev: string | null;
    next: string | null;
    total: number;
    limit: number;
};
export declare function createCollection({ fileName, filePath, extra, }: collectionParam): Promise<boolean>;
export declare function createCollectionDataFile({ fileName, filePath, extra, prev, next, total, }: collectionParam): Promise<boolean>;
export {};
