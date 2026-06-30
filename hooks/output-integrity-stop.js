#!/usr/bin/env node
// output-integrity-stop — Claude Code Stop hook (fires AFTER every assistant response)
//
// Post-output validation: scans the assistant's final output for violations of the 25 rules.
// If violations detected, emits warning so model self-corrects on next turn.

const fs = require('fs');

// Read assistant output from stdin
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

  const content = data.assistant_response || data.content || '';
  if (!content || content.length < 50) {
    process.exit(0);
  }

  const violations = [];

  // P5: Internal contradiction detection
  if (/no\s+(timeout|error|failure|retry)/i.test(content) && /ETIMEDOUT|timeout|timed?\s*out/i.test(content)) {
    violations.push('P5-CONTRADICTION: "no timeout" stated alongside timeout event references');
  }

  // P3: Report format during investigation
  if (/## Conclusion|## Summary|## Results/i.test(content) && /unknown|unverified|investigating|TBD/i.test(content)) {
    violations.push('P3-FORMAT: Report-style headings (Conclusion/Summary) used alongside "unknown/unverified" markers');
  }

  // R21: Missing verification markers on stakeholder content
  if (/slack|shin|stakeholder|send this|forward|share with/i.test(content)) {
    if (!/VERIFIED|DRAFT|unverified/i.test(content)) {
      violations.push('R21-MARKERS: Content appears stakeholder-bound but lacks VERIFIED/DRAFT markers');
    }
  }

  // R25: Categorical claims without qualification
  if (/zero errors|no errors|0 errors/i.test(content) && !/DLQ|unrecoverable|scope:/i.test(content)) {
    violations.push('R18-QUALIFY: "zero errors" without scope qualification');
  }

  // R6: Date claims without source
  if (/on the \d{1,2}(st|nd|rd|th)|on \d{4}-\d{2}-\d{2}/i.test(content)) {
    if (!/timestamp|CloudWatch|ECS task|git log|@timestamp/i.test(content)) {
      violations.push('R6-DATE: Date claim without stated timestamp source');
    }
  }

  if (violations.length > 0) {
    const msg = [
      'OUTPUT INTEGRITY GATE — POST-OUTPUT VIOLATIONS DETECTED:',
      '',
      ...violations.map(v => '  - ' + v),
      '',
      'Self-correct on next turn. Acknowledge violations if user-facing content was affected.',
    ].join('\n');
    process.stdout.write(msg);
  }

  process.exit(0);
});
