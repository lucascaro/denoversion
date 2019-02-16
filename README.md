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

## Usage

`denoversion` has different subcommands: `init`, `current`, `set`, and `bump`.

### `init`

Use `denoget init` to get started versioning your repository.

```bash
$ denoget init 1.0.0
v1.0.0
```
