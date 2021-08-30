import {
  getErrorStatus,
  getSuccessStatus,
  IReadLineResult,
} from '@/utils/statusMsg';
import dayjs from 'dayjs';
import { appendFile, promises } from 'fs';
import path from 'path';
import { DEFAULT_PAGE_TOTAL, HEAD_EXTRA } from './config';
import {
  collectionDataHead,
  collectionHeadData,
  createCollectionDataFile,
} from './create';
import { getPageHeader, updateCollectionHead, updatePageHead } from './head';

export interface IInsertFile {
  fileName: string;
  data: string;
  headData: collectionHeadData;
  extra?: string;
}

export type IInsertData = {
  id: string;
  data: string;
  create: number;
  next: string;
};

/**
 * 插入数据
 * @returns
 */
export async function insertData({
  fileName,
  data,
  headData,
  extra = 'fsdat',
}: IInsertFile): Promise<IReadLineResult<[]>> {
  const startTime = Date.now();
  // @TODO add id and next link
  const insertData: IInsertData = {
    id: '',
    data,
    create: Date.now(),
    next: '',
  };
  const pageHead = await getPageHeader(fileName);
  let nextPath = fileName;
  if (pageHead.total === pageHead.limit) {
    const newFileName = Date.now();
    nextPath = path.resolve(fileName, '..', `${newFileName}.${extra}`);
    await createCollectionDataFile({
      filePath: path.resolve(fileName, '..'),
      fileName: `${newFileName}`,
      extra,
      prev: headData.last,
      total: 1,
    });
    const updateCollectionData: collectionHeadData = Object.assign(headData, {
      last: `${newFileName}.${extra}`,
      total: ++headData.total,
    });
    const headPath = path.resolve(fileName, '..', HEAD_EXTRA);
    await updateCollectionHead(headPath, updateCollectionData);
  }

  try {
    await promises.appendFile(
      nextPath,
      `\n${JSON.stringify(insertData)}`,
      'utf8'
    );

    if (nextPath !== fileName) {
      const writePageHead: collectionDataHead = Object.assign(pageHead, {
        next: `${path.basename(nextPath)}`,
      });
      await updatePageHead(fileName, writePageHead);
    } else {
      await updatePageHead(
        nextPath,
        Object.assign(pageHead, { total: ++pageHead.total })
      );
    }

    return getSuccessStatus([], dayjs().diff(startTime, 'ms'));
  } catch (err) {
    return getErrorStatus(err.message, dayjs().diff(startTime, 'ms'));
  }
}
