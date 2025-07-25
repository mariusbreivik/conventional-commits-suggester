const allowedTypes = [
  "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
];

// Add more project-specific scopes here if needed
const allowedScopes: string[] = [
  "core",
  "api",
  "auth",
  "cli",
  "ui",
  "db",
  "deps",
  "config",
  "build",
  "test",
  "docs",
  "ci",
  "server",
  "client",
  "router",
  "utils",
  "styles",
  "assets",
  "release",
  "docker",
  "lint",
  "env",
  "integration",
  "feature",
  "performance",
  "security",
  "improve",
  "-"
];

const stopwords = [
  "a", "an", "the", "my", "your", "our", "this", "that", "these", "those"
];

function isValidScope(scope: string, allowedScopes: string[] = []) {
  const normalized = scope.toLowerCase();
  return (
      !stopwords.includes(normalized) &&
      (/^[a-zA-Z0-9-_]+$/.test(normalized) || normalized === '-' || normalized === '_') &&
      (normalized.length > 2 || normalized === '-' || normalized === '_')
  ) || allowedScopes.includes(normalized);
}

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
    if (allowedTypesInput.includes(type) && isValidScope(scope, allowedScopes)) {
      return `${type}(${scope}): `;
    } else {
      return `fix: `;
    }
  }

  // Already conventional commit?
  const conventional = /^(\w+)(\([^)]+\))?: (.+)$/.exec(trimmed);
  if (conventional) {
    const [ , type, , subject ] = conventional; // <-- fixed here
    if (!allowedTypesInput.includes(type)) {
      // If type is not allowed, but is a valid scope, use it as scope
      if (isValidScope(type, allowedScopes)) {
        return `fix(${type}): ${subject}`;
      } else {
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
      const candidateScope = words[1].replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
      if (isValidScope(candidateScope, allowedScopes)) {
        scope = candidateScope;
        rest = words.slice(2).join(" ");
      } else {
        scope = "";
        rest = words.slice(1).join(" ");
      }
    } else {
      rest = words.slice(1).join(" ");
    }
  } else {
    if (words.length > 1) {
      const candidateScope = words[0].replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
      if (isValidScope(candidateScope, allowedScopes)) {
        scope = candidateScope;
        rest = words.slice(1).join(" ");
      } else {
        scope = "";
        rest = trimmed;
      }
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