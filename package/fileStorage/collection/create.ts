import { createFile } from '@/utils/fileControl';
import path from 'path';

type collectionParam = {
  filePath: string;
  fileName: string;
  extra: string;
};

export type collectionHeadData = {
  total: number;
  head: string;
  last: string;
  indexPath?: string;
};

export type collectionDataHead = {
  prev: string | null;
  next: string | null;
  total: number;
  limit: number;
};

/**
 * 创建新集合
 * @param filePath
 * @param fileName
 */
export async function createCollection({
  fileName,
  filePath,
  extra,
}: collectionParam) {
  const collectionPath = path.resolve(filePath, fileName);
  const collectionFileName = `${Date.now()}`;
  return await createCollectionHeadFile({
    fileName: collectionFileName,
    filePath: collectionPath,
    extra,
  });
}

/**
 * 创建集合头文件
 */
async function createCollectionHeadFile({
  fileName,
  filePath,
  extra,
}: collectionParam): Promise<boolean> {
  const headName = `${fileName}.${extra}`;
  const headData: collectionHeadData = {
    total: 0,
    head: headName,
    last: headName,
    indexPath: '',
  };
  const headResult = await createFile(
    filePath,
    `.head`,
    JSON.stringify(headData)
  );
  const dataResult = await createCollectionDataFile({
    fileName,
    filePath,
    extra,
  });
  return headResult && dataResult;
}

/**
 * 创建集合数据文件
 */
async function createCollectionDataFile({
  fileName,
  filePath,
  extra,
}: collectionParam): Promise<boolean> {
  const headData: collectionDataHead = {
    prev: null,
    next: null,
    total: 0,
    limit: 50000,
  };
  return await createFile(
    filePath,
    `${fileName}.${extra}`,
    JSON.stringify(headData)
  );
}
