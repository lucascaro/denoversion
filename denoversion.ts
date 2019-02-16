#!/usr/bin/env deno --allow-write --allow-read --allow-run

import ArgParser from "args.ts";
import { fileExists, readStringSync, writeStringSync } from "fileutils.ts";
import {
  gitCheckCleanState,
  gitCommitFileChanges,
  gitCreateTag,
  gitPushWithTags
} from "git.ts";
import {
  BumpTarget,
  bumpVersion,
  canonicalVersionString,
  isValid
} from "semver.ts";

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
  try {
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
  } catch (e) {
    console.error(e.message);
  }
}

async function init(parser: ArgParser) {
  const version = parser.getArg(1);
  if (!parser.getOpt("force") && fileExists(VERSIONFILE)) {
    console.error("Version file already exists!");
    return;
  }
  if (!isValid(version)) {
    console.error("Please provide a valid version number");
    return;
  }
  if (!parser.getOpt("force")) {
    await gitCheckCleanState();
  }
  await updateVersion(version);
}

function setVersion(parser: ArgParser) {
  const version = parser.getArg(1);
  if (!isValid(version)) {
    console.error("Please provide a valid version number");
    return;
  }
  const canon = canonicalVersionString(version);
  writeStringSync(VERSIONFILE, canon);
  console.log(canon);
}

function current(parser: ArgParser) {
  if (!fileExists(VERSIONFILE)) {
    console.error("Cannot find version file");
    return;
  }
  const version = readStringSync(VERSIONFILE);
  console.log(canonicalVersionString(version));
}

async function bump(parser: ArgParser) {
  const version = readStringSync(VERSIONFILE);
  if (!parser.getOpt("force")) {
    await gitCheckCleanState();
  }

  const target = parser.getArg(1, "patch");
  if (!BumpTarget[target]) {
    console.error(
      `Invalid target: ${target}. Must be one of major, minor, patch`
    );
  }

  const bumped = bumpVersion(version, BumpTarget[target]);
  await updateVersion(bumped);
}

async function updateVersion(version: string) {
  const canonical = canonicalVersionString(version);
  const numeric = canonical.slice(1);
  console.log(canonical);
  writeStringSync(VERSIONFILE, canonical);
  await gitCommitFileChanges(VERSIONFILE, `Bump version to ${canonical}`);
  await gitCreateTag(canonical, `Version ${numeric}`);

  if (parser.getOpt("push")) {
    console.log("pushing to remote via git push --follow-tags");
    await gitPushWithTags();
  }
}
