import { readStringSync, writeStringSync } from "./fileutils.ts";

const SEMVER_RE = /^v?(\d+)\.(\d+)\.(\d+)$/;

export function isValid(str: string) {
  return SEMVER_RE.test(str);
}

export enum BumpTarget {
  "major",
  "minor",
  "patch"
}

export function bumpVersion(version: string, target: BumpTarget): string {
  if (!isValid(version)) {
    throw new TypeError(`Invalid version string: ${version}`);
  }
  const parts = SEMVER_RE.exec(version)
    .slice(1)
    .map(Number)
    .map((v, i) => (i === target ? v + 1 : i > target ? 0 : v));

  return `v${parts.join(".")}`;
}

export function canonicalVersionString(version: string): string {
  if (!isValid(version)) {
    throw new TypeError(`Invalid version string: ${version}`);
  }
  const parts = SEMVER_RE.exec(version).slice(1);
  return `v${parts.join(".")}`;
}

export function readVersionFileSync(filename: string): string {
  const contents = readStringSync(filename);
  if (isValid(contents)) return contents;
  // TODO: error handling
  const version = JSON.parse(contents);
  return version.version;
}

export function writeVersionFileSync(filename: string, version: string) {
  const json = JSON.stringify(
    { version: canonicalVersionString(version) },
    null,
    "  "
  );
  writeStringSync(filename, json);
}
