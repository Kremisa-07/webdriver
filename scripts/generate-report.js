const fs = require('fs');
const path = require('path');

const resultsPath = path.join(process.cwd(), 'reports', 'results.json');
const outPath = path.join(process.cwd(), 'reports', 'report.html');

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (!fs.existsSync(resultsPath)) {
  console.error('No results.json found at', resultsPath);
  process.exit(1);
}

const raw = fs.readFileSync(resultsPath, 'utf-8');
let results = [];
try {
  results = JSON.parse(raw || '[]');
} catch (e) {
  console.error('Failed to parse results.json', e.message);
  process.exit(1);
}

const grouped = {};
for (const r of results) {
  if (!grouped[r.feature]) grouped[r.feature] = [];
  grouped[r.feature].push(r);
}

let html = `<!doctype html><html><head><meta charset="utf-8"><title>Test report</title><style>
body{font-family: Arial, Helvetica, sans-serif;padding:20px}
.feature{margin-bottom:24px}
.scenario{padding:8px;border-radius:4px;margin-bottom:6px}
.passed{background:#e6ffed;border:1px solid #b5e6c2}
.failed{background:#ffe6e6;border:1px solid #e6b5b5}
</style></head><body><h1>WDIO Cucumber Simple Report</h1>`;

for (const feature of Object.keys(grouped)) {
  html += `<div class="feature"><h2>${escapeHtml(feature)}</h2>`;
  for (const s of grouped[feature]) {
    const cls = s.passed ? 'passed' : 'failed';
    html += `<div class="scenario ${cls}"><strong>${escapeHtml(s.scenario)}</strong> - ${s.passed ? 'PASSED' : 'FAILED'}<br>`;
    html += `Duration: ${s.duration}ms<br>`;
    if (s.error) html += `<pre>${escapeHtml(s.error)}</pre>`;
    html += `</div>`;
  }
  html += `</div>`;
}

html += `</body></html>`;

fs.writeFileSync(outPath, html, 'utf-8');
console.log('Wrote report to', outPath);

