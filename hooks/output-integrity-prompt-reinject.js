#!/usr/bin/env node
// output-integrity-prompt-reinject — user-prompt-submit hook
//
// Re-injects the core integrity rules on EVERY user message submission.
// Survives context compression (SessionStart can be pruned, this cannot).

const compact = `
INTEGRITY GATE REMINDER (re-injected every turn):
- No claim without evidence gathered THIS turn (R1-R8,R10)
- UNKNOWN must appear for every unverified gap (R25)
- Report format only for verified content; bullets for investigation (R15)
- Scan own output for contradictions before delivering (P5)
- Pin context (env, account, date) at top of every block (P6)
- Stakeholder output needs VERIFIED/DRAFT markers (R21)
- After correction from anyone: downgrade to bullet drafts (R22)
- "I don't know" is mandatory when true (R25)
`.trim();

process.stdout.write(compact);
process.exit(0);
