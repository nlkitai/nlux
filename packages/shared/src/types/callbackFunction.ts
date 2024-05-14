export type CallbackArgType = object | string | number | boolean | symbol | null | undefined | void;
export type CallbackFunction = (...args: CallbackArgType[]) => CallbackArgType;
