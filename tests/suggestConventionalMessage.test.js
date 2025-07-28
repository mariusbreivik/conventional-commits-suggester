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
    it("returns 'fix:' for empty or whitespace-only message", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("   ")).toBe("fix:");
    });
    it("suggests for type(scope): with no subject", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix(core): ")).toBe("fix(core): ");
    });
    it("suggests for unknown type as scope", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("improve(core): performance")).toBe("fix(improve): performance");
    });
    it("suggests for invalid scope", () => {
        const result = (0, suggestConventionalMessage_1.suggestConventionalMessage)("fix(bad!scope): bug");
        expect(result).toMatch(/not allowed/);
        expect(result).toMatch(/allowed scopes/);
    });
    it("suggests for message with only type", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix:")).toBe("fix: fix:");
    });
    it("suggests for message with subject starting with space", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix(core):  bad subject")).toBe("fix(core):  bad subject");
    });
    it("suggests for message with emoji", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix: 🐛 bug squashed")).toBe("fix: 🐛 bug squashed");
    });
    it("suggests for message with dash scope", () => {
        expect((0, suggestConventionalMessage_1.suggestConventionalMessage)("fix(-): dash scope")).toBe("fix(-): dash scope");
    });
});
