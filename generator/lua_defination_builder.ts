import { FIVEM_DOCS_URL_PREFIX } from "./constants.ts";

export class LuaDefinationBuilder {
  private buffer: string[] = [];

  private append(...items: string[]) {
    this.buffer.push(...items.map((item) => item.trimEnd()));
    return this;
  }

  public header(category: string, apiSet: string, hash: string) {
    return this.append(
      `---**\`${category}\` \`${apiSet}\` [\`${hash}\`](${FIVEM_DOCS_URL_PREFIX}${hash})**`,
      "---",
    );
  }

  private formatMultiline(lines: string) {
    return lines
      .split("\n")
      .map((line) => "---" + line)
      .join("\n");
  }

  private formatDescriptionDocLink(description: string) {
    return description.replace(
      /\?\\_(0[xX][0-9a-fA-F]+)/g,
      (_, hash) => FIVEM_DOCS_URL_PREFIX + hash,
    );
  }

  public description(description: string) {
    if (description == "") {
      return this;
    }

    return this.append(
      this.formatMultiline(this.formatDescriptionDocLink(description)),
      "---",
    );
  }

  public example(code: string) {
    return this.append(
      "---Example code:",
      "---```lua",
      this.formatMultiline(code),
      "---```",
      "---",
    );
  }

  public param(name: string, type: string, description?: string) {
    return this.append(`---@param ${name} ${type} ${description ?? ""}`);
  }

  private formatReturnDescription(description: string) {
    return description.replace(/\r?\n/g, "<br>");
  }

  public returnType(types: string[], description?: string) {
    if (types[0] === "void") {
      return this;
    }

    const returnDescription = description
      ? `# ${this.formatReturnDescription(description)}`
      : "";

    return this.append(`---@return ${types.join(", ")} ${returnDescription}`);
  }

  private formatFunctionName(nativeNames: string) {
    return nativeNames
      .toLowerCase()
      .replace(/_([a-z])/g, (_, bit: string) => bit.toUpperCase())
      .replace(/^([a-z])/, (_, bit: string) => bit.toUpperCase())
      .replace("0x", "N_0x");
  }

  public functionDeclaration(nativeName: string, paramNames: string[]) {
    const functionName = this.formatFunctionName(nativeName);
    return this.append(
      `function ${functionName}(${paramNames.join(", ")}) end`,
    );
  }

  public build() {
    return this.buffer.join("\n");
  }
}
