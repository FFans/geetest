import translate from '@/common/utils/translate';

export enum EnumProductService {
  V4 = 'v4',
  V3 = 'v3',
}

export const productServiceJs = {
  [EnumProductService.V4]: 'gt4',
  [EnumProductService.V3]: 'gt.0.4.9',
};

export enum EnumProductServiceInit {
  V4 = 'initGeetest4',
  V3 = 'initGeetest',
}

export function getOptionsProductService() {
  return Object.values(EnumProductService)
    .filter((value) => value !== EnumProductService.V3)
    .reduce((prev, value) => {
      prev[value] = translate.admin(`settings.product_service_${value}_label`) as string;
      return prev;
    }, {} as Record<EnumProductService, string>);
}
