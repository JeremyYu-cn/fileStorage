import { createFile } from '../utils/fileControl';
import path from 'path';
import { DEFAULT_PAGE_TOTAL } from './config';
export async function createCollection({ fileName, filePath, extra, }) {
    const collectionPath = path.resolve(filePath, fileName);
    const collectionFileName = `${Date.now()}`;
    return await createCollectionHeadFile({
        fileName: collectionFileName,
        filePath: collectionPath,
        extra,
    });
}
async function createCollectionHeadFile({ fileName, filePath, extra, }) {
    const headName = `${fileName}.${extra}`;
    const headData = {
        total: 0,
        head: headName,
        last: headName,
        indexPath: '',
    };
    const headResult = await createFile(filePath, `.head`, JSON.stringify(headData));
    const dataResult = await createCollectionDataFile({
        fileName,
        filePath,
        extra,
    });
    return headResult && dataResult;
}
export async function createCollectionDataFile({ fileName, filePath, extra, prev = '', next = '', total = 0, }) {
    const writeDate = {
        prev,
        next,
        total,
        limit: DEFAULT_PAGE_TOTAL,
    };
    return await createFile(filePath, `${fileName}.${extra}`, JSON.stringify(writeDate));
}
