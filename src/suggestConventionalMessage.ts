export const allowedTypes = [
  "feat", "fix", "chore", "docs", "refactor", "test", "ci", "build", "perf"
];

// Add more project-specific scopes here if needed
export const allowedScopes: string[] = [
  "core",
  "api",
  "auth",
  "cli",
  "ui",
  "db",
  "deps",
  "deps-dev",
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

function scopeSuggestionText(type: string, invalidScope: string, subject: string, allowedScopes: string[]): string {
  return [
    `The scope '${invalidScope}' is not allowed.`,
    `Please use one of the following allowed scopes:`,
    allowedScopes.map(scope => `- ${scope}`).join('\n'),
    ``,
    `Example: ${type}(<allowed-scope>): ${subject}`
  ].join('\n');
}


export function suggestConventionalMessage(message: string, allowedTypesInput: string[] = allowedTypes, allowedScopes: string[] = []): string {
  const trimmed = message.trim();

  // Empty or whitespace-only message
  if (!trimmed) {
    return "fix:";
  }

  // Case: type(scope): with no subject
  const typeScopeNoSubject = /^([a-zA-Z0-9]+)\(([^)]+)\):\s*$/.exec(trimmed);
  if (typeScopeNoSubject) {
    const [ , type, scope ] = typeScopeNoSubject;
    if (allowedTypesInput.includes(type) && allowedScopes.includes(scope)) {
      return `${type}(${scope}): `;
    } else if (scope && !allowedScopes.includes(scope)) {
      return scopeSuggestionText(type, scope, '', allowedScopes);
    } else {
      return `fix: `;
    }
  }

  // Already conventional commit?
  const conventional = /^([a-zA-Z0-9]+)\(([^)]+)\): (.+)$/.exec(trimmed);
  if (conventional) {
    const [ , type, scope, subject ] = conventional;
    if (!allowedTypesInput.includes(type)) {
      return `fix: ${subject}`;
    }
    if (!allowedScopes.includes(scope)) {
      return scopeSuggestionText(type, scope, subject, allowedScopes);
    }
    return trimmed;
  }

  // If message starts with a valid type and colon, do not prepend fix:
  const typeColon = /^([a-zA-Z0-9]+):\s*/.exec(trimmed);
  if (typeColon && allowedTypesInput.includes(typeColon[1])) {
    return trimmed;
  }

  // If message starts with a valid type! or type!(scope):, treat as breaking change and strip type for suggestion
  const breakingType = /^([a-zA-Z0-9]+)!\(([^)]+)\):\s*(.*)/.exec(trimmed);
  if (breakingType) {
    // breakingType[3] is the subject
    return `fix: ${breakingType[3]}`;
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

  // If first word is a valid type, use it
  if (allowedTypesInput.includes(words[0].toLowerCase())) {
    type = words[0].toLowerCase();
    rest = words.slice(1).join(" ");
  }

  // Look for a valid scope in allowedScopes (not type)
  const candidateScope = words.find(
    (word, idx) => idx !== 0 && isValidScope(word, allowedScopes)
  );
  if (candidateScope) {
    const normalizedScope = candidateScope.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
    if (allowedScopes.includes(normalizedScope)) {
      scope = normalizedScope;
      rest = words.filter(w => w !== candidateScope).join(" ");
    } else {
      // Scope is valid format but not allowed
      return scopeSuggestionText(type, normalizedScope, rest, allowedScopes);
    }
  }

  // Remove duplicate type at the start of rest
  if (rest.toLowerCase().startsWith(type.toLowerCase() + " ")) {
    rest = rest.substring(type.length).trim();
  }

  if (scope) {
    return `${type}(${scope}): ${rest}`;
  } else {
    return `${type}: ${rest}`;
  }
}