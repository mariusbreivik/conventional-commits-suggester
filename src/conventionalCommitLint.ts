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

    // --- Robust type and breaking detection ---
    let commitType = parsed.type;
    let breakingTypeBang = false;

    // If type is missing but header exists, try to manually parse for type and bang
    if (!commitType && parsed.header) {
      // Match "type!:" or "type(scope)!:" or "type(scope):"
      const headerMatch = /^([a-zA-Z0-9]+)(!?)(\([^)]+\))?:/.exec(parsed.header);
      if (headerMatch) {
        commitType = headerMatch[1];
        breakingTypeBang = headerMatch[2] === '!';
      }
    } else if (commitType && commitType.endsWith('!')) {
      breakingTypeBang = true;
      commitType = commitType.slice(0, -1);
    }

    if (!commitType) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Missing commit type.",
      });
      continue;
    }

    if (!allowedTypesInput.includes(commitType)) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: `Unknown commit type: '${commitType}' (allowed: ${allowedTypesInput.join(", ")})`,
      });
      continue;
    }

    // --- Breaking change detection: check for ! in type and missing BREAKING CHANGE footer ---
    const hasBreakingChangeNote = Array.isArray(parsed.notes) && parsed.notes.some(
        note =>
            note.title &&
            /^BREAKING[\s-]CHANGE$/i.test(note.title.trim())
    );

    if (breakingTypeBang && !hasBreakingChangeNote) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: commit.message + "\n\nBREAKING CHANGE: <describe breaking change>",
        reason: "Commit marks a breaking change (with '!'), but is missing a BREAKING CHANGE footer with an explanation.",
      });
      continue;
    }

    // Optionally, also warn if BREAKING CHANGE footer is present but empty
    let hasEmptyBreakingNote = false;
    if (Array.isArray(parsed.notes)) {
      hasEmptyBreakingNote = parsed.notes.some(
          note =>
              note.title &&
              /^BREAKING[\s-]CHANGE$/i.test(note.title.trim()) &&
              (!note.text || !note.text.trim())
      );
    }
    if (hasEmptyBreakingNote) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: commit.message + "\n\nBREAKING CHANGE: <describe breaking change>",
        reason: "Commit marks a breaking change, but the BREAKING CHANGE footer is missing an explanation.",
      });
      continue;
    }

    // Now check for missing subject ONLY IF NOT a valid breaking change commit
    // (If this is a breaking change with ! and a valid footer, do not require a subject)
    if (
        (!parsed.subject || !parsed.subject.trim()) &&
        !(breakingTypeBang && hasBreakingChangeNote)
    ) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Missing subject.",
      });
      continue;
    }

    if (parsed.subject && parsed.subject.startsWith(" ")) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput),
        reason: "Subject starts with a space.",
      });
    }

    // If valid, do nothing
  }

  return errors;
}