"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const default_config_1 = __importDefault(require("../default.config"));
const fileControl_1 = require("../utils/fileControl");
const create_1 = require("./create");
const select_1 = __importDefault(require("../select"));
const delete_1 = require("./delete");
class Collection {
    config;
    baseUrl;
    extra;
    constructor(fileConfig) {
        this.config = default_config_1.default;
        this.baseUrl = '';
        this.extra = 'fsdat';
        if (fileConfig) {
            this.config = Object.assign(default_config_1.default, fileConfig);
        }
        this.init();
    }
    init() {
        const { baseUrl } = this.config;
        this.baseUrl = baseUrl;
    }
    async createConnection(name) {
        const filePath = path_1.default.resolve(this.baseUrl, name);
        if (await (0, fileControl_1.getFileIsExists)(filePath)) {
            throw new Error('collection is exists');
        }
        return await (0, create_1.createCollection)({
            filePath: this.baseUrl,
            fileName: name,
            extra: this.extra,
        }).then((msg) => {
            return msg;
        });
    }
    async getConnection(name) {
        const filePath = path_1.default.resolve(this.baseUrl, name);
        if (!(await (0, fileControl_1.getFileIsExists)(filePath))) {
            throw new Error('collection is not exists');
        }
        const select = new select_1.default(filePath);
        return await select.init();
    }
    async deleteConnection(name) {
        const filePath = path_1.default.resolve(this.baseUrl, name);
        return await (0, delete_1.deleteCollection)(filePath);
    }
    async getCollectionIsExists(name) {
        const filePath = path_1.default.resolve(this.baseUrl, `${name}`);
        return await (0, fileControl_1.getFileIsExists)(filePath);
    }
}
exports.default = Collection;
