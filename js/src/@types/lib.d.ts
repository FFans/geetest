declare module 'external-load' {
  export function js(url: string): Promise<unknown>;
}
