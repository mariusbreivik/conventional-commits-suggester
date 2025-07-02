import * as core from "@actions/core";
import * as github from "@actions/github";
import { lintCommits, Commit } from "./conventionalCommitLint";

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
    let commits: Commit[] = [];
    if (context.eventName === "pull_request") {
      const { data } = await octokit.rest.pulls.listCommits({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.payload.pull_request!.number,
      });
      commits = data.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name ?? "unknown",
      }));
    } else if (context.eventName === "push") {
      commits = (context.payload.commits || []).map((c: any) => ({
        sha: c.id,
        message: c.message,
        author: c.author?.name ?? "unknown",
      }));
    } else {
      core.setFailed("This action only supports pull_request or push events.");
      return;
    }

    const errors = lintCommits(commits, allowedTypesInput);

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
        issue_number: context.payload.pull_request!.number,
        body: summary,
      });
    }

    if (failOnError) {
      core.setFailed("One or more commit messages do not follow Conventional Commits.");
    } else {
      core.warning("One or more commit messages do not follow Conventional Commits.");
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();