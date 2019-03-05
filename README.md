# denoversion

Deno cli to manage and bump release versions.

`denoversion` helps you keep track of your project's [SemVer](https://semver.org/) version in a `VERSION` file, including creating and pushing git tags.

## Installation

Install it as a local command via [denoget](https://github.com/syumai/deno-libs/tree/master/denoget):

```bash
$ denoget https://denopkg.com/lucascaro/denoversion.ts
```

or run it directly:

```bash
$ deno https://denopkg.com/lucascaro/denoversion.ts
```

If you do not use `denoget` to install locally, replace `denoversion` below with `deno -A https://denopkg.com/lucascaro/denoversion.ts`

## Usage

`denoversion` has different subcommands: `init`, `current`, `set`, and `bump`.

### `version`

`denoversion version` as well as without arguments, `denoversion` shows it's own version.

### `init`

Use `denoversion init` to get started versioning your repository.

```bash
$ denoversion init 1.0.0
v1.0.0
```

This will create a file named `VERSION` containing your version string. The command will also create a new commit and tag with the version string.

Optionally, you can pass `--push` to instruct the program to push changes to the configured git remote.

The command will not allow to initialize an already initialized directory, you can pass `-f` or `--force` to disable this safety check.

### `current`

Running `denoversion current` will print the current version to the console.

### `set`

Use `denoversion set` to set the version manually.

```
$ denoversion set 1.2.3
v1.2.3
```

### `bump`

Bumps the current version. It will also create a git commit and annotated tag. Run with `--push` to also push the changes to your configured remote and create a release.

By default `denoversion bump` will bump the `patch` (3rd) number in the version. You can pass another argument to specify which segment to bump:

```
$ denoversion current
v1.2.3
$ denoversion bump
v1.2.4
$ denoversion bump patch
v1.2.5
$ denoversion bump minor
v1.3.0
$ denoversion bump major
v2.0.0
```

## Feedback

If you have comments, feature requests, or have found a bug, leave an issue in the issue tracker!
