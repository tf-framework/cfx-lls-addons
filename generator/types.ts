export enum NativeType {
  CLIENT = "client",
  SERVER = "server",
}

export interface NativeParam {
  name: string;
  type: string;
  description?: string;
}

export interface NativeExample {
  lang: string;
  code: string;
}

export interface NativeMethod {
  name?: string;
  params: NativeParam[];
  results: string;
  description: string;
  examples: NativeExample[];
  hash: string;
  ns: string;
  apiset?: string;
  resultsDescription?: string;
}

export type NativeCategory = Record<string, NativeMethod>;

export type NativeCategories = Record<string, NativeCategory>;

export interface ParsedNativeMethod {
  hash: string;
  category: string;
  apiSet: string;
  name: string;
  description: string;
  params: NativeParam[];
  returnTypes: string[];
  returnDescription?: string;
  example?: string;
}
