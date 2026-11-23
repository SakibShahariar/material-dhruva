#!/usr/bin/env bash
# Sync this fork with upstream Dhruva, test, install and publish.
set -euo pipefail

cd "$(dirname "$0")/.."

UPSTREAM=${UPSTREAM_REMOTE:-upstream}
BRANCH=${UPSTREAM_BRANCH:-main}

if ! git remote get-url "$UPSTREAM" >/dev/null 2>&1; then
    echo "No '$UPSTREAM' remote. Add it with:"
    echo "  git remote add $UPSTREAM https://github.com/NarkAgni/dhruva.git"
    exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "You have uncommitted tracked changes. Commit or stash them first."
    exit 1
fi

echo "==> Fetching $UPSTREAM..."
git fetch "$UPSTREAM"

local_head=$(git rev-parse HEAD)
upstream_head=$(git rev-parse "$UPSTREAM/$BRANCH")
merge_base=$(git merge-base HEAD "$UPSTREAM/$BRANCH")

if [ "$local_head" = "$upstream_head" ]; then
    echo "Already up to date with $UPSTREAM/$BRANCH."
    exit 0
fi

if [ "$merge_base" = "$local_head" ]; then
    echo "Fork is ahead of $UPSTREAM/$BRANCH; nothing to merge."
    exit 0
fi

echo "==> Merging $UPSTREAM/$BRANCH..."
if ! git merge --no-edit "$UPSTREAM/$BRANCH"; then
    echo
    echo "Merge conflict. Resolve the files, then:"
    echo "  ./manage.sh test && git commit -a && ./scripts/sync-upstream.sh"
    exit 1
fi

echo "==> Running tests..."
./manage.sh test

echo "==> Installing updated extension..."
./manage.sh install

echo "==> Pushing to origin..."
git push origin HEAD

echo
echo "Done. Log out and back in once to load the updated Shell extension code."
