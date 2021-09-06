export declare function getFileIsExists(path: string): Promise<boolean>;
export declare function checkIsFile(fileName: string): Promise<boolean>;
export declare function mkdirAsync(dirPath: string): Promise<boolean>;
export declare function createFile(basePath: string, fileName: string, data?: string): Promise<boolean>;
