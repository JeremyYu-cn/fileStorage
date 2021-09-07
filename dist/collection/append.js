import { getErrorStatus, getSuccessStatus, } from '../utils/statusMsg';
import dayjs from 'dayjs';
import { promises } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { HEAD_EXTRA } from './config';
import { createCollectionDataFile, } from './create';
import { getPageHeader, updateCollectionHead, updatePageHead } from './head';
export async function insertData({ fileName, data, headData, extra = 'fsdat', }) {
    const startTime = Date.now();
    const insertData = {
        id: v4(),
        data,
        create: Date.now(),
        next: '',
    };
    const pageHead = await getPageHeader(fileName);
    let nextPath = fileName;
    let updateCollectionData = Object.assign(headData, {
        total: ++headData.total,
    });
    const headPath = path.resolve(fileName, '..', HEAD_EXTRA);
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
        updateCollectionData = Object.assign(updateCollectionData, {
            last: `${newFileName}.${extra}`,
        });
    }
    try {
        await promises.appendFile(nextPath, `\n${JSON.stringify(insertData)}`, 'utf8');
        await updateCollectionHead(headPath, updateCollectionData);
        if (nextPath !== fileName) {
            const writePageHead = Object.assign(pageHead, {
                next: `${path.basename(nextPath)}`,
            });
            await updatePageHead(fileName, writePageHead);
        }
        else {
            await updatePageHead(nextPath, Object.assign(pageHead, { total: ++pageHead.total }));
        }
        return getSuccessStatus([], dayjs().diff(startTime, 'ms'));
    }
    catch (err) {
        return getErrorStatus(err.message, dayjs().diff(startTime, 'ms'));
    }
}
