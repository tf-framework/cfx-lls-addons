import { NativeMethod, NativeParam, ParsedNativeMethod } from "./types.ts";
import { converNativeType } from "./convert_native_type.ts";

function fixKeywordParamName(name: string) {
  switch (name) {
    case "repeat":
      return "repeat_";
    case "end":
      return "end_";
    default:
      return name;
  }
}

function parseParam(param: NativeParam) {
  const result = converNativeType(param.type);
  const parsed = {
    name: fixKeywordParamName(param.name),
    type: result.type,
    description: param.description,
  };

  return { param: parsed, isRef: result.isRef };
}

export function parseNativeMethod(method: NativeMethod): ParsedNativeMethod {
  const results = method.params.map((param) => parseParam(param));
  const params = results.map((result) => result.param);

  const returnTypes = [
    converNativeType(method.results).type,
    ...results
      .filter((result) => result.isRef)
      .map((result) => result.param.type),
  ];

  const luaExample = method.examples.find((example) => example.lang === "lua");

  return {
    hash: method.hash,
    category: method.ns,
    apiSet: method.apiset ?? "client",
    name: method.name ?? method.hash,
    description: method.description,
    params: params,
    returnTypes: returnTypes,
    returnDescription: method.resultsDescription ?? "",
    example: luaExample?.code,
  };
}
