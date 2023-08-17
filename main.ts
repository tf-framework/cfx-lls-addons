import { Bundler, Generator, NativeType } from "./lib/index.ts";

const parseNativeType = (apiSet?: string) =>
  apiSet == "server" ? NativeType.SERVER : NativeType.CLIENT;

async function main(args: string[]) {
  const type = parseNativeType(args[0]);

  const generator = new Generator(type);
  await generator.generate();

  const bundler = new Bundler(type);
  bundler.bundle();
}

main(Deno.args);
