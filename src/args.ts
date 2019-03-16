import { ArgParsingOptions, parse } from "https://deno.land/x/flags/mod.ts";

export default class ArgParser {
  public parsed = null;
  public positional: string[] = [];
  constructor(public parseOpts: ArgParsingOptions) {
    this.parsed = new Map(Object.entries(parse(Deno.args.slice(1), parseOpts)));
    this.positional = this.parsed.get("_").map(String);
  }

  public getOpt<T>(name: string, defVal?: T): T {
    return this.parsed.has(name) ? this.parsed.get(name) : defVal;
  }

  public getArg<T>(position: number, defVal?: string): string {
    if (position < 0) {
      throw new TypeError("Argument number must be positive.");
    }
    if (position < this.positional.length) {
      return this.positional[position];
    }
    return defVal;
  }
}
