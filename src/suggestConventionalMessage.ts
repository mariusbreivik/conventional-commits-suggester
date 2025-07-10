const allowedTypes = [
  "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
];

export function suggestConventionalMessage(message: string, allowedTypesInput: string[] = allowedTypes): string {
  const trimmed = message.trim();

  // Empty or whitespace-only message
  if (!trimmed) {
    return "fix:";
  }

  // Case: type(scope): with no subject
  const typeScopeNoSubject = /^(\w+)\(([^)]+)\):\s*$/.exec(trimmed);
  if (typeScopeNoSubject) {
    const [ , type, scope ] = typeScopeNoSubject;
    if (allowedTypesInput.includes(type)) {
      return `${type}(${scope}): `;
    } else {
      return `fix(${scope}): `;
    }
  }

  // Already conventional commit?
  const conventional = /^(\w+)(\([^)]+\))?: (.+)$/.exec(trimmed);
  if (conventional) {
    const [ , type, scopeWithParens, subject ] = conventional;
    if (!allowedTypesInput.includes(type)) {
      if (scopeWithParens) {
        // e.g. improve(core): performance => fix(improve): performance
        return `fix(${type}): ${subject}`;
      } else {
        // e.g. improve: performance => fix: performance
        return `fix: ${subject}`;
      }
    }
    return trimmed;
  }

  // If single word, return 'fix: <word>'
  if (!/\s/.test(trimmed)) {
    return `fix: ${trimmed}`;
  }

  // Try to extract type and scope from message
  const words = trimmed.split(/\s+/);

  let type = "fix";
  let scope = "";
  let rest = trimmed;

  if (allowedTypesInput.includes(words[0].toLowerCase())) {
    type = words[0].toLowerCase();
    if (words.length > 2) {
      scope = words[1]
          .replace(/[^a-zA-Z0-9-_]/g, "")
          .toLowerCase();
      rest = words.slice(2).join(" ");
    } else {
      rest = words.slice(1).join(" ");
    }
  } else {
    // Always use 'fix' as type, and first word as scope
    if (words.length > 1) {
      type = "fix";
      scope = words[0]
          .replace(/[^a-zA-Z0-9-_]/g, "")
          .toLowerCase();
      rest = words.slice(1).join(" ");
    } else {
      type = "fix";
      rest = trimmed;
    }
  }

  if (scope && scope.length < 20 && scope !== type) {
    return `${type}(${scope}): ${rest}`;
  } else {
    return `${type}: ${rest}`;
  }
}