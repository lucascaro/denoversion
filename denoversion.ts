#!/usr/bin/env deno --allow-write --allow-read --allow-run

import ArgParser from "args.ts";
import { fileExists, readStringSync, writeStringSync } from "fileutils.ts";
import { gitCheckCleanState, gitCommitFileChanges, gitCreateTag } from "git.ts";
import { BumpTarget, bumpVersion, canonical, isValid } from "semver.ts";

const VERSIONFILE = "VERSION";

const parser = new ArgParser({
  boolean: ["f"],
  alias: {
    f: ["force"]
  }
});

const command = parser.getArg(0, "current");
runCommand(command, parser);

function runCommand(command: string, parser: ArgParser) {
  switch (command) {
    case "init":
      return init(parser);
    case "current":
      return current(parser);
    case "set":
      return setVersion(parser);
    case "bump":
      return bump(parser);

    default:
      console.error(`Unknown command ${command}`);
  }
}

function init(parser: ArgParser) {
  const version = parser.getArg(1);
  if (!parser.getOpt("force") && fileExists(VERSIONFILE)) {
    console.error("Version file already exists!");
    return;
  }
  if (!isValid(version)) {
    console.error("Please provide a valid version number");
    return;
  }
  const canon = canonical(version);
  writeStringSync(VERSIONFILE, canon);
  console.log(canon);
}

function setVersion(parser: ArgParser) {
  const version = parser.getArg(1);
  if (!isValid(version)) {
    console.error("Please provide a valid version number");
    return;
  }
  const canon = canonical(version);
  writeStringSync(VERSIONFILE, canon);
  console.log(canon);
}

function current(parser: ArgParser) {
  if (!fileExists(VERSIONFILE)) {
    console.error("Cannot find version file");
    return;
  }
  const version = readStringSync(VERSIONFILE);
  console.log(canonical(version));
}

async function bump(parser: ArgParser) {
  const version = readStringSync(VERSIONFILE);
  if (!parser.getOpt("force") && !(await gitCheckCleanState())) {
    console.error("Repository is not in a clean state. Aborting.");
    return;
  }

  const target = parser.getArg(1, "patch");
  if (!BumpTarget[target]) {
    console.error(
      `Invalid target: ${target}. Must be one of major, minor, patch`
    );
  }

  const bumped = bumpVersion(version, BumpTarget[target]);
  console.log(bumped);
  writeStringSync(VERSIONFILE, bumped);
  if (!(await gitCommitFileChanges(VERSIONFILE, `Bump version to ${bumped}`))) {
    console.error(`Error creating git commit.`);
  }
  if (!(await gitCreateTag(bumped))) {
    console.error(`Error creating git tag.`);
  }
}
