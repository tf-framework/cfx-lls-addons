import { CFX_NATIVES_URL, FIVEM_NATIVES_URL } from "./constants.ts";
import { LuaDefinationBuilder } from "./lua_defination_builder.ts";
import { parseNativeMethod } from "./parse_native_method.ts";
import { sortBy } from "https://deno.land/std@0.198.0/collections/sort_by.ts";
import { NativeCategories, NativeType, ParsedNativeMethod } from "./types.ts";
import { emptyDir } from "https://deno.land/std@0.198.0/fs/empty_dir.ts";

export class Generator {
  private type: NativeType;
  private readonly parsedCategories = new Map<string, ParsedNativeMethod[]>();

  constructor(type: NativeType) {
    this.type = type;
  }

  private async fetchNativeMethods(url: string) {
    console.log(`Fetching native methods from ${url}...`);
    const res = await fetch(url);
    return (await res.json()) as NativeCategories;
  }

  private fixCfxReturnDescriptionManually(categories: NativeCategories) {
    const N_0xFC30DDFF = categories.CFX["0xFC30DDFF"];
    N_0xFC30DDFF.resultsDescription =
      "Returns the population type ID. Details can be found at FiveM documentation.";
    categories.CFX["0xFC30DDFF"] = N_0xFC30DDFF;
  }

  private sortMethods(methods: ParsedNativeMethod[]) {
    return sortBy(methods, (mt) => mt.name);
  }

  private async parseCfxNativeMethods() {
    const cfxNatives = await this.fetchNativeMethods(CFX_NATIVES_URL);

    this.fixCfxReturnDescriptionManually(cfxNatives);

    console.log("Parsing CFX natives methods...");
    const cfxCategory = Object.values(cfxNatives.CFX)
      .filter((mt) => mt.apiset == this.type || mt.apiset == "shared")
      .map((mt) => parseNativeMethod(mt));

    this.parsedCategories.set("CFX", this.sortMethods(cfxCategory));
  }

  private async parseFivemNativeMethods() {
    const fivemNatives = await this.fetchNativeMethods(FIVEM_NATIVES_URL);

    console.log("Parsing FiveM natives methods...");
    Object.entries(fivemNatives).forEach(([category, methods]) => {
      const parsedMethods = Object.values(methods).map((mt) =>
        parseNativeMethod(mt)
      );
      this.parsedCategories.set(category, this.sortMethods(parsedMethods));
    });
  }

  private async parseNatives() {
    await this.parseCfxNativeMethods();
    if (this.type == NativeType.CLIENT) {
      await this.parseFivemNativeMethods();
    }

    console.log("Parse completed!");
  }

  private buildMethodDefination(mt: ParsedNativeMethod) {
    const builder = new LuaDefinationBuilder()
      .header(mt.category, mt.apiSet, mt.hash)
      .description(mt.description);

    if (mt.example) {
      builder.example(mt.example);
    }

    mt.params.forEach((param) => {
      builder.param(param.name, param.type, param.description);
    });

    return builder
      .returnType(mt.returnTypes, mt.returnDescription)
      .functionDeclaration(
        mt.name,
        mt.params.map((param) => param.name),
      )
      .build();
  }

  private async generateCategoryDefinationFile(
    category: string,
    methods: ParsedNativeMethod[],
  ) {
    const lines = "---@meta\n" +
      methods.map((mt) => this.buildMethodDefination(mt)).join("\n\n");

    const definationFile =
      `./addon/library/natives/${this.type}/${category}.lua`;
    console.log(`Generating ${definationFile}...`);
    await Deno.writeTextFile(definationFile, lines);
  }

  public async generate() {
    emptyDir(`./addon/library/natives/${this.type}`);

    await this.parseNatives();

    this.parsedCategories.forEach((methods, category) => {
      this.generateCategoryDefinationFile(category, methods);
    });

    console.log("Generation completed!");
  }
}
