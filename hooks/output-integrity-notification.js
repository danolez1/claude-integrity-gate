#!/usr/bin/env node
// output-integrity-notification — Notification hook
//
// Fires on system notifications (like context compression).
// Re-injects core rules to survive context window shrinkage.

const compact = `
INTEGRITY GATE RE-INJECTION (post-compression):
All 26 output integrity rules remain ACTIVE. Context compression does not disable them.
Key reminders:
- No claim without evidence gathered THIS turn
- UNKNOWN for every unverified gap
- Bullets for investigation, report only for verified
- Scan for contradictions before delivering
- VERIFIED/DRAFT markers on all stakeholder output
Full rules: ~/.claude/hooks/output-integrity-gate.js
`;

process.stdout.write(compact.trim());
process.exit(0);
