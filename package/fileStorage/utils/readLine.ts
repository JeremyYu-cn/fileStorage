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
