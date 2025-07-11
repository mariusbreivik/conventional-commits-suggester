"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintCommits = lintCommits;
const suggestConventionalMessage_1 = require("./suggestConventionalMessage");
const conventional_commits_parser_1 = require("conventional-commits-parser");
function lintCommits(commits, allowedTypesInput) {
    const errors = [];
    for (const commit of commits) {
        // Skip parsing if message is empty or whitespace
        if (!commit.message || !commit.message.trim()) {
            errors.push({
                sha: commit.sha,
                message: commit.message,
                suggestion: (0, suggestConventionalMessage_1.suggestConventionalMessage)(commit.message, allowedTypesInput),
            });
            continue;
        }
        const parsed = (0, conventional_commits_parser_1.sync)(commit.message);
        // Check for a valid type and format
        const isValid = parsed.type &&
            allowedTypesInput.includes(parsed.type) &&
            parsed.subject &&
            !parsed.subject.startsWith(" ");
        if (!isValid) {
            errors.push({
                sha: commit.sha,
                message: commit.message,
                suggestion: (0, suggestConventionalMessage_1.suggestConventionalMessage)(commit.message, allowedTypesInput),
            });
        }
    }
    return errors;
}
