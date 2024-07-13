import app from 'flarum/common/app';
import Stream from 'flarum/common/utils/Stream';
import { EnumProductService } from '@/common/enums/EnumProductService';
import { EnumProduct } from '@/common/enums/EnumProduct';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import { omit } from 'lodash-es';

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

export const BASE_CONFIG = ['product', 'id', 'key'] as unknown as [keyof Omit<BaseConfig, 'standalone'>];
export const CONFIG = ([] as unknown as [keyof Config]).concat(BASE_CONFIG, 'productService', 'login', 'signup', 'forgot');

export default class CommonSettings {
  static PREFIX = 'ffans-geetest';
  static getAssetsPath() {
    const attributes = app.forum.data.attributes!;
    return `${attributes.assetsBaseUrl}/extensions/${this.PREFIX}`;
  }
  static getLocale() {
    return app.data.locale;
  }
  static getPath(key?: string) {
    return key ? `${this.PREFIX}.${key}` : this.PREFIX;
  }
  static get(key: string): string | boolean {
    return app.forum.attribute(this.getPath(key));
  }
  static isEnabled(contextEvent: EnumContextEvent) {
    return this.get(contextEvent) as boolean;
  }
  static isStandalone(contextEvent: EnumContextEvent) {
    return this.get(`${contextEvent}.standalone`) as boolean;
  }
  static isConfigured(contextEvent?: EnumContextEvent) {
    return this.get(`${contextEvent ? contextEvent + '.' : ''}configured`) as boolean;
  }
  static getDefaultConfig(): Omit<Config, 'key'> {
    return omit(
      CONFIG.reduce((acc, key) => {
        (acc[key] as boolean | EnumProductService | string | EnumProduct) = this.get(key);
        return acc;
      }, {} as Config),
      ['key']
    );
  }
  static getContextEventConfig(contextEvent: EnumContextEvent): Omit<BaseConfig, 'key'> & { productService: EnumProductService } {
    const { productService } = this.getDefaultConfig();
    return {
      productService,
      ...omit(
        BASE_CONFIG.reduce((acc, key) => {
          (acc[key] as string | boolean | EnumProduct) = this.get(`${contextEvent}.${key}`);
          return acc;
        }, {} as BaseConfig),
        ['key']
      ),
    };
  }
  static getConfig(contextEvent: EnumContextEvent) {
    if (!this.isEnabled(contextEvent)) {
      return false;
    } else if (this.isStandalone(contextEvent) && this.isConfigured(contextEvent)) {
      return this.getContextEventConfig(contextEvent);
    } else if (this.isConfigured()) {
      return this.getDefaultConfig();
    } else {
      return false;
    }
  }
}
