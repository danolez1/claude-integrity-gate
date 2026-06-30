---
name: feedback_no_commit_without_asking
description: "Never git commit or push without an explicit go-ahead; task phrasing like \"wire into the PR\" is NOT authorization"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 95963613-e940-4e71-ac49-34e28f369a89
---

NEVER `git commit` or `git push` without an explicit, separate go-ahead. Each commit and each push needs its own. Task phrasing that describes WHAT to change — "wire X into the PR", "add X to the PR", "update the PR", "put it in the branch", "make the change", "implement X" — means edit the working tree and STOP. It does NOT mean commit or push. Only a git-aimed verb ("commit", "push") authorizes that exact action, once. `push` is a separate gate from `commit`.

**Why:** User got angry twice when I committed/pushed after he only asked me to make/verify changes. He reviews diffs before any commit, and a prior approval never carries forward. He reinforced this globally after I read "wire the dev stage into the PR" as commit+push permission and pushed without asking.

**How to apply:** Make changes, show the diff, wait. If unsure whether wording authorizes a commit, it does not — ask. Strengthened in global ~/.claude/CLAUDE.md "Git Actions — No Premature Commits". Related: [[feedback_no_external_actions]], [[feedback_deploy_no_commit]], [[feedback_pr_first_push_perfect]].
