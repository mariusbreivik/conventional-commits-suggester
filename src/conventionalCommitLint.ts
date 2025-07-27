import { suggestConventionalMessage, allowedScopes as defaultAllowedScopes } from "./suggestConventionalMessage";
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
  reason: string;
}

export function lintCommits(
    commits: Commit[],
    allowedTypesInput: string[],
    allowedScopes: string[] = defaultAllowedScopes, // Use the full default list!
): LintError[] {
  const errors: LintError[] = [];

  for (const commit of commits) {
    if (!commit.message || !commit.message.trim()) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: "Commit message is empty.",
      });
      continue;
    }

    const parsed = parseConventional(commit.message);

    let commitType = parsed.type;
    let breakingTypeBang = false;
    let scope = parsed.scope;

    if (!commitType && parsed.header) {
      const headerMatch = /^([a-zA-Z0-9]+)(!?)(\(([^)]+)\))?:/.exec(parsed.header);
      if (headerMatch) {
        commitType = headerMatch[1];
        breakingTypeBang = headerMatch[2] === '!';
        scope = headerMatch[4];
      }
    } else if (commitType && commitType.endsWith('!')) {
      breakingTypeBang = true;
      commitType = commitType.slice(0, -1);
    }

    if (!commitType) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: "Missing commit type.",
      });
      continue;
    }

    if (!allowedTypesInput.includes(commitType)) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: `Unknown commit type: '${commitType}' (allowed: ${allowedTypesInput.join(", ")})`,
      });
      continue;
    }

    // ---- SCOPE VALIDATION ----
    if (scope && allowedScopes.length > 0 && !allowedScopes.includes(scope)) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: `Unknown scope: '${scope}' (allowed: ${allowedScopes.join(", ")})`,
      });
      continue;
    }

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

    if (
        (!parsed.subject || !parsed.subject.trim()) &&
        !(breakingTypeBang && hasBreakingChangeNote)
    ) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: "Missing subject.",
      });
      continue;
    }

    if (parsed.subject && parsed.subject.startsWith(" ")) {
      errors.push({
        sha: commit.sha,
        message: commit.message,
        suggestion: suggestConventionalMessage(commit.message, allowedTypesInput, allowedScopes),
        reason: "Subject starts with a space.",
      });
    }
  }

  return errors;
}