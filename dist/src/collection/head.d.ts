import type { collectionDataHead, collectionHeadData } from './create';
export declare function getHeadData(filePath: string, extra?: string): Promise<collectionHeadData>;
export declare function updateCollectionHead(filePath: string, data: collectionHeadData): Promise<void>;
export declare function getPageHeader(fileName: string): Promise<collectionDataHead>;
export declare function updatePageHead(fileName: string, data: collectionDataHead): Promise<void>;
