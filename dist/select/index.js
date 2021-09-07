"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const head_1 = require("@/collection/head");
const select_1 = require("@/collection/select");
const append_1 = require("@/collection/append");
const update_1 = require("@/collection/update");
const delete_1 = require("@/collection/delete");
class Select {
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
            this.headData = await (0, head_1.getHeadData)(this.filePath);
        }
        return this.headData;
    }
    createCondition(condition) {
        return this.controlFun(condition);
    }
    async count(...args) {
        const { head } = this.headData;
        const { where = {} } = args[0] || {};
        const readFilePath = path_1.default.resolve(this.filePath, head);
        return await (0, select_1.readPageWithCount)({
            fileName: readFilePath,
            handleCondition: (data) => this.handleSelectCondition(data, where),
        });
    }
    select() {
        const { head, last } = this.headData;
        const { where = {}, limit, order = 'asc', } = arguments[0] || {};
        const readFilePath = path_1.default.resolve(this.filePath, order === 'asc' ? head : last);
        return new Promise((resolve) => {
            (0, select_1.readlineFile)({
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
        return await (0, append_1.insertData)({
            fileName: path_1.default.resolve(this.filePath, last),
            data: `${JSON.stringify(data)}`,
            headData: this.headData,
        });
    }
    async delete(condition) {
        const { head } = this.headData;
        const result = await (0, delete_1.handleDeleteRecord)({
            fileName: path_1.default.resolve(this.filePath, head),
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
        const result = await (0, update_1.handleUpdate)({
            fileName: this.filePath,
            handleCondition: (data) => this.handleSelectCondition(data, condition),
            updateValue,
            limit: this.totalLimit,
        });
        return result;
    }
}
exports.default = Select;
