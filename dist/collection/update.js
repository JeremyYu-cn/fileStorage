import { getSuccessStatus } from '../utils/statusMsg';
import dayjs from 'dayjs';
import { promises } from 'fs';
import path from 'path';
import { getHeadData } from './head';
export async function handleUpdate(data) {
    const startTime = Date.now();
    const { head } = await getHeadData(data.fileName);
    const pagePath = path.resolve(data.fileName, head);
    const result = await updateFile(Object.assign(data, {
        fileName: pagePath,
    }));
    return getSuccessStatus([], dayjs().diff(startTime, 'ms'), `${result} records changed.`);
}
export async function updateFile({ fileName, updateValue, handleCondition, pageCount = 0, }) {
    const chunk = await promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
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
    }
    else {
        return pageCount;
    }
}
