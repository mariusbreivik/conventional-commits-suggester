# 🚦 Conventional Commits Suggester

A GitHub Action to enforce [Conventional Commits](https://www.conventionalcommits.org/) in your PRs with **helpful suggestions** for fixing commit messages that don't comply!

---

## 🎯 Goal

Ensure all commit messages in your repository follow the Conventional Commits standard, making your history clean, automatable, and release-friendly. If a message doesn't comply, this action will suggest a corrected version!

---

## ✨ Features

- ✅ Checks all commit messages in PRs or pushes
- 💡 Suggests a Conventional Commit format if a message is invalid
- 💬 Posts suggestions as PR comments or workflow summary
- ⚙️ Configurable commit types and fail/warn modes
- 🔒 Easy setup, works with all GitHub-hosted runners

---

## 🚀 Usage

Add to your workflow:

```yaml
- uses: mariusbreivik/conventional-commits-suggester@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    suggestion_mode: "summary"    # or "comment" or "both"
    fail_on_error: "true"         # set "false" to just warn
```

For local testing in this repo, use:
```yaml
- uses: ./
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🛠️ Inputs

- `github_token`: (required) Token for API access.
- `suggestion_mode`: `"summary"`, `"comment"`, or `"both"`.
- `fail_on_error`: `"true"` or `"false"`.
- `allowed_types`: Comma-separated list of allowed commit types.

---

## 📦 Example Output

If a commit message is invalid, you'll see:
```
- `abc1234`: **bad commit message**
  - Suggestion: `fix: bad commit message`
```

---

Give your commits superpowers — keep them Conventional and let the bot help you fix them! 🚀