import { readlineFile } from '@/utils/readLine';

export default class Select {
  /**
   * 文件路径
   */
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async select() {
    const data = await readlineFile({
      fileName: this.filePath,
      limit: 10000000,
    });
    console.log(data);
  }

  where(condition: Record<string, any>) {
    return {
      select: this.select.bind(this, condition),
    };
  }

  /**
   * 处理根据条件查询方法
   */
  private handleSelectCondition(
    data: Record<string, any>,
    condition: Record<string, any>
  ): Record<string, any> | null {
    return data;
  }

  private createCondition() {}
}
