import path from 'path';
import config from '../default.config';
import { getFileIsExists } from '../utils/fileControl';
import { createCollection } from './create';
import Select from '../select';
import { deleteCollection } from './delete';
export default class Collection {
    config;
    baseUrl;
    extra;
    constructor(fileConfig) {
        this.config = config;
        this.baseUrl = '';
        this.extra = 'fsdat';
        if (fileConfig) {
            this.config = Object.assign(config, fileConfig);
        }
        this.init();
    }
    init() {
        const { baseUrl } = this.config;
        this.baseUrl = baseUrl;
    }
    async createConnection(name) {
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
    async getConnection(name) {
        const filePath = path.resolve(this.baseUrl, name);
        if (!(await getFileIsExists(filePath))) {
            throw new Error('collection is not exists');
        }
        const select = new Select(filePath);
        return await select.init();
    }
    async deleteConnection(name) {
        const filePath = path.resolve(this.baseUrl, name);
        return await deleteCollection(filePath);
    }
    async getCollectionIsExists(name) {
        const filePath = path.resolve(this.baseUrl, `${name}`);
        return await getFileIsExists(filePath);
    }
}
