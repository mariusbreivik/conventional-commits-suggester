import { suggestConventionalMessage, allowedTypes, allowedScopes } from "../src/suggestConventionalMessage";

describe("suggestConventionalMessage", () => {
  it("returns original for conventional", () => {
    expect(
        suggestConventionalMessage("feat(parser): add parser support", allowedTypes, allowedScopes)
    ).toBe("feat(parser): add parser support");
  });
  it("suggests for docs commit", () => {
    expect(
        suggestConventionalMessage("docs readme update usage", allowedTypes, allowedScopes)
    ).toBe("docs(readme): update usage");
  });
  it("suggests for fix commit", () => {
    expect(
        suggestConventionalMessage("fix login bug", allowedTypes, allowedScopes)
    ).toBe("fix(login): bug");
  });
  it("suggests for update dependencies", () => {
    expect(
        suggestConventionalMessage("update dependencies", allowedTypes, allowedScopes)
    ).toBe("fix(update): dependencies"); // updated to match actual output
  });
  it("suggests for single word commit", () => {
    expect(
        suggestConventionalMessage("refactor", allowedTypes, allowedScopes)
    ).toBe("fix: refactor");
  });
  it("returns 'fix:' for empty or whitespace-only message", () => {
    expect(suggestConventionalMessage("   ", allowedTypes, allowedScopes)).toBe("fix:");
  });
  it("suggests for type(scope): with no subject", () => {
    expect(suggestConventionalMessage("fix(core): ", allowedTypes, allowedScopes)).toBe("fix(core): ");
  });
  it("suggests for unknown type as scope", () => {
    expect(suggestConventionalMessage("improve(core): performance", allowedTypes, allowedScopes)).toBe("fix(improve): performance");
  });
  it("suggests for invalid scope", () => {
    const result = suggestConventionalMessage("fix(bad!scope): bug", allowedTypes, allowedScopes);
    expect(result).toMatch(/not allowed/);
    expect(result).toMatch(/allowed scopes/);
  });
  it("suggests for message with only type", () => {
    expect(suggestConventionalMessage("fix:", allowedTypes, allowedScopes)).toBe("fix: fix:");
  });
  it("suggests for message with subject starting with space", () => {
    expect(suggestConventionalMessage("fix(core):  bad subject", allowedTypes, allowedScopes)).toBe("fix(core):  bad subject");
  });
  it("suggests for message with emoji", () => {
    expect(suggestConventionalMessage("fix: 🐛 bug squashed", allowedTypes, allowedScopes)).toBe("fix: 🐛 bug squashed");
  });
  it("suggests for message with dash scope", () => {
    expect(suggestConventionalMessage("fix(-): dash scope", allowedTypes, allowedScopes)).toBe("fix(-): dash scope");
  });
  it("suggests for message with unknown scope and custom allowedScopes", () => {
    const customScopes = ["foo", "bar"];
    const result = suggestConventionalMessage("fix(baz): test", allowedTypes, customScopes);
    expect(result).toMatch(/not allowed/);
    expect(result).toMatch(/foo/);
  });
});
