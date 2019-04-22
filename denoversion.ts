#!/usr/bin/env deno --allow-write --allow-read --allow-run
import ArgParser from "./src/args.ts";
import { runCommand } from "./src/denoversion.ts";

const parser = new ArgParser({
  boolean: ["f"],
  alias: {
    f: ["force"]
  }
});

const command = parser.getArg(0, "help");
runCommand(command, parser);
