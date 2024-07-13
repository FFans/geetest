import translate from '@/common/utils/translate';

export enum EnumProduct {
  FLOAT = 'float',
  POPUP = 'popup',
  BIND = 'bind',
}
export function getOptionsProduct() {
  return Object.values(EnumProduct).reduce((prev, value) => {
    prev[value] = translate.admin(`settings.config.product_${value}_label`) as string;
    return prev;
  }, {} as Record<EnumProduct, string>);
}
