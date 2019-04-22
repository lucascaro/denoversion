import ArgParser from "./args.ts";
import { fileExists } from "./fileutils.ts";
import {
  gitCheckCleanState,
  gitCommitFileChanges,
  gitCreateTag,
  gitPushWithTags
} from "./git.ts";
import {
  BumpTarget,
  bumpVersion,
  canonicalVersionString,
  isValid,
  readVersionFileSync,
  writeVersionFileSync
} from "./semver.ts";
import { stripIndent } from "./strings.ts";
// Import local VERSION file for denoversion
import VERSION from "../VERSION.json";

// File name to use for VERSION files.
const VERSIONFILE = "VERSION.json";

export function runCommand(command: string, parser: ArgParser) {
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
      case "version":
        return printVersionInfo(parser);
      case "help":
        return printHelp();
      default:
        console.error(`Unknown command '${command}'`);
    }
  } catch (e) {
    console.error(e.message);
    Deno.exit(1);
  }
}

function printHelp() {
  console.log(stripIndent`
    denoversion ${VERSION.version}

    Usage: denoversion [-f|--force] [command] 

    Commands:
        init [version]    Initialize versioning in the current directory.
        current           Show current version.
        set [version]     Set the current version number to 'version'.
        bump [type]       Bump the current version. Type is one of major, minor, patch.
        version           Show denoversion's current version number.
        help              Show this help.
  `);
}

async function printVersionInfo(parser: ArgParser) {
  console.log(`denoversion ${VERSION.version}`);
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
  await updateVersion(parser, version);
}

function setVersion(parser: ArgParser) {
  const version = parser.getArg(1);
  if (!isValid(version)) {
    console.error("Please provide a valid version number");
    return;
  }
  const oldVersion = readVersionFileSync(VERSIONFILE);
  if (canonicalVersionString(version) == oldVersion) {
    console.error(`Version is already ${oldVersion}`);
    return;
  }
  updateVersion(parser, version);
}

function current(parser: ArgParser) {
  if (!fileExists(VERSIONFILE)) {
    console.error(
      `Cannot find version file ${VERSIONFILE} in the current directory.`
    );
    return;
  }
  const version = readVersionFileSync(VERSIONFILE);
  console.log(canonicalVersionString(version));
}

async function bump(parser: ArgParser) {
  const version = readVersionFileSync(VERSIONFILE);
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
  await updateVersion(parser, bumped);
}

async function updateVersion(parser: ArgParser, version: string) {
  const canonical = canonicalVersionString(version);
  const numeric = canonical.slice(1);
  console.log(canonical);
  writeVersionFileSync(VERSIONFILE, canonical);
  await gitCommitFileChanges(VERSIONFILE, `Set version to ${canonical}`);
  await gitCreateTag(canonical, `Version ${numeric}`);

  if (parser.getOpt("push")) {
    console.log("pushing to remote via git push --follow-tags");
    await gitPushWithTags();
  }
}
