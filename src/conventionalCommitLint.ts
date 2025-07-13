import { suggestConventionalMessage } from "./suggestConventionalMessage";
import { sync as parseConventional } from "conventional-commits-parser";

export interface Commit {
  sha: string;
  message: string;
  author: string;
}

export interface LintError {
  sha: string;
  message: string;
  suggestion: string;
  reason: string; // New field for detailed error reason
}

export function lintCommits(
    commits: Commit[],
    allowedTypesInput: string[],
): LintError[] {
  const errors: LintError[] = [];

  for (const commit of commits) {
    if (!commit.message || !commit.message.trim()) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Commit message is empty.",
      });
      continue;
    }

    const parsed = parseConventional(commit.message);

    if (!parsed.type) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Missing commit type.",
      });
      continue;
    }

    if (!allowedTypesInput.includes(parsed.type)) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: `Unknown commit type: '${parsed.type}' (allowed: ${allowedTypesInput.join(", ")})`,
      });
      continue;
    }

    if (!parsed.subject) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Missing subject.",
      });
      continue;
    }

    if (parsed.subject.startsWith(" ")) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Subject starts with a space.",
      });
    }

    // Add more specific error checks here as needed

    // If valid, do nothing
  }

  return errors;
}