/**
 * 创建集合
 */
import path from 'path';
import config, { IConfifOption } from '../default.config';
import { getFileIsExists } from '../utils/fileControl';
import { createCollection } from './create';
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
    const filePath = path.resolve(this.baseUrl, name);
    if (await getFileIsExists(filePath)) {
      throw new Error('collection is exists');
    }
    return await createCollection({
      filePath: this.baseUrl,
      fileName: name,
      extra: this.extra,
    }).then((msg) => {
      return msg;
    });
  }

  /**
   * 获取集合
   */
  async getConnection(name: string): Promise<Select> {
    const filePath = path.resolve(this.baseUrl, name);

    if (!(await getFileIsExists(filePath))) {
      throw new Error('collection is not exists');
    }
    const select = new Select(filePath);
    return await select.init();
  }

  /**
   * 查看collection是否存在
   */
  async getCollectionIsExists(name: string): Promise<boolean> {
    const filePath = path.resolve(this.baseUrl, `${name}`);
    return await getFileIsExists(filePath);
  }
}
