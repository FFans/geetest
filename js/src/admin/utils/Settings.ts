import app from 'flarum/admin/app';
import CommonSettings, { BASE_CONFIG, BaseConfig, CONFIG, Config } from '@/common/utils/Settings';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';

export function getSetting(key?: string, type?: 'boolean'): any {
  if (!type) {
    return app.data.settings[CommonSettings.getPath(key)];
  }
  return app.data.settings[CommonSettings.getPath(key)] === '1';
}

export function getContextEventSettings(contextEvent: EnumContextEvent) {
  return {
    standalone: getSetting(`${contextEvent}.standalone`) ?? '',
    product: getSetting(`${contextEvent}.product`) || '',
    id: getSetting(`${contextEvent}.id`) || '',
    key: getSetting(`${contextEvent}.key`) || '',
  };
}

export default class AdminSettings extends CommonSettings {
  static get(key: string, type?: 'boolean'): string | boolean {
    const value = app.data.settings[this.getPath(key)] as string;
    return type ? value === '1' : value;
  }
  static getDefaultConfig() {
    return CONFIG.reduce((acc, key) => {
      acc[key] = this.get(key);
      return acc;
    }, {} as Record<keyof Config, any>);
  }
  static getContextEventConfig(contextEvent: EnumContextEvent) {
    const { productService } = this.getDefaultConfig();
    return {
      productService,
      ...BASE_CONFIG.reduce((acc, key) => {
        acc[key] = this.get(`${contextEvent}.${key}`);
        return acc;
      }, {} as Record<keyof BaseConfig, any>),
    };
  }
}
