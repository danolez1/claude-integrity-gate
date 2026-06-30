#!/usr/bin/env node
// output-integrity-subagent — PreToolUse hook for Agent tool
//
// Injects integrity gate rules into every subagent prompt automatically.
// Ensures subagents cannot produce unverified content that enters main context.

const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  const toolName = data.tool_name || '';
  if (toolName !== 'Agent' && toolName !== 'Task') {
    process.exit(0);
  }

  // Emit reminder that gets shown to the user (and thus to the model deciding)
  const msg = [
    'INTEGRITY GATE — SUBAGENT DISPATCH:',
    'Subagent output will enter main context. Ensure the prompt instructs the subagent to:',
    '  - Cite evidence (file:line, command output) for every factual claim',
    '  - Mark unverified items as UNKNOWN/UNVERIFIED',
    '  - Not fill gaps with guesses',
    '  - Not use report format for unverified content',
    'Verify subagent results before including in stakeholder-facing output.',
  ].join('\n');

  process.stdout.write(msg);
  process.exit(0);
});
