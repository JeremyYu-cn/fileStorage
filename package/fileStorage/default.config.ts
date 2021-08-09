import path from 'path';

export interface IConfifOption {
  /**
   * 存放集合的文件夹路径
   */
  baseUrl: string;
}

const config: IConfifOption = {
  baseUrl: path.resolve(process.cwd(), 'file_data'),
};

export default config;
