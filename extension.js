/*
 * Fast Translate hot-reload loader
 *
 * This file is intentionally tiny and stable. Feature/UI code lives in
 * timestamped runtime_YYYYMMDDHHMMSS.js modules. A new runtime filename gets a
 * new ES-module URL, so GNOME Shell can load updated code after disable/enable
 * without restarting the whole Wayland session.
 */

import Gio from "gi://Gio";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

const RUNTIME_RE = /^runtime_(\d{14})\.js$/;

export default class FastTranslateExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this.initTranslations(this.metadata['gettext-domain']);
        this._indicator = null;
        this._enabled = false;
        this._loadGeneration = 0;
    }

    enable() {
        this._enabled = true;
        const generation = ++this._loadGeneration;
        const runtimeName = this._findLatestRuntime();

        if (!runtimeName) {
            console.error(`[Fast Translate] No runtime_YYYYMMDDHHMMSS.js found in ${this.path}`);
            return;
        }

        // Each release uses a new runtime filename. Dynamic import therefore
        // bypasses the already-loaded module URL from an earlier release.
        import(`./${runtimeName}`)
            .then(module => {
                if (!this._enabled || generation !== this._loadGeneration)
                    return;

                if (typeof module.createIndicator !== 'function')
                    throw new Error(`${runtimeName} does not export createIndicator()`);

                if (this._indicator) {
                    this._indicator.destroy();
                    this._indicator = null;
                }

                this._indicator = module.createIndicator(this);
                console.log(`[Fast Translate] Loaded ${runtimeName}`);
            })
            .catch(error => {
                console.error(`[Fast Translate] Failed to load ${runtimeName}: ${error?.stack || error}`);
            });
    }

    disable() {
        this._enabled = false;
        ++this._loadGeneration;

        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }

    _findLatestRuntime() {
        let enumerator = null;
        let latest = null;

        try {
            enumerator = this.dir.enumerate_children(
                'standard::name,standard::type',
                Gio.FileQueryInfoFlags.NONE,
                null
            );

            let info;
            while ((info = enumerator.next_file(null)) !== null) {
                if (info.get_file_type() !== Gio.FileType.REGULAR)
                    continue;

                const name = info.get_name();
                if (!RUNTIME_RE.test(name))
                    continue;

                if (latest === null || name > latest)
                    latest = name;
            }
        } catch (error) {
            console.error(`[Fast Translate] Runtime scan failed: ${error?.stack || error}`);
        } finally {
            try {
                enumerator?.close(null);
            } catch (_) {
                // Nothing else to do during extension loading.
            }
        }

        return latest;
    }
}
