# 🚦 Conventional Commits Suggester

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Conventional%20Commits%20Suggester-blue?logo=github)](https://github.com/marketplace/actions/conventional-commits-suggester)

A GitHub Action to enforce [Conventional Commits](https://www.conventionalcommits.org/) in your PRs and pushes, with **helpful suggestions** for fixing commit messages that don't comply!

---

## 🎯 Goal

Ensure all commit messages in your repository follow the Conventional Commits standard, making your history clean, automatable, and release-friendly. If a message doesn't comply, this action will suggest a correction right in your PR or workflow summary!

---

## ✨ Features

- ✅ Checks all commit messages in PRs or pushes (skips merge commits automatically)
- 💡 Suggests the correct Conventional Commit format for each invalid message
- 💬 Posts suggestions as PR comments and/or workflow summary
- ⚙️ Configurable commit types, fail/warn modes, and output options
- 🔒 Easy setup, works with all GitHub-hosted runners
- 📦 Published on [GitHub Marketplace](https://github.com/marketplace/actions/conventional-commits-suggester)
- 🛡️ Improved error handling for commit message validation (v1.0.4+)

---

## 🚀 Quick Start

Add to your workflow:

```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "summary"    # "summary", "comment", or "both"
    fail_on_error: "true"         # set "false" to just warn and not fail
    allowed_types: "feat,fix,chore,docs,refactor,test,ci,build,perf"
```

For local testing (in this repo):

```yaml
- uses: ./
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🛠️ Inputs

| Name             | Required | Default                                                 | Description                                                |
|------------------|----------|---------------------------------------------------------|------------------------------------------------------------|
| `github_token`   | Yes      | —                                                       | GitHub token for API access. Usually `${{ secrets.GITHUB_TOKEN }}` |
| `suggestion_mode`| No       | `summary`                                               | Where suggestions show: `"summary"`, `"comment"`, or `"both"` |
| `fail_on_error`  | No       | `true`                                                  | `"true"` to fail on bad commits, `"false"` to only warn    |
| `allowed_types`  | No       | `feat,fix,chore,docs,refactor,test,ci,build,perf`       | Comma-separated list of allowed commit types               |

---

## 💡 Examples

#### 1. Only show in summary and don’t fail build on error

```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "summary"
    fail_on_error: "false"
```

#### 2. Show suggestions as PR comment and summary

```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "both"
```

#### 3. Custom allowed types

```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    allowed_types: "feat,fix,style,security"
```

---

## 📦 Example Output

If a commit message is invalid, you'll see something like:

```
- `abc1234`: **bad commit message**
  - Reason: Unknown commit type 'bad'
  - Suggestion: `fix: bad commit message`
```

---

## ⚠️ Error Reasons

- **Commit message is empty.**: No message was provided.
- **Missing commit type.**: The type (e.g., `fix`, `feat`) was not found.
- **Unknown commit type:**: The type used is not allowed (see config).
- **Missing subject.**: No subject after the type/scope.
- **Subject starts with a space.**: The subject has a leading space.
- (More reasons may be added as checks expand.)
- **Errors are now reported with improved clarity and detail (v1.0.4+)**

---

## ⚠️ Notes

- **Merge commits are automatically skipped** (not checked for Conventional Commit compliance).
- Action works on both `push` and `pull_request` workflows.
- For best results, squash and merge PRs with proper commit messages.
- Recent improvements have made error reporting more robust and user-friendly.

---

## 🙌 Contributing

PRs welcome! Check the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

Give your commits superpowers — keep them Conventional and let the bot help you fix them! 🚀
