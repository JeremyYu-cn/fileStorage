import path from 'path';
import type { collectionHeadData } from '@/collection/create';
import { getHeadData } from '@/collection/head';
import { IReadLineResult } from '@/utils/statusMsg';
import { readlineFile } from '@/collection/select';
import { insertData } from '@/collection/append';
import { handleUpdate } from '@/collection/update';

export interface IUpdateOption {
  data: Record<string, any>;
}

enum ConditionType {
  LIMIT = 'limit',
  ORDER = 'order',
  CONDITION = 'condition',
}

type OrderType = 'asc' | 'desc';

type createConditionParam = {
  order?: OrderType;
  where?: Record<string, any>;
  limit?: number | number[];
};

export default class Select {
  /**
   * 头文件信息
   */
  private headData: collectionHeadData | null;
  /**
   * 文件路径
   */
  private filePath: string;
  /**
   * 条目限制
   */
  private totalLimit: number;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.totalLimit = 10000000;
    this.headData = null;
  }

  async init() {
    await this.getHead();
    return this;
  }

  private async getHead(): Promise<collectionHeadData> {
    if (!this.headData) {
      this.headData = await getHeadData(this.filePath);
    }
    return this.headData;
  }

  /**
   * 创建查询条件
   * @param condition
   * @returns
   */
  createCondition(condition: createConditionParam) {
    return this.controlFun(condition);
  }

  select<T = {}>(): Promise<IReadLineResult<T[]>> {
    const { head, last } = <collectionHeadData>this.headData;

    const {
      where = {},
      limit,
      order = 'asc',
    }: Record<keyof createConditionParam, any> = arguments[0] || {};
    const readFilePath = path.resolve(
      this.filePath,
      order === 'asc' ? head : last
    );
    return new Promise((resolve) => {
      readlineFile<T>({
        fileName: readFilePath,
        handleCondition: (data) => this.handleSelectCondition(data, where),
        limit,
        order,
      }).then((msg) => {
        resolve(msg);
      });
    });
  }

  private controlFun<T extends Record<string, any>>(
    condition: any,
    extraFunction?: T
  ) {
    return Object.assign(
      {
        select: this.select.bind(this, condition),
        update: (data: IUpdateOption) => this.update(data, condition),
      },
      extraFunction
    );
  }

  /**
   * 更新数据
   */
  public update(
    { data }: IUpdateOption,
    condition: Record<string, any>
  ): Promise<IReadLineResult<any>> {
    return new Promise(async (resolve) => {
      const result = await this.handleUpdate(condition, data);

      resolve(result);
    });
  }

  public async insert(data: Record<string, any>) {
    const { last } = <collectionHeadData>this.headData;
    return await insertData({
      fileName: path.resolve(this.filePath, last),
      data: `${JSON.stringify(data)}`,
      headData: <collectionHeadData>this.headData,
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
      if (condition.type === 'limit') return true;

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
    const result = await handleUpdate({
      fileName: this.filePath,
      handleCondition: (data) => this.handleSelectCondition(data, condition),
      updateValue,
      limit: this.totalLimit,
    });

    return result;
  }
}
