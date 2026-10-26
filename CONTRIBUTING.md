# Contributing and publishing

## Validate locally

```sh
glib-compile-schemas --strict --dry-run schemas
python3 scripts/build.py
# Optional syntax-only validation with a modern Node.js; execution uses GJS:
for file in *.js; do node --input-type=module --check < "$file" || exit 1; done
```

Test runtime behavior in a GNOME Shell session: select long and short text, trigger the floating window, scroll each pane, check light/dark modes, open the panel, and change both shortcuts and the panel visibility preference. PRIMARY selection availability varies by app. Never include API keys, dconf exports or selected private text in patches.

Only add a later timestamped runtime when publishing a runtime change. Give every newly loaded class a unique GTypeName. The loader caches modules by URL; replacing an already imported runtime in place is insufficient.

## Upload this local repository to GitHub

The local repository already has an initial commit. Create an **empty public repository** on your own GitHub account (suggested name: `fast-translate-hot-reload`). Do not initialize it with a README, license or gitignore. Then run:

```sh
git remote add origin https://github.com/YOUR_USERNAME/fast-translate-hot-reload.git
git push -u origin main
```

Replace YOUR_USERNAME with your account. Authenticate through your normal GitHub CLI/credential manager or SSH setup; never put tokens directly in a remote URL. No remote is configured by this preparation step.

Alternatively, if GitHub CLI is installed and signed in, run:

```sh
gh repo create fast-translate-hot-reload --public --source=. --remote=origin --push
```

Suggested description: `GNOME Shell selected-text translation with floating windows, independent scrolling, and hot-reloadable runtimes.`

The About page currently links to the upstream project and labels it as such. After publishing, add your fork URL to the README or metadata if desired. The inherited UUID and schema are intentionally preserved for compatibility; changing them is a separate migration.

For a GitHub Release, build locally and attach `dist/fast-translate@tazztone.github.io.shell-extension.zip` with the corresponding source commit/tag. Generated packages are ignored by Git; GitHub Actions also produces the extension ZIP as a workflow artifact.
