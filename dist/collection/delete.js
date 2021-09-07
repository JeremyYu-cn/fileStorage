import { getSuccessStatus } from '../utils/statusMsg';
import dayjs from 'dayjs';
import { promises } from 'fs';
import path from 'path';
export async function handleDeleteRecord(data) {
    const startTime = Date.now();
    const num = await deleteRecord(data);
    return getSuccessStatus([], dayjs().diff(startTime, 'ms'), `${num} data was deleted`);
}
export async function deleteRecord({ fileName, handleCondition, pageCount = 0, }) {
    const chunk = await promises.readFile(fileName, 'utf8');
    let chunkArr = chunk.split('\n');
    const pageHead = JSON.parse(chunkArr.splice(0, 1)[0]);
    chunkArr = chunkArr.map((val) => {
        const json = JSON.parse(val);
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
        return deleteRecord({
            fileName: path.resolve(fileName, '..', pageHead.next),
            handleCondition,
            pageCount,
        });
    }
    else {
        return pageCount;
    }
}
export async function deleteCollection(fileName) {
    try {
        await promises.rm(fileName, {
            recursive: true,
        });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
