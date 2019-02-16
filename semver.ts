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
    .map(Number);
  parts[target] += 1;
  return `v${parts.join(".")}`;
}

export function canonicalVersionString(version: string): string {
  if (!isValid(version)) {
    throw new TypeError(`Invalid version string: ${version}`);
  }
  const parts = SEMVER_RE.exec(version).slice(1);
  return `v${parts.join(".")}`;
}
