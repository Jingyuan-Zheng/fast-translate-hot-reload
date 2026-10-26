# Fast Translate — Hot Reload Edition

English · [中文](README.md)

A GNOME Shell translation extension derived from [tazztone/translate-assistant](https://github.com/tazztone/translate-assistant), with selected-text translation, a centered floating window, independent scrollable text panes, system-sized panel UI, and timestamped runtime loading.

This is an independently maintained community modification. Licensed under MIT; see [CREDITS.md](CREDITS.md) for attribution.

## Usage

| Action | Default shortcut | Source |
| --- | --- | --- |
| Floating translation | `Super+T` | Linux PRIMARY text selection |
| Panel translation | `Alt+T` | Regular clipboard |
| Close floating window | `Esc` | — |

Select text and press `Super+T`; copying is not required. Double-copy activation is disabled. Both shortcuts can be changed in preferences. A system dictionary symbolic icon is used for the panel indicator, which can be hidden in preferences.

Source and translated text scroll independently when they overflow. Panel text inherits the system font size. The floating window follows the desktop light/dark preference. Google Translate and DeepL are supported; Google is the default. Floating translation falls back to English when the provider detects that the source already matches the configured target language.

PRIMARY selection support depends on the application. Some Wayland applications and embedded viewers do not expose it, and PRIMARY may retain a previous selection. There is no fallback to the regular clipboard and no simulated copy keystroke.

## Build and install

Used on Zorin OS with GNOME Shell 46. The inherited metadata lists Shell 45–50; those versions have not all been tested. Runtime dependencies include GNOME Shell/GJS, libsoup 3, and GTK 4/libadwaita for preferences. Build dependencies: Python 3 and `glib-compile-schemas` (`libglib2.0-bin` on Ubuntu/Zorin).

```sh
python3 scripts/build.py
gnome-extensions install --force dist/fast-translate@tazztone.github.io.shell-extension.zip
gnome-extensions enable fast-translate@tazztone.github.io
gnome-extensions prefs fast-translate@tazztone.github.io
```

On Wayland, log out and back in after a first installation or loader replacement. If enabling says the extension is unknown, log in again before enabling.

This fork retains `fast-translate@tazztone.github.io` and the upstream settings schema. It replaces an installation using the same UUID and cannot coexist with it. Back up your previous installation first. Updates from the upstream extension listing may overwrite this build.

## Privacy and providers

Text is sent to the selected provider. Google uses the unauthenticated, unofficial endpoint at `translate.googleapis.com`; it may change or rate-limit requests. DeepL defaults to `api-free.deepl.com/v2/translate` and requires your own API key. Keys are stored in your GNOME GSettings/dconf, not a dedicated secret vault. No personal settings or credentials are included in this repository or its package. Background notifications can include source and translated text; disable them if needed.

This project is not affiliated with Google or DeepL. Avoid sharing API keys or private source text in issues, logs, and screenshots.

## Development

`extension.js` loads the newest `runtime_YYYYMMDDHHMMSS.js`. To hot-update, add a newer timestamped runtime and give its registered GObject class a unique `GTypeName`, then disable/enable the extension. Changing the loader or statically imported modules may require logging out. A failed ES module is cached by its URL, so retry using a new runtime filename.

See [CONTRIBUTING.md](CONTRIBUTING.md) for validation and publishing steps, and [CHANGELOG.md](CHANGELOG.md) for this source snapshot.
