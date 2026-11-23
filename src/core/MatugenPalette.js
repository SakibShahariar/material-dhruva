/*
* Matugen palette support for Dhruva.
*
* Pure helpers only: no Gio/GLib imports so they can run in the gjs test suite.
*/

const COLOR_RE = /(--[a-z0-9_-]+)\s*:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\s*;/g;

const ROLE_MAP = {
    '--surface': 'surface',
    '--surface_container': 'surfaceContainer',
    '--surface_container_low': 'surfaceContainerLow',
    '--on_surface': 'onSurface',
    '--on_surface_variant': 'onSurfaceVariant',
    '--primary': 'primary',
    '--on_primary': 'onPrimary',
    '--primary_container': 'primaryContainer',
    '--on_primary_container': 'onPrimaryContainer',
    '--outline': 'outline',
    '--outline_variant': 'outlineVariant',
    '--error': 'error',
};

const REQUIRED_ROLES = ['surface', 'onSurface', 'primary', 'onPrimary', 'surfaceContainer'];

/** Parse `--role: #rrggbb;` declarations from a Matugen colors CSS file. */
export function parseMatugenPalette(cssText) {
    const palette = {};
    if (typeof cssText !== 'string') return palette;

    let match;
    while ((match = COLOR_RE.exec(cssText)) !== null) {
        const role = ROLE_MAP[match[1].toLowerCase()];
        if (role && !palette[role]) palette[role] = normalizeHex(match[2]);
    }
    COLOR_RE.lastIndex = 0;
    return palette;
}

function normalizeHex(hex) {
    const value = hex.slice(1);
    if (value.length === 3) {
        return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`.toUpperCase();
    }
    return `#${value.toUpperCase()}`;
}

/** A palette is usable only when the core Material 3 roles are present. */
export function hasCompletePalette(palette) {
    return !!palette && REQUIRED_ROLES.every(role => typeof palette[role] === 'string');
}
