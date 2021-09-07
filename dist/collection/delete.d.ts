export declare type deleteFileOption = {
    fileName: string;
    handleCondition: (data: Record<string, any>) => boolean;
};
export declare type deleteFileParam = deleteFileOption & {
    pageCount?: number;
};
export declare function handleDeleteRecord(data: deleteFileOption): Promise<import("../utils/statusMsg").IReadLineResult<never[]>>;
export declare function deleteRecord({ fileName, handleCondition, pageCount, }: deleteFileParam): Promise<number>;
export declare function deleteCollection(fileName: string): Promise<boolean>;
