import CommonSettings, { Config } from '@/common/utils/Settings';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
export declare function getSetting(key?: string, type?: 'boolean'): any;
export declare function getContextEventSettings(contextEvent: EnumContextEvent): {
    standalone: any;
    product: any;
    id: any;
    key: any;
};
export default class AdminSettings extends CommonSettings {
    static get(key: string, type?: 'boolean'): string | boolean;
    static getDefaultConfig(): Record<keyof Config, any>;
    static getContextEventConfig(contextEvent: EnumContextEvent): {
        key: any;
        id: any;
        product: any;
        standalone: any;
        productService: any;
    };
}
