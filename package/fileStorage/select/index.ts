import {
  IReadLineFile,
  IReadLineResult,
  readlineFile,
  updateFile,
} from '@/utils/readLine';

export interface IUpdateOption {
  data: Record<string, any>;
}

export default class Select {
  /**
   * 文件路径
   */
  private filePath: string;
  /**
   * 条目限制
   */
  private limit: number;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.limit = 10000000;
  }

  select<T = {}>(): Promise<IReadLineResult<T[]>> {
    const condition = arguments[0] || {};
    return new Promise((resolve) => {
      readlineFile<T>({
        fileName: this.filePath,
        handleCondition: (data) => this.handleSelectCondition(data, condition),
        limit: this.limit,
      }).then((msg) => {
        resolve(msg);
      });
    });
  }

  /**
   * 查询条件
   * @param condition
   * @returns
   */
  where(condition: Record<string, any>) {
    return {
      select: this.select.bind(this, condition),
      update: (data: IUpdateOption) => this.update(data, condition),
    };
  }

  /**
   * 更新数据
   */
  private update(
    { data }: IUpdateOption,
    condition: Record<string, any>
  ): Promise<IReadLineResult<Record<string, any>>> {
    return new Promise(async (resolve) => {
      const result = await this.handleUpdate(condition, data);

      resolve(result);
    });
  }

  /**
   * 处理根据条件查询方法
   */
  private handleSelectCondition(
    data: Record<string, any>,
    condition: Record<string, any>
  ): boolean {
    const keys = Object.keys(condition);
    return keys.every((val) => {
      const value = condition[val];
      switch (Object.prototype.toString.call(val)) {
        case '[object String]':
        case '[object Number]':
        case '[object Boolean]':
          return value === data[val];
        default:
          return true;
      }
    });
  }

  /**
   * 处理更新请求
   * @param condition 条件
   */
  private async handleUpdate(
    condition: Record<string, any>,
    updateValue: Record<string, any>
  ) {
    const result = await updateFile({
      fileName: this.filePath,
      handleCondition: (data) => this.handleSelectCondition(data, condition),
      updateValue,
      limit: this.limit,
    });

    return result;
  }
}
