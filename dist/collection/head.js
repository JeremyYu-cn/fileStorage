import { createReadStream, promises } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import { HEAD_EXTRA } from './config';
export async function getHeadData(filePath, extra = HEAD_EXTRA) {
    return JSON.parse(await promises.readFile(resolve(filePath, extra), { encoding: 'utf8' }));
}
export async function updateCollectionHead(filePath, data) {
    await promises.writeFile(filePath, JSON.stringify(data));
}
export function getPageHeader(fileName) {
    return new Promise((resolve) => {
        const stream = createReadStream(fileName);
        const rl = createInterface({
            input: stream,
        });
        rl.on('line', (chunk) => {
            resolve(JSON.parse(chunk));
            rl.close();
        });
    });
}
export async function updatePageHead(fileName, data) {
    const chunk = await promises.readFile(fileName, 'utf8');
    const chunkArr = chunk.split('\n');
    chunkArr[0] = JSON.stringify(data);
    return await promises.writeFile(fileName, chunkArr.join('\n'));
}
