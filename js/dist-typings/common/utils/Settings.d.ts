import Stream from 'flarum/common/utils/Stream';
import { EnumProductService } from '@/common/enums/EnumProductService';
import { EnumProduct } from '@/common/enums/EnumProduct';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
export interface BaseConfig {
    product: EnumProduct;
    id: string;
    key: string;
    standalone: boolean;
}
export type StreamConfig = {
    [P in keyof BaseConfig]: Stream<BaseConfig[P]>;
};
export interface Config extends Omit<BaseConfig, 'standalone'> {
    productService: EnumProductService;
    login: boolean;
    signup: boolean;
    forgot: boolean;
}
export declare const BASE_CONFIG: ["key" | "id" | "product"];
export declare const CONFIG: (keyof Config)[];
export default class CommonSettings {
    static PREFIX: string;
    static getAssetsPath(): string;
    static getLocale(): string;
    static getPath(key?: string): string;
    static get(key: string): string | boolean;
    static isEnabled(contextEvent: EnumContextEvent): boolean;
    static isStandalone(contextEvent: EnumContextEvent): boolean;
    static isConfigured(contextEvent?: EnumContextEvent): boolean;
    static getDefaultConfig(): Omit<Config, 'key'>;
    static getContextEventConfig(contextEvent: EnumContextEvent): Omit<BaseConfig, 'key'> & {
        productService: EnumProductService;
    };
    static getConfig(contextEvent: EnumContextEvent): false | Omit<Config, "key"> | (Omit<BaseConfig, "key"> & {
        productService: EnumProductService;
    });
}
