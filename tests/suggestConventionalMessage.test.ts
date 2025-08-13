import { suggestConventionalMessage, allowedTypes, allowedScopes } from "../src/suggestConventionalMessage";

describe("suggestConventionalMessage", () => {
  it("returns original for conventional", () => {
    expect(
        suggestConventionalMessage("feat(core): add parser support", allowedTypes, allowedScopes)
    ).toBe("feat(core): add parser support");
  });
  it("suggests for docs commit", () => {
    expect(
        suggestConventionalMessage("docs readme update usage", allowedTypes, allowedScopes)
    ).toBe("docs: readme update usage");
  });
  it("suggests for fix commit", () => {
    expect(
        suggestConventionalMessage("fix login bug", allowedTypes, allowedScopes)
    ).toBe("fix: login bug");
  });
  it("suggests for update dependencies", () => {
    expect(
        suggestConventionalMessage("update dependencies", allowedTypes, allowedScopes)
    ).toBe("fix: update dependencies");
  });
  it("suggests for single word commit", () => {
    expect(
        suggestConventionalMessage("refactor", allowedTypes, allowedScopes)
    ).toBe("fix: refactor");
  });
});