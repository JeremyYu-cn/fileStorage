import { IUpdateFile } from '../utils/readLine';
import { getSuccessStatus, IReadLineResult } from '../utils/statusMsg';
import dayjs from 'dayjs';
import { promises } from 'fs';
import path from 'path';
import { IInsertData } from './append';
import { collectionDataHead } from './create';
import { getHeadData } from './head';

export async function handleUpdate<T extends Record<string, any>>(
  data: IUpdateFile<T>
): Promise<IReadLineResult<string>> {
  const startTime = Date.now();
  const { head } = await getHeadData(data.fileName);
  const pagePath = path.resolve(data.fileName, head);
  const result = await updateFile(
    Object.assign(data, {
      fileName: pagePath,
    })
  );
  return getSuccessStatus<any>(
    [],
    dayjs().diff(startTime, 'ms'),
    `${result} records changed.`
  );
}

/**
 * 更新文件
 * @param param0
 */
export async function updateFile<T extends Record<string, any>>({
  fileName,
  updateValue,
  handleCondition,
  pageCount = 0,
}: IUpdateFile<T>): Promise<number> {
  const chunk = await promises.readFile(fileName, 'utf8');
  let chunkArr = chunk.split('\n');
  const pageHead: collectionDataHead = JSON.parse(chunkArr.splice(0, 1)[0]);
  chunkArr = chunkArr.map((val) => {
    const json: IInsertData = JSON.parse(val);

    if (handleCondition && handleCondition(JSON.parse(json.data))) {
      json.data = JSON.stringify(updateValue);
      pageCount++;
    }
    val = JSON.stringify(json);

    return val;
  });
  chunkArr.unshift(JSON.stringify(pageHead));
  await promises.writeFile(fileName, chunkArr.join('\n'));
  if (pageHead.next) {
    return updateFile({
      fileName: path.resolve(fileName, '..', pageHead.next),
      updateValue,
      handleCondition,
      pageCount,
    });
  } else {
    return pageCount;
  }
}
