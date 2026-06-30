---
name: feedback_task_workflow_process
description: User's enforced workflow - every stage gated with review before proceeding. No skipping steps.
type: feedback
originSessionId: e5f792d8-bea5-48a3-bc28-8d024437134e
---
User enforces a strict staged workflow for implementation tasks. Every stage has a gate. No stage skipped.

**The process:**
1. **Understand** - Read requirements (tickets, meeting notes, transcripts). Summarize understanding and actionables. Do NOT touch code.
2. **Research codebase** - Find all affected files, patterns, dependencies. Still no code changes.
3. **Design doc** - Write design doc with zero code. Architecture, scope, out-of-scope, risks, release strategy.
4. **Review design doc** - Cross-reference against codebase for bugs, omissions, wrong assumptions. Fix before proceeding.
5. **Implementation plan** - Detailed plan with file paths, line numbers, exact changes. Saved separately from design doc.
6. **Review implementation plan** - Cross-check against design doc. Verify every line number and code snippet against actual files. Fix before proceeding.
7. **Implement** - Task by task, type-check after each.
8. **CI validation** - Run `ci-local.sh all full` INLINE. Read every line of output. Tests included.
9. **Simplify** - Review changed code for reuse, quality, efficiency.
10. **Code review** - Full PR review against all requirement docs.
11. **PR review toolkit** - Specialized agents (code, errors, tests).
12. **DesignDoc for QA** - Formal team template (doc-designdoc).
13. **Review DesignDoc** - Verify against codebase and requirements.
14. **Push** - Only after ALL checks pass. First push must be perfect.
15. **Verify CI** - Monitor CI results after push.

**Why:** Each review step catches errors that would otherwise become PR back-and-forth. Documents reviewed against codebase before trusting them. Code reviewed against documents before trusting it. Slow is smooth, smooth is fast.

**How to apply:** When user gives an implementation task, follow this exact sequence. Never jump to implementation. Never skip a review gate. Never declare done without reading test output. Take extra time at each gate rather than rush to the next stage.
