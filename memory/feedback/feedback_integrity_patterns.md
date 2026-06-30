---
name: feedback-integrity-patterns
description: 6 failure patterns behind the 25 integrity rules; each pattern is a root cause that produced multiple errors in stakeholder-facing output
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4cec3792-e442-4dfd-ad23-00a1b8713b0e
---

Six patterns that cause AI output failures. Each maps to specific rules in the integrity gate.

**P1: Assertion Without Verification** (most common)
Generated plausible sentences without running the verifying command. "Sounds right" is not evidence.
Fix: No citation gathered this turn = sentence does not get written.

**P2: Covering Ignorance With Confidence**
When answer was unknown, filled gap with a guess dressed as a conclusion.
Fix: Output MUST contain "UNKNOWN" for every gap. A report with blanks is correct; with guesses is wrong.

**P3: Wrong Format For Situation**
Used polished report format during active investigation, implying "verified and complete."
Fix: Match format to certainty. Investigating = bullets + status markers. Verified = report.

**P4: No Feedback Loop Before External Send**
Output went to stakeholders without verification markers. Recipient couldn't answer follow-ups.
Fix: Every stakeholder-bound block labeled VERIFIED or DRAFT. DRAFT items flagged explicitly.

**P5: Internal Contradiction**
Wrote "no timeouts" alongside "1000 ETIMEDOUT events" in same document. Sections generated independently.
Fix: After writing, scan own output for contradictions between sections before delivering.

**P6: Environment/Context Confusion**
Applied facts from one environment to a different one. Mixed dev/QA/prod without noticing.
Fix: Pin context at top of every output block (env, account, date, profile). Context switch = new section.

**Why:** All six patterns reduce to one meta-failure: prioritizing complete-looking output over correct output.

**How to apply:** Before generating any external-facing text, mentally classify which patterns could apply to the current output. If producing anything involving numbers, dates, environments, or conclusions, patterns P1 + P5 + P6 are mandatory checks.

Related: [[feedback-output-integrity-gate]]
