# Keeping this fork up to date

This fork is **Material Dhruva** (`material-dhruva@sakib.dev`), adding Matugen
palette support on top of upstream Dhruva. Our local commits live on `main`;
upstream is tracked by the `upstream` remote.

## One-command sync

```sh
./scripts/sync-upstream.sh
```

It will:
1. Refuse to run if you have uncommitted tracked changes.
2. Fetch `upstream/main` and merge it (merge, not rebase — our commits are published).
3. Run the gjs test suite.
4. Install the updated extension locally.
5. Push the result to `origin/main`.

If there is a conflict, the script aborts and tells you what to do. Conflict
hotspots are usually the GSettings schema, `SettingsManager`, `DockThemeResolver`,
`DockUI`, `AppearancePage` and `DockRenderer`. Keep both sides, then re-run
`./manage.sh test`, commit, and run the script again.

## After a successful sync

Log out and back in once. GNOME Shell caches extension modules for the whole
session, so code changes are not picked up by `disable`/`enable` alone.

## Our diverging commits

- Matugen palette sync (`dea0cdc`, `00665ef`, `d8811c5`)
- Full rebrand to `material-dhruva@sakib.dev` (settings schema kept as `org.gnome.shell.extensions.dhruva` so all preferences survive)
- Archived Material Dock goals/ideas: `docs/material-dock-ideas.md` (untracked, kept on purpose)
