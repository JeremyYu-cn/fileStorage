import { createInterface, Interface } from 'readline';
import { createReadStream, promises } from 'fs';
import { getFileIsExists } from './fileControl';

export interface IReadLineFile<T> {
  fileName: string;
  limit?: number | number[];
  order?: 'asc' | 'desc';
  handleCondition?: (data: T) => boolean;
}

export interface IUpdateFile<T> extends IReadLineFile<T> {
  updateValue: Record<string, any>;
  pageCount?: number;
}

export type readFileLineParam = {
  fileName: string;
  onLine: (data: string, rl: Interface) => void;
  onEnd: () => void;
};

export async function readFileByLine({
  fileName,
  onLine,
  onEnd,
}: readFileLineParam) {
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
