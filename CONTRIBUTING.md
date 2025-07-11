# Contributing to Conventional Commits Suggester

Thank you for your interest in contributing to **Conventional Commits Suggester**! 🎉  
We welcome all contributions—whether you’re fixing bugs, adding features, improving documentation, or suggesting ideas.

---

## 🚦 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📝 How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of this page and clone your fork locally:

```sh
git clone https://github.com/YOUR_USERNAME/conventional-commits-suggester.git
cd conventional-commits-suggester
```

### 2. Set Up Locally

Install dependencies:

```sh
npm install
```

Build the project:

```sh
npm run build
```

### 3. Create a Branch

Use a descriptive name:

```sh
git checkout -b fix/your-bug-description
# or
git checkout -b feat/your-feature-description
```

### 4. Make Your Changes

- Ensure your code follows our style and linting rules (`npm run lint`).
- Add or update tests as necessary (`npm test`).

### 5. Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.  
Examples:
- `fix: correct typo in README`
- `feat: add support for custom commit types`
- `docs: update usage examples`

### 6. Push and Open a Pull Request

Push your branch:

```sh
git push origin <your-branch-name>
```

Open a Pull Request from your branch to `main` on GitHub.  
Fill in the PR template and describe your changes clearly.

---

## 💡 Tips for a Great Contribution

- **Small, focused PRs** are easier to review.
- Link related issues (e.g., "Closes #12").
- For significant changes, open an issue or discussion first to get feedback.

---

## 🛠️ Development Scripts

- `npm run build` – Build the action.
- `npm run lint` – Lint code.
- `npm test` – Run tests.
- `npm run format` – Format code with Prettier.

---

## 🧪 Running Locally

You can test your action changes locally using [act](https://github.com/nektos/act) or by pushing to a test branch and running the workflow on GitHub Actions.

---

## 🙏 Thanks

Your time and effort make this project better!  
If you have any questions, open an issue or start a discussion.

---