import path from 'path';
import { getHeadData } from '../collection/head';
import { readlineFile, readPageWithCount } from '../collection/select';
import { insertData } from '../collection/append';
import { handleUpdate } from '../collection/update';
import { handleDeleteRecord } from '../collection/delete';
export default class Select {
    headData;
    filePath;
    totalLimit;
    constructor(filePath) {
        this.filePath = filePath;
        this.totalLimit = 10000000;
        this.headData = null;
    }
    async init() {
        await this.getHead();
        return this;
    }
    async getHead() {
        if (!this.headData) {
            this.headData = await getHeadData(this.filePath);
        }
        return this.headData;
    }
    createCondition(condition) {
        return this.controlFun(condition);
    }
    async count(...args) {
        const { head } = this.headData;
        const { where = {} } = args[0] || {};
        const readFilePath = path.resolve(this.filePath, head);
        return await readPageWithCount({
            fileName: readFilePath,
            handleCondition: (data) => this.handleSelectCondition(data, where),
        });
    }
    select() {
        const { head, last } = this.headData;
        const { where = {}, limit, order = 'asc', } = arguments[0] || {};
        const readFilePath = path.resolve(this.filePath, order === 'asc' ? head : last);
        return new Promise((resolve) => {
            readlineFile({
                fileName: readFilePath,
                handleCondition: (data) => this.handleSelectCondition(data, where),
                limit,
                order,
            }).then((msg) => {
                resolve(msg);
            });
        });
    }
    controlFun(condition, extraFunction) {
        return Object.assign({
            select: this.select.bind(this, condition),
            update: (data) => this.update(data, condition),
            count: this.count.bind(this, condition),
            delete: () => this.delete(condition),
        }, extraFunction);
    }
    async update({ data }, condition) {
        const result = await this.handleUpdate(condition, data);
        return result;
    }
    async insert(data) {
        const { last } = this.headData;
        return await insertData({
            fileName: path.resolve(this.filePath, last),
            data: `${JSON.stringify(data)}`,
            headData: this.headData,
        });
    }
    async delete(condition) {
        const { head } = this.headData;
        const result = await handleDeleteRecord({
            fileName: path.resolve(this.filePath, head),
            handleCondition: (data) => this.handleSelectCondition(data, condition.where),
        });
        return result;
    }
    handleSelectCondition(data, condition) {
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
    async handleUpdate(condition, updateValue) {
        const result = await handleUpdate({
            fileName: this.filePath,
            handleCondition: (data) => this.handleSelectCondition(data, condition),
            updateValue,
            limit: this.totalLimit,
        });
        return result;
    }
}
