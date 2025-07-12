"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suggestConventionalMessage_1 = require("../src/suggestConventionalMessage");
describe("suggestConventionalMessage", () => {
    it("returns original if already conventional", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("feat(parser): add parser support")).toBe("feat(parser): add parser support");
    });
    it("suggests with type and scope if possible", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("docs readme update usage")).toBe("docs(readme): update usage");
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix login bug")).toBe("fix(login): bug");
    });
    it("falls back to type only if no scope", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("update dependencies")).toBe("fix(update): dependencies");
    });
    it("handles single word message", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("refactor")).toBe("fix: refactor");
    });
});
