import { IConfifOption } from '../default.config';
import Select from '../select';
export default class Collection {
    private config;
    private baseUrl;
    private extra;
    constructor(fileConfig?: IConfifOption);
    private init;
    createConnection(name: string): Promise<boolean>;
    getConnection(name: string): Promise<Select>;
    deleteConnection(name: string): Promise<boolean>;
    getCollectionIsExists(name: string): Promise<boolean>;
}
