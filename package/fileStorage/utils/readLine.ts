import { createReadStream, createWriteStream } from 'fs';
import { getSuccessStatus, IReadLineResult } from './statusMsg';

export interface IReadLineFile<T> {
  fileName: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  handleCondition?: (data: T) => boolean;
}

export interface IUpdateFile<T> extends IReadLineFile<T> {
  updateValue: Record<string, any>;
  pageCount?: number;
}
