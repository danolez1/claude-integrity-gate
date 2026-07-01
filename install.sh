#!/bin/bash
# Claude Integrity Gate — single-command installer
# Usage: curl -fsSL <raw-url>/install.sh | bash
# Or:    ./install.sh (from cloned repo)
#
# Installs all 12 enforcement layers automatically. No manual steps.

set -euo pipefail

CLAUDE_DIR="$HOME/.claude"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SKILLS_DIR="$CLAUDE_DIR/skills/integrity-gate"
COMMANDS_DIR="$CLAUDE_DIR/commands"
SETTINGS="$CLAUDE_DIR/settings.json"
CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"

# Determine source: either from cloned repo or download from GitHub
REPO_URL="https://raw.githubusercontent.com/danolez1/claude-integrity-gate/main"

if [ -f "$(dirname "$0")/hooks/output-integrity-gate.js" ] 2>/dev/null; then
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  SOURCE="local"
else
  SCRIPT_DIR=$(mktemp -d)
  SOURCE="remote"
  echo "Downloading Claude Integrity Gate..."
  mkdir -p "$SCRIPT_DIR"/{hooks,skills/integrity-gate,commands}

  for f in output-integrity-gate.js output-integrity-stop.js output-integrity-prompt-reinject.js output-integrity-posttool.js output-integrity-subagent.js output-integrity-notification.js; do
    curl -fsSL "$REPO_URL/hooks/$f" -o "$SCRIPT_DIR/hooks/$f"
  done
  curl -fsSL "$REPO_URL/skills/integrity-gate/SKILL.md" -o "$SCRIPT_DIR/skills/integrity-gate/SKILL.md"
  curl -fsSL "$REPO_URL/commands/verify-output.md" -o "$SCRIPT_DIR/commands/verify-output.md"
  curl -fsSL "$REPO_URL/claude-md-section.md" -o "$SCRIPT_DIR/claude-md-section.md"
  curl -fsSL "$REPO_URL/settings-hooks.json" -o "$SCRIPT_DIR/settings-hooks.json"
  echo ""
fi

echo "Installing Claude Integrity Gate..."
echo ""

# 1. Install hooks
mkdir -p "$HOOKS_DIR"
cp "$SCRIPT_DIR/hooks/"*.js "$HOOKS_DIR/"
chmod +x "$HOOKS_DIR/output-integrity-"*.js
echo "[1/6] Hooks installed (6 files)"

# 2. Install skill
mkdir -p "$SKILLS_DIR"
cp "$SCRIPT_DIR/skills/integrity-gate/SKILL.md" "$SKILLS_DIR/"
echo "[2/6] Skill installed (/integrity-gate)"

# 3. Install command
mkdir -p "$COMMANDS_DIR"
cp "$SCRIPT_DIR/commands/verify-output.md" "$COMMANDS_DIR/"
echo "[3/6] Command installed (/verify-output)"

# 4. Merge hooks into settings.json
mkdir -p "$CLAUDE_DIR"
if [ ! -f "$SETTINGS" ]; then
  # No settings.json exists, create one with just hooks
  cat > "$SETTINGS" << 'SETTINGSEOF'
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-gate.js"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-stop.js"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-prompt-reinject.js"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-posttool.js"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-notification.js"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Agent",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/output-integrity-subagent.js"
          }
        ]
      }
    ]
  }
}
SETTINGSEOF
  echo "[4/6] Settings.json created with hook registrations"
else
  # settings.json exists, merge hooks using node (available on any system with Claude Code)
  node -e "
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('$SETTINGS', 'utf8'));
const newHooks = JSON.parse(fs.readFileSync('$SCRIPT_DIR/settings-hooks.json', 'utf8')).hooks;

if (!settings.hooks) settings.hooks = {};

for (const [hookType, entries] of Object.entries(newHooks)) {
  if (!settings.hooks[hookType]) {
    settings.hooks[hookType] = entries;
  } else {
    // Check if already installed (avoid duplicates)
    const existing = JSON.stringify(settings.hooks[hookType]);
    if (!existing.includes('output-integrity')) {
      settings.hooks[hookType] = [...settings.hooks[hookType], ...entries];
    }
  }
}

fs.writeFileSync('$SETTINGS', JSON.stringify(settings, null, 2) + '\n');
" 2>/dev/null && echo "[4/6] Hook registrations merged into settings.json" || {
    echo "[4/6] WARNING: Could not auto-merge settings.json."
    echo "       Manually merge settings-hooks.json into ~/.claude/settings.json"
  }
fi

# 5. Prepend integrity gate section to CLAUDE.md
if [ ! -f "$CLAUDE_MD" ]; then
  cp "$SCRIPT_DIR/claude-md-section.md" "$CLAUDE_MD"
  echo "[5/6] CLAUDE.md created with integrity gate"
elif grep -q "OUTPUT INTEGRITY GATE" "$CLAUDE_MD" 2>/dev/null; then
  echo "[5/6] CLAUDE.md already has integrity gate (skipped)"
else
  # Prepend to existing CLAUDE.md
  TEMP=$(mktemp)
  { echo "# User-level instructions"; echo ""; cat "$SCRIPT_DIR/claude-md-section.md"; echo ""; echo "---"; echo ""; cat "$CLAUDE_MD"; } > "$TEMP"
  mv "$TEMP" "$CLAUDE_MD"
  echo "[5/6] Integrity gate prepended to CLAUDE.md (Priority 0)"
fi

# 6. Install memory files to current project if in a git repo
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_ROOT=$(git rev-parse --show-toplevel)
  # Claude Code project memory path format
  PROJECT_PATH=$(echo "$GIT_ROOT" | sed 's|/|-|g' | sed 's|^-||')
  MEMORY_DIR="$CLAUDE_DIR/projects/-$PROJECT_PATH/memory"
  mkdir -p "$MEMORY_DIR"

  if [ -d "$SCRIPT_DIR/memory/feedback" ]; then
    cp "$SCRIPT_DIR/memory/feedback/feedback_output_integrity_gate.md" "$MEMORY_DIR/" 2>/dev/null || true
    cp "$SCRIPT_DIR/memory/feedback/feedback_integrity_patterns.md" "$MEMORY_DIR/" 2>/dev/null || true
  fi

  # Add to MEMORY.md index if it exists
  if [ -f "$MEMORY_DIR/MEMORY.md" ]; then
    if ! grep -q "integrity_gate" "$MEMORY_DIR/MEMORY.md" 2>/dev/null; then
      echo "- [feedback_output_integrity_gate.md](feedback_output_integrity_gate.md) — 26 verification rules + 6 patterns: no output without evidence check" >> "$MEMORY_DIR/MEMORY.md"
      echo "- [feedback_integrity_patterns.md](feedback_integrity_patterns.md) — 6 failure patterns behind the 26 rules" >> "$MEMORY_DIR/MEMORY.md"
    fi
  fi
  echo "[6/6] Memory installed for current project ($GIT_ROOT)"
else
  echo "[6/6] Not in a git repo, skipping project memory (install manually per project)"
fi

# Cleanup temp dir if remote install
if [ "$SOURCE" = "remote" ]; then
  rm -rf "$SCRIPT_DIR"
fi

echo ""
echo "=== Claude Integrity Gate installed ==="
echo ""
echo "Active on next Claude Code session start."
echo "Disable with: 'disable integrity gate' in any message."
echo ""
echo "Verify: node ~/.claude/hooks/output-integrity-gate.js | head -3"
