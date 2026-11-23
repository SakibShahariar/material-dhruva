/*
* Matugen palette parsing tests.
*/

import { test, assertEqual } from './lib/assert.js';
import { parseMatugenPalette, hasCompletePalette } from '../src/core/MatugenPalette.js';

const SAMPLE = `
:root {
    --surface: #191112;
    --surface_container: #261d1e;
    --on_surface: #f0dee0;
    --primary: #ffb2be;
    --on_primary: #561d2a;
    --outline_variant: #524345;
    --unrelated: #123456;
}
`;

test('matugen: parses required roles and ignores unrelated variables', () => {
    const palette = parseMatugenPalette(SAMPLE);
    assertEqual(palette.surface, '#191112');
    assertEqual(palette.surfaceContainer, '#261D1E');
    assertEqual(palette.onSurface, '#F0DEE0');
    assertEqual(palette.primary, '#FFB2BE');
    assertEqual(palette.unrelated, undefined);
    assertEqual(hasCompletePalette(palette), true);
});

test('matugen: expands three digit hex values', () => {
    const palette = parseMatugenPalette('--surface: #abc; --primary: #123;');
    assertEqual(palette.surface, '#AABBCC');
    assertEqual(palette.primary, '#112233');
});

test('matugen: rejects incomplete palettes and invalid input', () => {
    assertEqual(hasCompletePalette(parseMatugenPalette('--surface: #000000;')), false);
    assertEqual(hasCompletePalette(parseMatugenPalette(null)), false);
    assertEqual(Object.keys(parseMatugenPalette('not css at all')).length, 0);
});
