import { run } from "@ai-hero/sandcastle";

// Local-strategy loop: an agent that works through issues in a single PRD from start to finish.
// Run this with: bun .sandcastle/main.ts <PRD_ID>
// Example: bun .sandcastle/main.ts 0001

const prdId = process.argv[2];
if (!prdId) {
  console.error("Usage: bun .sandcastle/main.ts <PRD_ID>");
  console.error("Example: bun .sandcastle/main.ts 0001");
  process.exit(1);
}

await run({
  // A name for this run, shown as a prefix in log output.
  name: "worker",

  // Path to the prompt file. Shell expressions inside are evaluated inside the
  // sandbox at the start of each iteration, so the agent always sees fresh data.
  promptFile: "./.sandcastle/prompt.md",

  // Pass the PRD ID into the prompt as {{PRD_ID}}.
  promptArgs: { PRD_ID: prdId },

  // Maximum number of iterations (agent invocations) to run in a session.
  // Each iteration works on a single issue. Increase this to process more issues
  // per run, or set it to 1 for a single-shot mode.
  maxIterations: 3,

  // The Claude model to use. Sonnet balances capability and speed for most tasks.
  // Switch to claude-opus-4-6 for harder problems, or claude-haiku-4-5 for speed.
  model: "claude-sonnet-4-6",

  // Copy node_modules from the host into the worktree before the sandbox
  // starts. This avoids a full npm install from scratch on every iteration.
  // The onSandboxReady hook still runs bun install as a safety net to handle
  // platform-specific binaries and any packages added since the last copy.
  copyToSandbox: ["node_modules"],

  // Lifecycle hooks — commands that run inside the sandbox at specific points.
  hooks: {
    // onSandboxReady runs once after the sandbox is initialised and the repo is
    // synced in, before the agent starts. Use it to install dependencies or run
    // any other setup steps your project needs.
    onSandboxReady: [{ command: "bun install" }],
  },
});
