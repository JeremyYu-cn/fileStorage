import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import { getFileIsExists } from './fileControl';
export async function readFileByLine({ fileName, onLine, onEnd, }) {
    if (!getFileIsExists(fileName)) {
        throw new Error('file is not exists');
    }
    const rl = createInterface({
        input: createReadStream(fileName),
    });
    rl.on('line', (chunk) => {
        onLine(chunk, rl);
    });
    rl.on('close', () => {
        onEnd();
    });
}
