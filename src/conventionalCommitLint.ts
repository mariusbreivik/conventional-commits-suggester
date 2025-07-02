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
}

export function lintCommits(
  commits: Commit[],
  allowedTypesInput: string[],
): LintError[] {
  const errors: LintError[] = [];

  for (const commit of commits) {
    const parsed = parseConventional(commit.message);

    // Check for a valid type and format
    const isValid =
      parsed.type &&
      allowedTypesInput.includes(parsed.type) &&
      parsed.subject &&
      !parsed.subject.startsWith(" ");

    if (!isValid) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
      });
    }
  }

  return errors;
}