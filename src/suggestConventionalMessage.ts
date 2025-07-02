const allowedTypes = [
  "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
];

export function suggestConventionalMessage(message: string, allowedTypesInput: string[] = allowedTypes): string {
  const trimmed = message.trim();

  // Already conventional commit?
  const conventional = /^(\w+)(\(\w+\))?: .+/.test(trimmed);
  if (conventional) return trimmed;

  // If single word, return 'fix: <word>'
  if (!/\s/.test(trimmed)) {
    return `fix: ${trimmed}`;
  }

  // Already valid
  if (/^[a-z]+(\([^)]+\))?:\s.+/.test(trimmed)) {
    return trimmed;
  }

  // Try to extract type and scope from message
  const words = trimmed.split(/\s+/);

  // Detect type
  let type = "fix";
  let scope = "";
  let rest = trimmed;

  if (allowedTypesInput.includes(words[0].toLowerCase())) {
    type = words[0].toLowerCase();
    if (words.length > 2) {
      // Use the second word as scope if it looks like a code area or file
      scope = words[1]
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();
      rest = words.slice(2).join(" ");
    } else {
      rest = words.slice(1).join(" ");
    }
  } else {
    // Try to guess a scope from the first or second word if it's a file/folder/tech term
    if (words.length > 1) {
      scope = words[0]
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();
      rest = words.slice(1).join(" ");
    } else {
      rest = trimmed;
    }
  }

  if (scope && scope.length < 20 && scope !== type) {
    return `${type}(${scope}): ${rest}`;
  } else {
    return `${type}: ${rest}`;
  }
}