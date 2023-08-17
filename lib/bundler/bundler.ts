import { NativeType } from "../types.ts";

export class Bundler {
  private type: NativeType;

  constructor(type: NativeType) {
    this.type = type;
  }

  public bundle() {}
}
