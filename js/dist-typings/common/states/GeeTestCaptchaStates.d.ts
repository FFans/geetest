import { AlertAttrs } from 'flarum/common/components/Alert';
import { BaseConfig, Config } from '@/common/utils/Settings';
import { EnumProductService } from '@/common/enums/EnumProductService';
export default class GeeTestCaptchaStates {
    isNotBind: boolean;
    isBind: boolean;
    config: Omit<Config, 'key'> | (Omit<BaseConfig, 'key'> & {
        productService: EnumProductService;
    });
    private readyCallback;
    private successCallback;
    private errorCallback;
    private captchaInstance;
    constructor(config: Omit<Config, 'key'> | (Omit<BaseConfig, 'key'> & {
        productService: EnumProductService;
    }), readyCallback: () => void, successCallback: () => void, errorCallback?: (alertAttrs: AlertAttrs) => void);
    render(element: Element): void;
    renderV4(element: Element): void;
    renderV3(element: Element): void;
    v3Loaded(): void;
    handleInitError(e: {
        code: string;
        msg: string;
        desc: {
            detail: string;
            type: string;
        };
    }): void;
    handleError(error: {
        code: string;
        msg: string;
        desc: {
            detail: string;
            type: string;
        };
    }, subject?: string): void;
    show(): any;
    reset(): any;
    getValidate(): any;
}
