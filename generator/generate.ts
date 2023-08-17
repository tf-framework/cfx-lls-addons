import { Generator } from "./generator.ts";
import { NativeType } from "./types.ts";

const parseNativeType = (apiSet?: string) =>
  apiSet == "server" ? NativeType.SERVER : NativeType.CLIENT;

async function main(args: string[]) {
  const type = parseNativeType(args[0]);

  console.log(`Generating ${type} natives...`);

  const generator = new Generator(type);
  await generator.generate();
}

main(Deno.args);
