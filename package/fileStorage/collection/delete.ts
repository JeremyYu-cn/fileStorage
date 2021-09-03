import { getSuccessStatus } from '@/utils/statusMsg';
import dayjs from 'dayjs';
import { promises } from 'fs';
import path from 'path';
import { IInsertData } from './append';
import { collectionDataHead } from './create';

export type deleteFileOption = {
  fileName: string;
  handleCondition: (data: Record<string, any>) => boolean;
};

export type deleteFileParam = deleteFileOption & {
  pageCount?: number;
};

export async function handleDeleteFile(data: deleteFileOption) {
  const startTime = Date.now();
  const num = await deleteFile(data);

  return getSuccessStatus(
    [],
    dayjs().diff(startTime, 'ms'),
    `${num} data was deleted`
  );
}

export async function deleteFile({
  fileName,
  handleCondition,
  pageCount = 0,
}: deleteFileParam): Promise<number> {
  const chunk = await promises.readFile(fileName, 'utf8');
  let chunkArr = chunk.split('\n');
  const pageHead: collectionDataHead = JSON.parse(chunkArr.splice(0, 1)[0]);

  chunkArr = chunkArr.map((val) => {
    const json: IInsertData = JSON.parse(val);

    if (handleCondition && handleCondition(JSON.parse(json.data))) {
      json.isDelete = true;
      pageCount++;
    }
    val = JSON.stringify(json);

    return val;
  });
  chunkArr.unshift(JSON.stringify(pageHead));
  await promises.writeFile(fileName, chunkArr.join('\n'));
  if (pageHead.next) {
    return deleteFile({
      fileName: path.resolve(fileName, '..', pageHead.next),
      handleCondition,
      pageCount,
    });
  } else {
    return pageCount;
  }
}
