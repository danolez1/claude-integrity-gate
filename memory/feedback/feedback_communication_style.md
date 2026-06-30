---
name: Communication Style Preferences
description: How to communicate effectively with this user
type: feedback
---

## Communication Preferences

**Be direct and brief**: No filler, no restating what was done, no unnecessary transitions.
- Lead with the answer/action
- Skip preamble like "Let me read the file" → just read it and say what you found
- Don't summarize actions already taken

**Text-only when explicitly requested**: User instruction takes absolute precedence over everything.
- If user says "Respond with TEXT ONLY. Do NOT call any tools", follow it exactly
- This overrides skill workflows, system defaults, anything
- Example: "CRITICAL: Respond with TEXT ONLY. Do NOT call any tools." = no tool invocation

**"What next?" means ask for direction**: Don't assume the next step.
- User asking "what next?" = they want you to present options or clarify the path forward
- Wait for user guidance rather than proceeding autonomously

**Japanese task descriptions = use Japanese in responses**: Match the language of the task/requirement.
- Task in Japanese → PR description in Japanese, commit messages in Japanese
- This shows alignment with the team's working language

**Validate before declaring done**: Don't stop at code changes.
- Always verify against docs (design docs, CLAUDE.md)
- Answer "does this fulfill its purpose?" with evidence
- Point out pre-existing issues (type errors in other files) separately from PR changes

**Why:** This user is a senior engineer who values efficiency and clarity. Unnecessary verbosity wastes their time.

**How to apply:** Keep responses short, direct, actionable. Ask for direction when uncertain. Follow explicit instructions exactly (user > skills > defaults).
