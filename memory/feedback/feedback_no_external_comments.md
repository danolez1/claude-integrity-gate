---
name: feedback_no_external_comments
description: Never post GitHub PR comments or any external actions without explicit user command
type: feedback
originSessionId: e5c33860-77ac-46fa-90a4-e4d89af6680d
---
Never post GitHub PR comments, reviews, or any external-facing actions without explicit user instruction/command.

**Why:** User was upset when a review comment was posted to PR without being asked. This is non-reversible and visible to team.

**How to apply:** Always ask "Want me to post this as a PR comment?" before using `gh pr comment` or similar. Present findings to user in conversation first. Only post externally when user explicitly says to.
