import { readDirSync, readFileSync, writeFileSync } from "deno";

export function fileExists(filename: string): boolean {
  return readDirSync(".").filter((f) => f.name === "VERSION").length > 0;
}

export function writeStringSync(filename: string, data: string) {
  const encoder = new TextEncoder();
  writeFileSync(filename, encoder.encode(data));
}

export function readStringSync(filename: string) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(readFileSync(filename));
}
