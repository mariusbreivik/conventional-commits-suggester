"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conventionalCommitLint_1 = require("../src/conventionalCommitLint");
describe("lintCommits", () => {
    const allowedTypes = [
        "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
    ];
    it("returns no errors if all commits are conventional", () => {
        const commits = [
            { sha: "a1", message: "feat(core): add new API", author: "alice" },
            { sha: "b2", message: "fix(ui): button alignment", author: "bob" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });
    it("returns errors and suggestions for non-conventional commits", () => {
        const commits = [
            { sha: "c3", message: "updated dependencies", author: "eve" },
            { sha: "d4", message: "fix login bug", author: "mallory" },
            { sha: "e5", message: "bad commit message", author: "mallory" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(3);
        expect(errors[0]).toMatchObject({
            sha: "c3",
            message: "updated dependencies",
            suggestion: "fix: updated dependencies"
        });
        expect(errors[1]).toMatchObject({
            sha: "d4",
            message: "fix login bug",
            suggestion: "fix: login bug"
        });
        expect(errors[2]).toMatchObject({
            sha: "e5",
            message: "bad commit message",
            suggestion: "fix: bad commit message"
        });
    });
    it("handles empty commit list", () => {
        const errors = (0, conventionalCommitLint_1.lintCommits)([], allowedTypes);
        expect(errors).toHaveLength(0);
    });
    it("flags single word commit", () => {
        const commits = [
            { sha: "e5", message: "refactor", author: "oscar" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: refactor");
    });
    it("flags commit with bad type", () => {
        const commits = [
            { sha: "f6", message: "improve(core): performance", author: "pat" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: performance");
    });
    it("accepts allowedTypes override", () => {
        const commits = [
            { sha: "g7", message: "improve(core): performance", author: "pat" }
        ];
        // Now allow "improve"
        const newAllowedTypes = [...allowedTypes, "improve"];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, newAllowedTypes);
        expect(errors).toHaveLength(0);
    });
    it("flags commit missing subject", () => {
        const commits = [
            { sha: "h8", message: "fix(core): ", author: "sam" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(core): ");
    });
    it("handles commit with leading/trailing whitespace", () => {
        const commits = [
            { sha: "i9", message: "   fix login bug   ", author: "alex" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: login bug");
    });
    it("flags commit with only type", () => {
        const commits = [
            { sha: "j0", message: "fix:", author: "max" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: fix:");
    });
    it("flags commit with invalid format but valid type", () => {
        const commits = [
            { sha: "k1", message: "fix - login issue!", author: "jean" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(-): login issue!");
    });
    it("handles emoji in commit message", () => {
        const commits = [
            { sha: "l2", message: "fix: 🐛 bug squashed", author: "felix" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        // Should be valid conventional, so no errors
        expect(errors).toHaveLength(0);
    });
    it("flags commit with empty message", () => {
        const commits = [
            { sha: "m3", message: "   ", author: "nina" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        // The suggestion for empty message should be "fix:"
        expect(errors[0].suggestion).toBe("fix:");
    });
    it("does not flag conventional commit with extra linebreaks", () => {
        const commits = [
            { sha: "n4", message: "feat(core): add new API\n\nSome extra details", author: "alice" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });
    it("flags commit with subject starting with space", () => {
        const commits = [
            { sha: "o5", message: "fix(core):  bad subject", author: "bob" }
        ];
        const errors = (0, conventionalCommitLint_1.lintCommits)(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(core):  bad subject");
    });
});
