#!/usr/bin/env node
// output-integrity-posttool — PostToolUse hook for Edit/Write
//
// Validates content written to files (reports, docs, messages) for integrity violations.
// Fires after Edit/Write completes on markdown/text files.

const fs = require('fs');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  const filePath = data.tool_input?.file_path || data.tool_input?.filePath || '';

  // Only check markdown/text docs (reports, messages, docs)
  if (!/\.(md|txt|markdown)$/i.test(filePath)) {
    process.exit(0);
  }

  const content = data.tool_input?.new_string || data.tool_input?.content || '';
  if (!content || content.length < 30) {
    process.exit(0);
  }

  const violations = [];

  // R17: "No timeouts" while timeout events mentioned
  if (/no\s+timeout/i.test(content) && /ETIMEDOUT|timeout.*\d+/i.test(content)) {
    violations.push('R17: "No timeout" contradicts timeout event count in same content');
  }

  // R18: Unqualified "zero errors"
  if (/zero errors|0 errors|no errors/i.test(content) && !/scope|DLQ|unrecoverable|non-fatal/i.test(content)) {
    violations.push('R18: "Zero errors" without scope qualification (DLQ? unrecoverable? all?)');
  }

  // R9: Conclusion heading without verified content
  if (/^#+\s*(Conclusion|Summary|Results)/m.test(content) && /unknown|TBD|unverified|investigating/i.test(content)) {
    violations.push('R9: Conclusion/Summary section exists alongside unverified markers');
  }

  // R24: "Done" status without qualification
  if (/\|\s*Done\s*\|/i.test(content) && /pending|disputed|open question|unresolved/i.test(content)) {
    violations.push('R24: "Done" status alongside "pending/disputed/unresolved" in same doc');
  }

  // R1: Screenshot/recording claims
  if (/screenshot|recording|スクリーンショット|画面キャプチャ/i.test(content)) {
    violations.push('R1-WARNING: File references screenshots/recordings. Verify these actually exist before writing.');
  }

  if (violations.length > 0) {
    const msg = [
      'INTEGRITY GATE — FILE CONTENT VIOLATIONS:',
      'File: ' + filePath,
      '',
      ...violations.map(v => '  - ' + v),
      '',
      'Fix these before finalizing the document.',
    ].join('\n');
    process.stdout.write(msg);
  }

  process.exit(0);
});
