---
name: No Co-Authored-By in commits
description: Never add Co-Authored-By Claude lines to git commits — user has explicitly warned about this multiple times
type: feedback
---

Never add `Co-Authored-By: Claude ...` or any similar co-author attribution line to git commit messages.

**Why:** User has explicitly asked not to do this and has warned about it before. This is a firm preference.

**How to apply:** When creating any git commit, omit the Co-Authored-By trailer entirely. Just write the commit message content.
