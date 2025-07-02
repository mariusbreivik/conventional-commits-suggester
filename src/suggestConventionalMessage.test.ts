import { suggestConventionalMessage } from "./suggestConventionalMessage";

describe("suggestConventionalMessage", () => {
  it("returns original if already conventional", () => {
    expect(
      suggestConventionalMessage("feat(parser): add parser support")
    ).toBe("feat(parser): add parser support");
  });

  it("suggests with type and scope if possible", () => {
    expect(
      suggestConventionalMessage("docs readme update usage")
    ).toBe("docs(readme): update usage");
    expect(
      suggestConventionalMessage("fix login bug")
    ).toBe("fix(login): bug");
  });

  it("falls back to type only if no scope", () => {
    expect(
      suggestConventionalMessage("update dependencies")
    ).toBe("fix(update): dependencies");
  });

  it("handles single word message", () => {
    expect(
      suggestConventionalMessage("refactor")
    ).toBe("fix: refactor");
  });
});