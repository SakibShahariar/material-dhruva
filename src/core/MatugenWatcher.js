/*
* Watches the Matugen colors file and notifies the extension when it changes.
*/

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { Settings } from './SettingsManager.js';

const REAPPLY_DELAY_MS = 250;

function resolvePath(path) {
    if (!path) return null;
    if (path.startsWith('~/')) return GLib.build_filenamev([GLib.get_home_dir(), path.slice(2)]);
    return path;
}

export class MatugenWatcher {
    constructor(onChanged) {
        this._onChanged = onChanged;
        this._monitor = null;
        this._changedId = 0;
        this._timerId = 0;
        this._path = null;
    }

    start() {
        this.stop();
        if (!Settings.matugenEnabled) return;
        const path = resolvePath(Settings.matugenColorsPath);
        if (!path) return;

        this._path = path;
        try {
            this._monitor = Gio.File.new_for_path(path).monitor_file(Gio.FileMonitorFlags.NONE, null);
            this._changedId = this._monitor.connect('changed', () => this._scheduleReapply());
        } catch (_e) {
            this._monitor = null;
        }
    }

    _scheduleReapply() {
        if (this._timerId) GLib.source_remove(this._timerId);
        this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, REAPPLY_DELAY_MS, () => {
            this._timerId = 0;
            this._onChanged?.();
            return GLib.SOURCE_REMOVE;
        });
    }

    stop() {
        if (this._timerId) {
            GLib.source_remove(this._timerId);
            this._timerId = 0;
        }
        if (this._monitor && this._changedId) {
            try { this._monitor.disconnect(this._changedId); } catch (_e) {}
        }
        if (this._monitor) {
            try { this._monitor.cancel(); } catch (_e) {}
        }
        this._monitor = null;
        this._changedId = 0;
        this._path = null;
    }
}
