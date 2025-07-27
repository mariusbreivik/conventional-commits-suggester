# 🚦 Conventional Commits Suggester

**Automate your GitHub repository’s commit hygiene!**  
Conventional Commits Suggester is a GitHub Action that instantly checks every commit in your PRs and pushes, giving smart, actionable suggestions for fixing non-compliant messages—no more messy commit history!

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Conventional%20Commits%20Suggester-blue?logo=github)](https://github.com/marketplace/actions/conventional-commits-suggester)
[![Stars](https://img.shields.io/github/stars/mariusbreivik/conventional-commits-suggester?style=social)](https://github.com/mariusbreivik/conventional-commits-suggester/stargazers)

---

## 🎯 Why Conventional Commits Suggester?

- **Polish your repo’s commit history:** Encourage a clean, standardized, and automatable commit log.
- **Effortless onboarding:** New contributors get instant, helpful feedback—no docs required.
- **Release-ready:** Semantic commit messages unlock automated changelogs and versioning.
- **Boost project credibility:** Show potential contributors and users a professional, well-maintained codebase!

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

Add this action to your workflow in seconds:

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

## 💡 Usage Examples

**Only show in summary and don’t fail build on error:**
```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "summary"
    fail_on_error: "false"
```

**Show suggestions as PR comment and summary:**
```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "both"
```

**Custom allowed types:**
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

## ⚡ Allowed Commit Types & Scopes

**Allowed Commit Types:**  
By default, these commit types are supported:
- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `test`
- `ci`
- `build`
- `perf`

**Allowed Scopes:**  
Commit scopes help specify which part of the codebase a commit affects.  
The following scopes are recognized by default:
- `core`
- `api`
- `auth`
- `cli`
- `ui`
- `db`
- `deps`
- `config`
- `build`
- `test`
- `docs`
- `ci`
- `server`
- `client`
- `router`
- `utils`
- `styles`
- `assets`
- `release`
- `docker`
- `lint`
- `env`
- `integration`
- `feature`
- `performance`
- `security`
- `improve`
- `-`

Symbolic scopes such as `-` are now supported.

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

PRs are always welcome! Check the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

Give your commits superpowers — keep them Conventional and let this action help you fix them! 🚀  
**If you love this project, please star it and share with your friends and colleagues!**