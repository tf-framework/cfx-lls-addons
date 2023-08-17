import { Generator, NativeType } from "./generator/index.ts";

const parseNativeType = (apiSet?: string) =>
  apiSet == "server" ? NativeType.SERVER : NativeType.CLIENT;

async function main(args: string[]) {
  const type = parseNativeType(args[0]);

  const generator = new Generator(type);
  await generator.generate();
}

main(Deno.args);
