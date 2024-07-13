import CommonSettings from '@/common/utils/Settings';
import app from 'flarum/common/app';

export default {
  get(key: string, parameters?: Record<string, any>) {
    return app.translator.trans(key, parameters);
  },
  admin(key: string, parameters?: Record<string, any>) {
    return this.get(`${CommonSettings.PREFIX}.admin.${key}`, parameters);
  },
  forum(key: string, parameters?: Record<string, any>) {
    return this.get(`${CommonSettings.PREFIX}.forum.${key}`, parameters);
  },
  lib(key: string, parameters?: Record<string, any>) {
    return this.get(`${CommonSettings.PREFIX}.lib.${key}`, parameters);
  },
};
