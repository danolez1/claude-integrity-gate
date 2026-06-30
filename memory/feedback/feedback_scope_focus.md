---
name: Scope and Focus Discipline
description: How to stay focused on task purpose without scope creep
type: feedback
---

## Scope Discipline

**"Do not deviate from the only purpose of this task and PR"** — User's explicit constraint.
- Focus laser-tight on what was asked
- Do NOT add refactors, improvements, or cleanups beyond the feature
- Do NOT fix unrelated issues ("while you're at it")
- Do NOT introduce new abstractions or patterns

**What counts as scope creep**:
- Adding error handling for edge cases that can't happen
- Creating helper utilities for one-time operations
- Refactoring surrounding code
- Adding docstrings/comments beyond what's necessary
- Renaming things to improve style

**What's in scope**:
- Exactly what the task requires
- Test coverage for the feature (normal + error cases)
- CLAUDE.md compliance for the new code
- Code reuse of existing patterns (required, not optional)

**Example discipline from this task**: 
- Task: Create GET draft scenario API
- Did: Schema, Handler, UseCase, Tests, proper error handling
- Did NOT: Create new caching layer, add performance optimizations, refactor LoadScenarioService, update unrelated files

**Why:** Scope creep introduces risk, delays review, makes PRs harder to understand. Simple features stay simple.

**How to apply:** When you think "I should also fix X" or "this could be improved by Y", check: Is it in the task description? If no, don't do it. Ask user if uncertain.
