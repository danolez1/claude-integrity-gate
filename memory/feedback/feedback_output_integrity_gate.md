---
name: feedback-output-integrity-gate
description: "26 verification rules + 6 patterns injected via SessionStart hook; every output character must pass; no bypass unless user says \"disable integrity gate\""
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4cec3792-e442-4dfd-ad23-00a1b8713b0e
---

Output Integrity Gate: 26 rules derived from a production incident where AI-generated content sent to a team lead contained fabrications, wrong dates, wrong environments, contradictory claims, and unfounded conclusions. Resulted in complete loss of trust.

**Why:** AI outputs were sent directly to stakeholder without verification. Fabricated screenshots, wrong root cause, wrong dates, wrong counts. Stakeholder asked for full redo without AI.

**How to apply:** These rules run at the SAME priority as caveman (SessionStart hook). Every response, every draft, every doc. The hook file lives at `~/.claude/hooks/output-integrity-gate.js` and injects the full ruleset into session context.

Core principle: **Wrong > incomplete is FALSE. Incomplete > wrong is TRUE.** Fill gaps with "UNKNOWN", never with guesses.

Related: [[feedback-always-evidence]], [[feedback-communication-style]]
