const { run } = Deno;
export async function gitCheckCleanState() {
  const git = run({
    args: ["git", "diff", "--quiet"],
    stdout: "piped"
  });
  if (!(await git.status())) {
    throw new Error("Repository is not in a clean state. Aborting.");
  }
}

export async function gitCommitFileChanges(fileName: string, message: string) {
  const gitAdd = run({
    args: ["git", "add", fileName]
  });
  if (!(await gitAdd.status()).success) {
    throw new Error(`Error running git add.`);
  }

  const git = run({
    args: ["git", "commit", "-m", message, fileName]
  });

  const status = await git.status();
  if (!status.success) {
    throw new Error(`Error ${status.code} creating git commit.`);
  }
}

export async function gitCreateTag(name: string, msg: string) {
  const git = run({
    args: ["git", "tag", "-a", name, "-m", msg]
  });

  const status = await git.status();
  if (!status.success) {
    throw new Error(`Error ${status.code} creating git tag.`);
  }
}

export async function gitPushWithTags() {
  const git = run({
    args: ["git", "push", "--follow-tags"]
  });

  const status = await git.status();
  if (!status.success) {
    throw new Error(`Error ${status.code} pushing to remote.`);
  }
}
