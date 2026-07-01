#!/usr/bin/env node
// claude-integrity-gate installer
// Usage: npx claude-integrity-gate

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HOME = process.env.HOME || process.env.USERPROFILE;
const CLAUDE_DIR = path.join(HOME, '.claude');
const HOOKS_DIR = path.join(CLAUDE_DIR, 'hooks');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills', 'integrity-gate');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands');
const SETTINGS_PATH = path.join(CLAUDE_DIR, 'settings.json');
const CLAUDE_MD_PATH = path.join(CLAUDE_DIR, 'CLAUDE.md');

// Package root (where hooks/, skills/, etc. live)
const PKG_ROOT = path.resolve(__dirname, '..');

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

function log(step, total, msg) {
  console.log(`[${step}/${total}] ${msg}`);
}

console.log('');
console.log('Installing Claude Integrity Gate...');
console.log('');

const TOTAL = 6;

// 1. Install hooks
mkdirp(HOOKS_DIR);
const hooksDir = path.join(PKG_ROOT, 'hooks');
const hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.js'));
for (const file of hookFiles) {
  copyFile(path.join(hooksDir, file), path.join(HOOKS_DIR, file));
  fs.chmodSync(path.join(HOOKS_DIR, file), 0o755);
}
log(1, TOTAL, `Hooks installed (${hookFiles.length} files)`);

// 2. Install skill
mkdirp(SKILLS_DIR);
copyFile(
  path.join(PKG_ROOT, 'skills', 'integrity-gate', 'SKILL.md'),
  path.join(SKILLS_DIR, 'SKILL.md')
);
log(2, TOTAL, 'Skill installed (/integrity-gate)');

// 3. Install command
mkdirp(COMMANDS_DIR);
copyFile(
  path.join(PKG_ROOT, 'commands', 'verify-output.md'),
  path.join(COMMANDS_DIR, 'verify-output.md')
);
log(3, TOTAL, 'Command installed (/verify-output)');

// 4. Merge hooks into settings.json
mkdirp(CLAUDE_DIR);
const newHooks = JSON.parse(
  fs.readFileSync(path.join(PKG_ROOT, 'settings-hooks.json'), 'utf8')
).hooks;

let settings = {};
if (fs.existsSync(SETTINGS_PATH)) {
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
  } catch (e) {
    console.error('  WARNING: Could not parse existing settings.json, creating backup');
    fs.copyFileSync(SETTINGS_PATH, SETTINGS_PATH + '.backup');
    settings = {};
  }
}

if (!settings.hooks) settings.hooks = {};

for (const [hookType, entries] of Object.entries(newHooks)) {
  if (!settings.hooks[hookType]) {
    settings.hooks[hookType] = entries;
  } else {
    const existing = JSON.stringify(settings.hooks[hookType]);
    if (!existing.includes('output-integrity')) {
      settings.hooks[hookType] = [...settings.hooks[hookType], ...entries];
    }
  }
}

fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n');
log(4, TOTAL, 'Hook registrations merged into settings.json');

// 5. Prepend integrity gate to CLAUDE.md
const gateSectionPath = path.join(PKG_ROOT, 'claude-md-section.md');
const gateSection = fs.readFileSync(gateSectionPath, 'utf8');

if (!fs.existsSync(CLAUDE_MD_PATH)) {
  fs.writeFileSync(CLAUDE_MD_PATH, `# User-level instructions\n\n${gateSection}\n`);
  log(5, TOTAL, 'CLAUDE.md created with integrity gate');
} else {
  const existing = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
  if (existing.includes('OUTPUT INTEGRITY GATE')) {
    log(5, TOTAL, 'CLAUDE.md already has integrity gate (skipped)');
  } else {
    const updated = `# User-level instructions\n\n${gateSection}\n\n---\n\n${existing}`;
    fs.writeFileSync(CLAUDE_MD_PATH, updated);
    log(5, TOTAL, 'Integrity gate prepended to CLAUDE.md (Priority 0)');
  }
}

// 6. Install memory to current project
let gitRoot = null;
try {
  gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
} catch (e) {
  // Not in a git repo
}

if (gitRoot) {
  const projectPath = gitRoot.replace(/\//g, '-').replace(/^-/, '');
  const memoryDir = path.join(CLAUDE_DIR, 'projects', `-${projectPath}`, 'memory');
  mkdirp(memoryDir);

  const memFeedbackDir = path.join(PKG_ROOT, 'memory', 'feedback');
  const gateMemory = path.join(memFeedbackDir, 'feedback_output_integrity_gate.md');
  const patternsMemory = path.join(memFeedbackDir, 'feedback_integrity_patterns.md');

  if (fs.existsSync(gateMemory)) {
    copyFile(gateMemory, path.join(memoryDir, 'feedback_output_integrity_gate.md'));
  }
  if (fs.existsSync(patternsMemory)) {
    copyFile(patternsMemory, path.join(memoryDir, 'feedback_integrity_patterns.md'));
  }

  // Update MEMORY.md index
  const memoryIndex = path.join(memoryDir, 'MEMORY.md');
  if (fs.existsSync(memoryIndex)) {
    const indexContent = fs.readFileSync(memoryIndex, 'utf8');
    if (!indexContent.includes('integrity_gate')) {
      const append = [
        '- [feedback_output_integrity_gate.md](feedback_output_integrity_gate.md) — 26 verification rules + 6 patterns: no output without evidence check',
        '- [feedback_integrity_patterns.md](feedback_integrity_patterns.md) — 6 failure patterns behind the 26 rules',
      ].join('\n') + '\n';
      fs.appendFileSync(memoryIndex, append);
    }
  }

  log(6, TOTAL, `Memory installed for project (${gitRoot})`);
} else {
  log(6, TOTAL, 'Not in a git repo, skipping project memory');
}

console.log('');
console.log('=== Claude Integrity Gate installed ===');
console.log('');
console.log('Active on next Claude Code session start.');
console.log('Disable with: "disable integrity gate" in any message.');
console.log('');
console.log('Verify: node ~/.claude/hooks/output-integrity-gate.js | head -3');
console.log('');
