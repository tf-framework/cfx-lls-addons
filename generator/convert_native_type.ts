function getType(nativeType: string): string {
  switch (nativeType) {
    case "object":
      return "table";
    case "Any":
      return "any";
    case "func":
      return "function";
    case "char":
      return "string";
    case "BOOL":
    case "bool":
      return "boolean";
    case "int":
    case "float":
    case "long":
      return "number";
    case "Vector3":
      return nativeType.toLowerCase();
    default:
      return nativeType;
  }
}

export function converNativeType(nativeType: string) {
  let isRef = nativeType.endsWith("*");
  nativeType = nativeType.replace(/\*$/, "");

  const isArray = nativeType.endsWith("[]");
  nativeType = nativeType.replace(/\[\]$/, "");

  const type = getType(nativeType) + (isArray ? "[]" : "");

  if (type == "string") {
    isRef = false;
  }

  return { type, isRef };
}
