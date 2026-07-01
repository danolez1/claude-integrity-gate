# Claude Integrity Gate

Output verification system for Claude Code. Prevents AI-generated fabrications, wrong assertions, contradictory claims, and unfounded conclusions from reaching anyone.

Born from a production incident where AI outputs sent directly to a team lead contained fabricated claims, wrong root causes, incorrect environments, and contradictions that destroyed trust and created hours of wasted work.

## What This Is

26 verification rules + 6 failure patterns, enforced across 12 layers in Claude Code so that no output is generated without passing integrity checks. Universal across all projects and repos.

## The Problem

AI assistants:
- State facts without verifying them ("screenshots exist" when they don't)
- Fill knowledge gaps with guesses dressed as conclusions
- Use report format for unverified content, implying "final and verified"
- Contradict themselves within the same document
- Confuse environments, dates, and contexts
- Never say "I don't know"

## Repo Structure

```
hooks/                          # Claude Code hook scripts (6 files)
  output-integrity-gate.js        SessionStart: injects full 26 rules
  output-integrity-stop.js        Stop: post-output violation scan
  output-integrity-prompt-reinject.js  UserPromptSubmit: per-turn reinject
  output-integrity-posttool.js    PostToolUse: validates written docs
  output-integrity-subagent.js    PreToolUse(Agent): subagent evidence gate
  output-integrity-notification.js  Notification: compression survival

global-claude-md/CLAUDE.md      # Full global CLAUDE.md with integrity gate + supporting rules
claude-md-section.md            # Just the integrity gate section (for appending to existing CLAUDE.md)

skills/integrity-gate/SKILL.md  # Manual validation skill (/integrity-gate)
commands/verify-output.md       # Slash command (/verify-output)

memory/feedback/                # Universal behavioral feedback memories (12 files)
settings-hooks.json             # Hook registration block for settings.json

install.sh                      # Installation script
```

## Installation

### npx (one command, no clone)

```bash
npx claude-integrity-gate
```

### curl (no dependencies)

```bash
curl -fsSL https://raw.githubusercontent.com/danolez1/claude-integrity-gate/main/install.sh | bash
```

### Clone

```bash
git clone https://github.com/danolez1/claude-integrity-gate.git
cd claude-integrity-gate && ./install.sh
```

### Manual Install

1. Copy `hooks/*.js` to `~/.claude/hooks/` and `chmod +x` them
2. Add hook registrations from `settings-hooks.json` to `~/.claude/settings.json`
3. Add `claude-md-section.md` content to the TOP of `~/.claude/CLAUDE.md`
4. Copy `skills/integrity-gate/` to `~/.claude/skills/`
5. Copy `commands/verify-output.md` to `~/.claude/commands/`
6. Copy memory files from `memory/feedback/` to your project memory directories

### Using the Full CLAUDE.md

If starting fresh, copy `global-claude-md/CLAUDE.md` directly as `~/.claude/CLAUDE.md`. It includes the integrity gate plus supporting rules for evidence, git safety, writing quality, and implementation process.

## 12 Enforcement Layers

| # | Layer | When | Purpose |
|---|-------|------|---------|
| 1 | SessionStart hook | Session opens | Full 26 rules injected into context |
| 2 | Stop hook | After every response | Post-output violation scanning |
| 3 | UserPromptSubmit hook | Every user message | Re-injects rules (survives compression) |
| 4 | PostToolUse hook | After Edit/Write on .md | Validates doc content |
| 5 | PreToolUse (Agent) hook | Before subagent spawn | Ensures subagent evidence requirements |
| 6 | Notification hook | Context compression | Re-injects rules post-compression |
| 7 | Global CLAUDE.md | Every session | Priority 0 instruction section |
| 8 | Skill | Manual `/integrity-gate` | Full checklist for high-stakes output |
| 9 | Command | `/verify-output` | Triggers validation before send |
| 10 | Memory (primary project) | Recalled when relevant | Persists rules + patterns across conversations |
| 11 | Memory (all projects) | Recalled in any project | Same rules everywhere |
| 12 | Settings.json | Hook registration | All hook types registered |

## The 26 Rules

1. No existence claims without proof
2. Trace errors to actual source
3. No latency attribution without timestamps
4. Terms internally consistent
5. Environment-specific claims need environment-specific evidence
6. Dates from timestamps only
7. One environment per claim
8. Counts are always fresh queries
9. Investigation before conclusion
10. Trace before explaining
11. URLs must return results
12. Stakeholder messages must be self-defending
13. Timeout/block hypothesis first
14. Docs written LAST
15. Format matches certainty level
16. Wrong explanations corrected everywhere
17. "No X" means NO X
18. Qualify categorical claims
19. Verify dates against multiple sources
20. Architecture claims require code evidence
21. Mark verification status on all output
22. After correction, downgrade format
23. Per-environment verification mandatory
24. Status reflects reality
25. "I don't know" is mandatory when true
26. Always fetch remote before git assertions

## The 6 Patterns

| Pattern | Root Cause | Rules |
|---------|-----------|-------|
| P1: Assertion Without Verification | "Plausible" treated as "true" | R1-8, R10, R13, R20, R23, R26 |
| P2: Covering Ignorance With Confidence | Gaps filled with guesses | R3, R9, R12, R13, R15, R22, R25 |
| P3: Wrong Format For Situation | Report format for unverified content | R9, R14, R15, R22, R24 |
| P4: No Feedback Loop | No VERIFIED/DRAFT markers | R11, R12, R21, R22 |
| P5: Internal Contradiction | Sections contradict each other | R4, R17, R18, R20 |
| P6: Environment/Context Confusion | Facts bleed across contexts | R5, R6, R7, R11, R19, R23 |

## Core Principle

**Wrong > incomplete is FALSE. Incomplete > wrong is TRUE.**

A report with blanks labeled UNKNOWN is correct. A report with guesses is wrong.

## Disabling

Say "disable integrity gate" in any message to turn off for that session.

## License

MIT
