---
name: integrity-gate
description: Manually invoke output integrity validation on high-stakes content before sending to stakeholders
---

# Output Integrity Gate (Manual Validation)

When invoked, perform the following validation on the MOST RECENT output or draft in the conversation:

## Checklist (all 25 rules)

Run through every rule. For each, mark PASS or FAIL with evidence:

1. [ ] R1: No existence claims without proof (ls/find/grep run for every artifact mentioned?)
2. [ ] R2: Error attribution traced to actual code (grep for error string done?)
3. [ ] R3: Latency explained with timestamps (per-operation times shown?)
4. [ ] R4: Terms internally consistent (no contradictions between sections?)
5. [ ] R5: Environment-specific evidence for environment-specific claims?
6. [ ] R6: Dates sourced from timestamps (not memory)?
7. [ ] R7: Single environment per claim (account/profile/cluster stated)?
8. [ ] R8: Counts from fresh queries (query text + time range included)?
9. [ ] R9: No conclusions without confirmed root cause?
10. [ ] R10: Traced specific ID through logs before explaining pipeline?
11. [ ] R11: URLs tested and return results?
12. [ ] R12: Stakeholder messages self-defending (VERIFIED/UNVERIFIED/follow-ups)?
13. [ ] R13: Timeout/block hypothesis checked first for low throughput?
14. [ ] R14: Doc finalized only after all reviewer questions resolved?
15. [ ] R15: Format matches certainty level (bullets for investigation, report for verified)?
16. [ ] R16: Wrong explanations corrected in ALL locations?
17. [ ] R17: "No X" verified to mean literally zero events?
18. [ ] R18: Categorical claims qualified with scope?
19. [ ] R19: Dates cross-checked against multiple sources?
20. [ ] R20: Architecture claims backed by code grep?
21. [ ] R21: VERIFIED/DRAFT markers on stakeholder-bound content?
22. [ ] R22: After correction, using bullet format not polished prose?
23. [ ] R23: Per-environment SSM/config verified for each env mentioned?
24. [ ] R24: "Done" status means verified-complete, not aspirational?
25. [ ] R25: UNKNOWN appears for every gap where evidence is missing?

## Pattern Check

- [ ] P1: Any sentence without a citation?
- [ ] P2: Any gap filled with a guess instead of "UNKNOWN"?
- [ ] P3: Report format used for unverified content?
- [ ] P4: Stakeholder-bound content without VERIFIED/DRAFT markers?
- [ ] P5: Any internal contradictions?
- [ ] P6: Any context bleed between environments?

## Verdict

After running all checks, report:
- PASS: All rules satisfied, safe to send
- FAIL: List violations, propose fixes, do NOT send until fixed

This skill is invocable via `/integrity-gate` before sending any high-stakes output.
