# which one

Interactive CLI to list scripts from `package.json` and choose one to run.

When a project has many npm scripts, `wo` saves you from memorizing names or scrolling through `package.json`. The command name `wo` is short for **which one**.

Read this in other languages: [English](./README.md) | [简体中文](./README-zh_CN.md)

## Install

Requires Node.js `>= 6`. The current working directory must contain a `package.json` with a `scripts` field.

```shell
npm install -D @oasis-cloud/which-one
```

## Usage

| Scenario | Command | Behavior |
| --- | --- | --- |
| List all scripts | `wo` | Show the `which one` interactive menu |
| Filter then choose | `wo c` | Show only scripts whose names match `c` |
| Single match | `wo color` | Skip the menu and run `npm run color` directly |
| Re-run last script | `wo -r` | Run the last script executed in the current directory |

### Interactive selection

```shell
└─> wo
? which one › - Use arrow-keys. Return to submit.
❯   color
    demo:c
```

### Filter then choose

```shell
└─> wo c
? which one › - Use arrow-keys. Return to submit.
❯   color
    demo:c
```

### Single match auto-run

If filtering leaves exactly one script, it runs immediately without showing the menu.

```shell
└─> wo color
```

## Filtering

Positional arguments are treated as regular-expression fragments. Multiple arguments are joined with `|` (OR matching).

| Command | Regex | Matches |
| --- | --- | --- |
| `wo c` | `/c/ig` | `color`, `demo:c`, … |
| `wo 'd.*:c'` | `/d.*:c/ig` | `demo:c` |
| `wo a b` | `/(a\|b)/ig` | scripts matching `a` or `b` |
| `wo` (no args) | all script names | every script in `package.json` |

Matching is case-insensitive and uses the global (`g`) flag.

> **Note:** `-f` / `--filter` appears in `--help` examples but is **not wired up yet** in the current version. Use positional arguments for filtering. See [Roadmap](#roadmap).

## Options

| Option | Description |
| --- | --- |
| `-h`, `--help` | Show help |
| `-r`, `--run` | Re-run the last script executed in the current directory |
| Positional args | Filter script names by regular expression |

### `-r` / `--run`

After you select or run a script, its name is cached per directory. `wo -r` runs that cached script again.

- **Cache exists** → runs the cached script directly
- **No cache** → exits silently (does not show the menu)

```shell
└─> wo 'd.*:c'
? which one › - Use arrow-keys. Return to submit.
❯   demo:c

# runs demo:c

└─> wo -r
# runs demo:c again
```

## Execution and cache

- **Runner:** always uses `npm run <script>` (pnpm and yarn are not supported yet)
- **Cache file:** `~/.wo/script.json`
- **Scope:** keyed by `process.cwd()`, so different project directories do not interfere
- **Update:** cache is written each time a script is selected or executed

## Edge cases

| Situation | Current behavior |
| --- | --- |
| No scripts match the filter | Exits silently |
| Missing `package.json` | Node `require` throws an error |
| Empty or missing `scripts` | Exits silently |
| Cancel menu (Esc / Ctrl+C) | No script is executed |

## Local development

```bash
git clone https://github.com/oasis-cloud/which-one
cd which-one
pnpm install   # or npm install
node bin/which-one.js
# or npm link to use wo globally
```

## Roadmap

Possible extensions grouped by priority.

### High priority (gaps / inconsistencies)

| Direction | Current state | Suggestion |
| --- | --- | --- |
| Implement `-f` / `--filter` | Defined in yargs, not connected to `filterScripts()` | Unify with positional-argument filtering |
| `-r` when no cache | Help text says "list all scripts"; code exits silently | Align help text or fall back to the full script list |
| Error messages | Missing `package.json` or no matches exit silently | Print friendly stderr messages and non-zero exit codes |

### Medium priority (UX improvements)

| Direction | Current state | Suggestion |
| --- | --- | --- |
| Multiple package managers | Hard-coded `spawn('npm', …)` | Detect lockfile or add `--pm npm\|pnpm\|yarn` |
| Subprocess TTY | stdout/stderr piped manually | Use `stdio: 'inherit'` for watch / interactive scripts |
| Tests | `npm test` is a placeholder | Add unit tests and CI |
| CHANGELOG | Only v0.0.7 recorded | Backfill history or establish a release convention |

### Low priority (optional enhancements)

| Direction | Description |
| --- | --- |
| Fuzzy search | Substring or fzf-style matching in addition to regex |
| Script descriptions | Show comments or convention-based metadata next to script names |
| Monorepo | Select scripts from workspace sub-packages |
| TypeScript rewrite | Move from single-file CommonJS to typed, maintainable code |
| Configuration | `~/.wo/config.json` for custom cache path, default package manager, etc. |

## Links

- GitHub: https://github.com/oasis-cloud/which-one
- Issues: https://github.com/oasis-cloud/which-one/issues
- License: ISC
