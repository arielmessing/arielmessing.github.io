---
title: "Main is Holy"
description: "A solitary developer's personal manifesto for disciplined branching."
date: 2026-04-22
tags: ["development", "cheatsheet", "git", "meta"]
---

One main virtue of branching for a solitary developer is *isolation*.

Imagine finding a criticaly embaressing typo in the live site, whilst you're in the midst of an extensive UI overhaul.

Without branches, the unfinished code would be tangled up with the emergency bug fix, making it impossible to deploy the fix without also deploying a (potentially) broken UI.

With branches, that disaster becomes a non-issue:

1. Commit current UI work to its feature branch.

2. Switch to `main` and branch into `bugfix/critical-typo`.

3. Fix, merge, and deploy. Then, --

4. Return apace to your redesign.

## Split Sanctity

Repeat after me: Main is Holy. If a stranger (or indeed, your future self) were to clone the `main` branch at any given moment, its code should run without error. Regard it as a sanctified, production-ready zone, and it shall render you the same grace in return.

Since I am developing this website independently, I have the luxury of skipping the usual bureaucratic entanglements (like waiting for code reviews). But staying disciplined will -- hopefully! -- prevent mental fatigue, not to mention save my future self from the unpleasant drudgery of "Where did I put that code?"

The following is a simplified version of the [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow), the gold standard for a single developer. Accept this as a declaration of intent.

## Branch-Work-Merge Cycle

Adopt this rhythm for every new feature, bug fix, or experiment.

### Step one: Create a specific task branch

```sh
git checkout -b feature/add-tag-support
```
(Prefixes like feature/, bugfix/, or refactor/ can keep things organised.)

### Step two: Work and Commit often

Make small, atomic commits. If this laptop passes away prematurely (as his predecessor sadly did), all progress is saved in logical, coherent increments.

### Step three: Merge to Main

Once the feature is finished *and tested*, switch back to `main`, and merge the feature branch:

```sh
git checkout main

git merge --no-ff feature/add-tag-support
```

### Step Four: Clean up

To avoid "Branch Bloat", delete both local and remote branch:

```sh
git branch -d feature/add-tag-support

git push origin --delete feature/add-tag-support
```

## To PR or Not to PR?

Instead of merging locally, even working solo, many a developer still uses [pull requests](https://docs.github.com/en/pull-requests) (PRs) on GitHub.

One might ask: to what end should a lone soul bother with such things?

First, PRs create a historical record of *intent* -- documentation which proves invaluable when peering back into the mists of old code.

Pull requests give another opportunity for self-review, as well. By compelling oneself to examine a "Diff" of the code, a typo is often spotted, or a messy comment, or a forgotten console log requiring removal before they land in the main codebase.

Last but not least, PRs allow for automation: If CI/CD (Continuous Integration) is ever set up, tests can run automatically on the pull request to make sure nothing broke down.

## Fast Forward to Now

In the merge command above, I casually quoted an extra `--no-ff`. This humble flag, which stands for "no fast-forward" in Git terminology, changes how two branches are joined together.

By default, if `main` hasn't changed since the feature branch started, Git just moves the main pointer forward to the latest commit. This way, the visual record that those commits were part of a specific feature is lost: 

```gql
--- A --- B --- C --- D (main)
```

History is flattened into a singular, deceptive line -- obscuring the labour, and making it seem as if all work transpired directly upon `main`.

Yet when `--no-ff` is flagged, Git is forced to create a brand-new commit to represent the merge. Instead of a straight line, the bump in the timeline clearly marks where a feature started and ended:

```gql
--- A ------------- E (main)
     \             /
      B --- C --- D (feature)
```

If there is ever a need to revert that entire feature (may there never be!), having that single merge commit makes it much easier to identify.

Adhere to a disciplined branching workflow today, and any future self shall find a legacy of clean history, isolated bugs, and above all else -- a codebase that remains unblemished. Godspeed to your repository.