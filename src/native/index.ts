import Module from 'node:module';

const cjsRequire = Module.createRequire(import.meta.url);
const addon = cjsRequire('bindings')('addon');

export const bytesToLongLongString = (buffer: number[]): string => {
  return addon.bytesToLongLongString(buffer.reverse());
};

export const hash64 = (key: string): string[] => {
  return addon.hash64(key);
};
