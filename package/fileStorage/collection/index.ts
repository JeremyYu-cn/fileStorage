/**
 * 创建集合
 */
import path from 'path';
import config, { IConfifOption } from '../default.config';
import { getFileIsExists, createFile } from '../utils/fileControl';
import Select from '../select';

export default class Collection {
  private config: IConfifOption;
  private baseUrl: string;
  private extra: string;

  constructor(fileConfig?: IConfifOption) {
    this.config = config;
    this.baseUrl = '';
    this.extra = 'fsdat';

    if (fileConfig) {
      this.config = Object.assign(config, fileConfig);
    }
    this.init();
  }

  private init() {
    const { baseUrl } = this.config;
    this.baseUrl = baseUrl;
  }

  /**
   * 创建集合
   */
  async createConnection(name: string) {
    const fileName = `${name}.${this.extra}`;
    const filePath = path.resolve(this.baseUrl, fileName);
    if (await getFileIsExists(filePath)) {
      throw new Error('collection is exists');
    }
    return await createFile(this.baseUrl, fileName);
  }

  /**
   * 获取集合
   */
  async getConnection(name: string): Promise<Select> {
    const filePath = path.resolve(this.baseUrl, `${name}.${this.extra}`);
    console.log(filePath);

    if (!(await getFileIsExists(filePath))) {
      throw new Error('collection is not exists');
    }
    return new Select(filePath);
  }

  /**
   * 查看collection是否存在
   */
  async getCollectionIsExists(name: string): Promise<boolean> {
    const filePath = path.resolve(this.baseUrl, `${name}.${this.extra}`);
    return await getFileIsExists(filePath);
  }
}
