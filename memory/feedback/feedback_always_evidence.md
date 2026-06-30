---
name: feedback_always_evidence
description: User does not trust unverified claims; every claim must be backed by concrete evidence gathered in the current turn
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 01365dbe-65b4-4463-9d15-07d9ccbc8e7c
---

Daniel does not trust unverified statements ("I do not trust any word you say"). Every factual claim must come with concrete evidence shown in the same response: `file:line` citations, command output, fresh query results, log lines, DB rows.

**Why:** Multiple earlier claims turned out wrong or unchecked (e.g. "deleteRichMenuAlias not in dispatch path" was false; "QA test mode = no LINE send" stated before re-verifying the live SSM value; rate-limit re-enqueue asserted before checking the producer-side `lineRetryCount`). Trust was lost.

**How to apply:** Before stating any factual claim (test result, code behavior, config/SSM value, deploy/PR state), run the verifying command or read the code IN THIS TURN and show the evidence. Re-fetch live values (SSM, DB, ECS, PR) instead of reusing earlier output. Explicitly label each claim as verified-by-me (with evidence), someone-else's-word (attribute it), or unverified/assumed. If auth/access is missing to verify, say so and get it rather than guessing. Reinforces [[feedback_ci_local_tests]] and the verification-before-completion skill.
