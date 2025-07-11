"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const conventionalCommitLint_1 = require("./conventionalCommitLint");
async function run() {
    try {
        const token = core.getInput("github_token", { required: true });
        const failOnError = core.getInput("fail_on_error") === "false" ? false : true;
        const allowedTypesInput = (core.getInput("allowed_types") || "feat,fix,chore,docs,refactor,test,ci,build,perf")
            .split(",")
            .map((t) => t.trim());
        const suggestionMode = core.getInput("suggestion_mode") || "summary";
        const context = github.context;
        const octokit = github.getOctokit(token);
        // Get commits for PR or push
        let commits = [];
        if (context.eventName === "pull_request") {
            const { data } = await octokit.rest.pulls.listCommits({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: context.payload.pull_request.number,
            });
            commits = data.map((c) => ({
                sha: c.sha,
                message: c.commit.message,
                author: c.commit.author?.name ?? "unknown",
            }));
        }
        else if (context.eventName === "push") {
            commits = (context.payload.commits || []).map((c) => ({
                sha: c.id,
                message: c.message,
                author: c.author?.name ?? "unknown",
            }));
        }
        else {
            core.setFailed("This action only supports pull_request or push events.");
            return;
        }
        // Fetch parents for each commit and skip merge commits (more than one parent)
        const filteredCommits = [];
        for (const commit of commits) {
            const { data: commitData } = await octokit.rest.repos.getCommit({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: commit.sha,
            });
            if (commitData.parents && commitData.parents.length > 1) {
                core.info(`Skipping merge commit: ${commit.sha}`);
                continue;
            }
            filteredCommits.push(commit);
        }
        const errors = (0, conventionalCommitLint_1.lintCommits)(filteredCommits, allowedTypesInput);
        if (errors.length === 0) {
            core.info("All commit messages follow Conventional Commits! 🚀");
            return;
        }
        let summary = "## 🚨 Conventional Commit Lint Errors\n";
        for (const err of errors) {
            summary += `- \`${err.sha.slice(0, 7)}\`: **${err.message.split("\n")[0]}**\n  - Suggestion: \`${err.suggestion}\`\n`;
        }
        core.summary.addRaw(summary).write();
        if (suggestionMode.includes("comment") && context.eventName === "pull_request") {
            await octokit.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                body: summary,
            });
        }
        if (failOnError) {
            core.setFailed("One or more commit messages do not follow Conventional Commits.");
        }
        else {
            core.warning("One or more commit messages do not follow Conventional Commits.");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
