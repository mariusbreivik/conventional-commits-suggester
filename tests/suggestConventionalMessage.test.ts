import { suggestConventionalMessage, allowedTypes, allowedScopes } from "../src/suggestConventionalMessage";

function expectedScopeSuggestion(type: string, invalidScope: string, subject: string) {
  return [
    `The scope '${invalidScope}' is not allowed.`,
    `Please use one of the following allowed scopes:`,
    allowedScopes.map(scope => `- ${scope}`).join('\n'),
    ``,
    `Example: ${type}(<allowed-scope>): ${subject}`
  ].join('\n');
}

describe("suggestConventionalMessage", () => {
  it("returns original for conventional", () => {
    expect(
        suggestConventionalMessage("feat(core): add parser support", allowedTypes, allowedScopes)
    ).toBe("feat(core): add parser support");
  });
  it("suggests for docs commit", () => {
    expect(
        suggestConventionalMessage("docs readme update usage", allowedTypes, allowedScopes)
    ).toBe(expectedScopeSuggestion("docs", "readme", "readme update usage"));
  });
  it("suggests for fix commit", () => {
    expect(
        suggestConventionalMessage("fix login bug", allowedTypes, allowedScopes)
    ).toBe(expectedScopeSuggestion("fix", "login", "login bug"));
  });
  it("suggests for update dependencies", () => {
    expect(
        suggestConventionalMessage("update dependencies", allowedTypes, allowedScopes)
    ).toBe(expectedScopeSuggestion("fix", "dependencies", "update dependencies"));
  });
  it("suggests for single word commit", () => {
    expect(
        suggestConventionalMessage("refactor", allowedTypes, allowedScopes)
    ).toBe("fix: refactor");
  });

  // Additional edge cases
  it("handles empty message", () => {
    expect(suggestConventionalMessage("", allowedTypes, allowedScopes)).toBe("fix:");
  });
  it("handles whitespace-only message", () => {
    expect(suggestConventionalMessage("   ", allowedTypes, allowedScopes)).toBe("fix:");
  });
  it("handles type(scope): with no subject and valid scope", () => {
    expect(suggestConventionalMessage("fix(core): ", allowedTypes, allowedScopes)).toBe("fix(core): ");
  });
  it("handles type(scope): with no subject and invalid scope", () => {
    expect(suggestConventionalMessage("fix(foo): ", allowedTypes, allowedScopes)).toBe(expectedScopeSuggestion("fix", "foo", ""));
  });
  it("handles already conventional with invalid type", () => {
    expect(suggestConventionalMessage("bad(core): something", allowedTypes, allowedScopes)).toBe("fix: something");
  });
  it("handles already conventional with invalid scope", () => {
    expect(suggestConventionalMessage("fix(foo): something", allowedTypes, allowedScopes)).toBe(expectedScopeSuggestion("fix", "foo", "something"));
  });
  it("handles punctuation in message", () => {
    expect(suggestConventionalMessage("fix: bug, crash!", allowedTypes, allowedScopes)).toBe("fix: bug, crash!");
  });
  it("handles emoji in message", () => {
    expect(suggestConventionalMessage("fix: 🐛 bug squashed", allowedTypes, allowedScopes)).toBe("fix: 🐛 bug squashed");
  });
  it("handles multi-space between words", () => {
    expect(suggestConventionalMessage("fix    login    bug", allowedTypes, allowedScopes)).toBe(expectedScopeSuggestion("fix", "login", "login bug"));
  });
  it("handles type only", () => {
    expect(suggestConventionalMessage("fix:", allowedTypes, allowedScopes)).toBe("fix:");
  });
  it("handles type(scope): subject with valid scope", () => {
    expect(suggestConventionalMessage("fix(core): something broken", allowedTypes, allowedScopes)).toBe("fix(core): something broken");
  });
  it("handles type(scope): subject with invalid scope", () => {
    expect(suggestConventionalMessage("fix(foo): something broken", allowedTypes, allowedScopes)).toBe(expectedScopeSuggestion("fix", "foo", "something broken"));
  });
  it("handles type with ! for breaking change", () => {
    expect(suggestConventionalMessage("fix!(core): breaking change", allowedTypes, allowedScopes)).toBe("fix: breaking change");
  });
  it("handles commit with only scope in allowedScopes", () => {
    expect(suggestConventionalMessage("core", allowedTypes, allowedScopes)).toBe("fix: core");
  });
  it("handles commit with only scope not in allowedScopes", () => {
    expect(suggestConventionalMessage("foo", allowedTypes, allowedScopes)).toBe("fix: foo");
  });
  it("handles commit with allowed scope in middle", () => {
    expect(suggestConventionalMessage("something core broken", allowedTypes, allowedScopes)).toBe("fix(core): something broken");
  });
  it("handles commit with allowed scope at end", () => {
    expect(suggestConventionalMessage("something broken core", allowedTypes, allowedScopes)).toBe(expectedScopeSuggestion("fix", "broken", "something broken core"));
  });
});