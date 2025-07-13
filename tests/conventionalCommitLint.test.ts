import { lintCommits, Commit } from "../src/conventionalCommitLint";

describe("lintCommits", () => {
    const allowedTypes = [
        "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
    ];

    it("returns no errors if all commits are conventional", () => {
        const commits: Commit[] = [
            { sha: "a1", message: "feat(core): add new API", author: "alice" },
            { sha: "b2", message: "fix(ui): button alignment", author: "bob" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("returns errors and suggestions for non-conventional commits", () => {
        const commits: Commit[] = [
            { sha: "c3", message: "updated dependencies", author: "eve" },
            { sha: "d4", message: "fix login bug", author: "mallory" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(2);
        expect(errors[0]).toMatchObject({
            sha: "c3",
            message: "updated dependencies",
            suggestion: "fix(updated): dependencies",
            reason: "Missing commit type.",
        });
        expect(errors[1]).toMatchObject({
            sha: "d4",
            message: "fix login bug",
            suggestion: "fix(login): bug",
            reason: "Missing commit type.",
        });
    });

    it("handles empty commit list", () => {
        const errors = lintCommits([], allowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("flags single word commit", () => {
        const commits: Commit[] = [
            { sha: "e5", message: "refactor", author: "oscar" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: refactor");
        expect(errors[0].reason).toMatch(/Missing commit type/);
    });

    it("flags commit with bad type", () => {
        const commits: Commit[] = [
            { sha: "f6", message: "improve(core): performance", author: "pat" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(improve): performance");
        expect(errors[0].reason).toMatch(/Unknown commit type: 'improve'/);
    });

    it("accepts allowedTypes override", () => {
        const commits: Commit[] = [
            { sha: "g7", message: "improve(core): performance", author: "pat" }
        ];
        // Now allow "improve"
        const newAllowedTypes = [...allowedTypes, "improve"];
        const errors = lintCommits(commits, newAllowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("flags commit missing subject", () => {
        const commits: Commit[] = [
            { sha: "h8", message: "fix(core): ", author: "sam" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(core): ");
        expect(errors[0].reason).toMatch(/Missing subject/);
    });

    it("handles commit with leading/trailing whitespace", () => {
        const commits: Commit[] = [
            { sha: "i9", message: "   fix login bug   ", author: "alex" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(login): bug");
        expect(errors[0].reason).toMatch(/Missing commit type/);
    });

    it("flags commit with only type", () => {
        const commits: Commit[] = [
            { sha: "j0", message: "fix:", author: "max" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix: fix:");
        expect(errors[0].reason).toMatch(/Missing subject/); // FIXED LINE: was /Missing commit type./
    });

    it("flags commit with invalid format but valid type", () => {
        const commits: Commit[] = [
            { sha: "k1", message: "fix - login issue!", author: "jean" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(-): login issue!");
        expect(errors[0].reason).toMatch(/Missing commit type/);
    });

    it("handles emoji in commit message", () => {
        const commits: Commit[] = [
            { sha: "l2", message: "fix: 🐛 bug squashed", author: "felix" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        // Should be valid conventional, so no errors
        expect(errors).toHaveLength(0);
    });

    it("flags commit with empty message", () => {
        const commits: Commit[] = [
            { sha: "m3", message: "   ", author: "nina" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        // The suggestion for empty message should be "fix:"
        expect(errors[0].suggestion).toBe("fix:");
        expect(errors[0].reason).toMatch(/empty/);
    });

    it("does not flag conventional commit with extra linebreaks", () => {
        const commits: Commit[] = [
            { sha: "n4", message: "feat(core): add new API\n\nSome extra details", author: "alice" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("flags commit with subject starting with space", () => {
        const commits: Commit[] = [
            { sha: "o5", message: "fix(core):  bad subject", author: "bob" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].suggestion).toBe("fix(core):  bad subject");
        expect(errors[0].reason).toMatch(/Subject starts with a space/);
    });

    it("handles commit with special chars in scope", () => {
        const commits: Commit[] = [
            { sha: "p6", message: "fix(utils-1): bug fixed", author: "kate" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });

    // Breaking change tests
    it("flags breaking change with ! in type and missing footer", () => {
        const commits: Commit[] = [
            { sha: "b1", message: "feat!: drop support for Node 12", author: "alice" }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].reason).toMatch(/missing a BREAKING CHANGE footer/);
    });

    it("does not flag when both ! and BREAKING CHANGE footer are present", () => {
        const commits: Commit[] = [
            {
                sha: "b2",
                message: `feat!: drop support for Node 12

BREAKING CHANGE: Node 12 is no longer supported.`,
                author: "alice"
            }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("does not flag when only BREAKING CHANGE footer is present", () => {
        const commits: Commit[] = [
            {
                sha: "b3",
                message: `fix(core): bug fix

BREAKING CHANGE: This API is now removed.`,
                author: "bob"
            }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(0);
    });

    it("flags breaking change with empty BREAKING CHANGE footer", () => {
        const commits: Commit[] = [
            {
                sha: "b4",
                message: `feat!: breaking change header

BREAKING CHANGE:   `,
                author: "alice"
            }
        ];
        const errors = lintCommits(commits, allowedTypes);
        expect(errors).toHaveLength(1);
        expect(errors[0].reason).toMatch(/missing an explanation/);
    });
});