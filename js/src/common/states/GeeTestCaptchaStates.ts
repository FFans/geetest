import app from 'flarum/common/app';
import ForumSettings from '@/forum/utils/Settings';
import { AlertAttrs } from 'flarum/common/components/Alert';
import { BaseConfig, Config } from '@/common/utils/Settings';
import { EnumProduct } from '@/common/enums/EnumProduct';
import { EnumProductService } from '@/common/enums/EnumProductService';
import translate from '@/common/utils/translate';

export default class GeeTestCaptchaStates {
  isNotBind: boolean = false;
  isBind: boolean = false;
  config: Omit<Config, 'key'> | (Omit<BaseConfig, 'key'> & { productService: EnumProductService });
  private readyCallback: any;
  private successCallback: any;
  private errorCallback = (alertAttrs: AlertAttrs) => {
    // By default, the alert will just be shown globally
    app.alerts.show(alertAttrs);
  };
  private captchaInstance: any;

  constructor(
    config: Omit<Config, 'key'> | (Omit<BaseConfig, 'key'> & { productService: EnumProductService }),
    readyCallback: () => void,
    successCallback: () => void,
    errorCallback?: (alertAttrs: AlertAttrs) => void
  ) {
    this.config = config;

    this.readyCallback = readyCallback;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback || this.errorCallback;

    this.isNotBind = this.config.product !== EnumProduct.BIND;
    this.isBind = !this.isNotBind;
  }

  render(element: Element) {
    // console.log('render', this.config.productService);

    switch (this.config.productService) {
      case EnumProductService.V4:
        this.renderV4(element);
        break;
      case EnumProductService.V3:
        this.renderV3(element);
        break;
      default:
        break;
    }
  }
  renderV4(element: Element) {
    window.initGeetest4?.(
      {
        captchaId: this.config.id,
        nativeButton: {
          width: '100%',
        },
        product: this.config.product,
        ...(this.isBind
          ? {
              hideSuccess: true,
            }
          : {}),
        language: ForumSettings.getLocale(),
        onError: this.handleInitError.bind(this),
      },
      (captcha) => {
        // console.log('[captcha]', captcha);
        this.captchaInstance = captcha;

        captcha.appendTo(element);

        captcha
          .onReady(() => {
            this.readyCallback?.();
          })
          .onSuccess(() => {
            this.successCallback?.();
          })
          .onError(this.handleError.bind(this));
      }
    );
  }
  renderV3(element: Element) {
    const req = new XMLHttpRequest();
    req.addEventListener('load', this.v3Loaded.bind(this));
    req.open('GET', app.forum.data.attributes!.apiUrl as string);
    req.responseType = 'json';
    req.send();
  }
  v3Loaded() {
    console.log('v3 loaded');
  }
  handleInitError(e: { code: string; msg: string; desc: { detail: string; type: string } }) {
    this.handleError(e, translate.lib('verify.init_error_message') as string);
  }

  handleError(
    error: { code: string; msg: string; desc: { detail: string; type: string } },
    subject: string = translate.lib('verify.error_message') as string
  ) {
    // {code: '60000',msg:"用户配置错误"，desc:{ detail: "用户id缺少"} }
    // Similarly to error.alert, we create an alert payload that can then be shown in-context depending where the code is called from
    // console.log('[error]', error);
    const content = `${subject}：${error.code} ${error.msg} ${error.desc.detail ? `（${error.desc.detail}）` : ''}`;
    const alertAttrs = {
      type: 'error',
      content,
    };
    this.errorCallback(alertAttrs);
  }

  show() {
    return this.captchaInstance.showCaptcha();
  }

  reset() {
    return this.captchaInstance.reset();
  }

  getValidate() {
    return this.captchaInstance.getValidate();
  }
}
