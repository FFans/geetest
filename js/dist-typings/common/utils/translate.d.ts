/// <reference types="flarum/@types/translator-icu-rich" />
declare const _default: {
    get(key: string, parameters?: Record<string, any>): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    admin(key: string, parameters?: Record<string, any>): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    forum(key: string, parameters?: Record<string, any>): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    lib(key: string, parameters?: Record<string, any>): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
};
export default _default;
