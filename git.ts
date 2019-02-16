import { run } from "deno";
export async function gitCheckCleanState() {
  const git = run({
    args: ["git", "diff", "--quiet"],
    stdout: "piped"
  });
  const status = await git.status();
  return status.success;
}

export async function gitCommitFileChanges(fileName: string, message: string) {
  const git = run({
    args: ["git", "commit", "-m", message, fileName],
    stdout: "piped"
  });

  return (await git.status()).success;
}

export async function gitCreateTag(name: string) {
  const git = run({
    args: ["git", "tag", name],
    stdout: "piped"
  });

  return (await git.status()).success;
}
