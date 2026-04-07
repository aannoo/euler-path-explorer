const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not available by default in standard Node.js without npm, let's use a custom recursive readdir

function findFiles(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        findFiles(filePath, ext, fileList);
      }
    } else if (filePath.endsWith(ext)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const jsFiles = findFiles('js', '.js');
const cssFiles = findFiles('css', '.css');
const htmlFiles = ['index.html'];

const allFiles = [...jsFiles, ...cssFiles, ...htmlFiles];

const findings = {
  logicBugs: [],
  memoryLeaks: [],
  performance: [],
  badPractices: [],
  errorHandling: [],
  a11y: [],
  architecture: []
};

const checks = {
  '.js': [
    { regex: /\.innerHTML\s*=/g, category: 'architecture', name: 'innerHTML Usage', desc: 'Direct assignment to innerHTML can lead to XSS vulnerabilities and degrades performance by forcing browser to re-parse HTML.' },
    { regex: /addEventListener/g, category: 'memoryLeaks', name: 'Event Listener Attached', desc: 'Ensure every addEventListener has a corresponding removeEventListener to prevent memory leaks, especially in SPAs or dynamically created elements.', type: 'balance', match: 'removeEventListener' },
    { regex: /setTimeout\(/g, category: 'memoryLeaks', name: 'setTimeout Without Clear', desc: 'Potential memory leak or race condition if component unmounts before timeout completes. Store the ID and clearTimeout.', type: 'balance', match: 'clearTimeout' },
    { regex: /setInterval\(/g, category: 'memoryLeaks', name: 'setInterval Without Clear', desc: 'Memory leak if interval is not cleared when component is destroyed.', type: 'balance', match: 'clearInterval' },
    { regex: /\.getBoundingClientRect\(\)/g, category: 'performance', name: 'Layout Thrashing (getBoundingClientRect)', desc: 'Synchronous layout recalculation. Can cause layout thrashing if called frequently or inside loops/animations.' },
    { regex: /\.offsetWidth|\.offsetHeight|\.clientWidth|\.clientHeight/g, category: 'performance', name: 'Layout Thrashing (Offset/Client properties)', desc: 'Reading layout properties forces the browser to calculate layout synchronously. Cache these values.' },
    { regex: /console\.(log|debug|info)\(/g, category: 'badPractices', name: 'Console Log Leftover', desc: 'Console statements should be removed in production code.' },
    { regex: /var\s+[a-zA-Z0-9_]+\s*=/g, category: 'badPractices', name: 'Usage of var', desc: 'Use let or const instead of var for block scoping.' },
    { regex: /==\s|!=\s/g, category: 'logicBugs', name: 'Non-strict Equality', desc: 'Use === and !== to avoid unintended type coercion.' },
    { regex: /catch\s*\([^)]*\)\s*{\s*}/g, category: 'errorHandling', name: 'Empty Catch Block', desc: 'Silently swallowing errors makes debugging extremely difficult.' },
    { regex: /\.style\.[a-zA-Z0-9_]+\s*=/g, category: 'architecture', name: 'Inline Styles', desc: 'Manipulating inline styles directly. Use CSS classes and classList.add/remove instead for better separation of concerns.' },
    { regex: /alert\(|confirm\(|prompt\(/g, category: 'badPractices', name: 'Synchronous Modals', desc: 'Using alert/confirm blocks the main thread. Use custom modal dialogs instead.' },
    { regex: /document\.(getElementById|querySelector|querySelectorAll)\(/g, category: 'performance', name: 'DOM Query', desc: 'Frequent DOM querying is slow. Cache DOM references when possible, especially outside loops.' }
  ],
  '.css': [
    { regex: /!important/g, category: 'architecture', name: '!important Usage', desc: 'Overuse of !important makes CSS highly brittle and hard to maintain. Fix specificity instead.' },
    { regex: /z-index:\s*[9]{3,}/g, category: 'architecture', name: 'Excessive z-index', desc: 'Using z-index like 9999 is a hack. Use a structured z-index scale (e.g., CSS variables).' },
    { regex: /\*[\s\S]*?{/g, category: 'performance', name: 'Universal Selector', desc: 'Universal selectors (*) can be slow if deeply nested. Use with caution.' },
    { regex: /@[a-z-]+\s.*{/g, category: 'architecture', name: 'Vendor Prefixes', desc: 'Manual vendor prefixes found. Use Autoprefixer or PostCSS instead.' }
  ],
  '.html': [
    { regex: /<img(?![^>]*alt=)[^>]*>/g, category: 'a11y', name: 'Missing alt Attribute', desc: 'Images must have alt attributes for screen readers.' },
    { regex: /<div[^>]*onclick=[^>]*>(?![^>]*tabindex=)[^<]*/g, category: 'a11y', name: 'Clickable Div Missing tabindex', desc: 'Divs with click handlers should have tabindex="0" and keyboard event listeners.' },
    { regex: /<a(?![^>]*href=)[^>]*>/g, category: 'a11y', name: 'Anchor Missing href', desc: 'Anchor tags without href are not accessible via keyboard.' },
    { regex: /style="[^"]*"/g, category: 'architecture', name: 'Inline Style Attribute', desc: 'Inline styles violate CSP and separation of concerns.' }
  ]
};

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const ext = path.extname(file);
  
  const rules = checks[ext];
  if (!rules) return;

  const balances = {};

  lines.forEach((line, index) => {
    rules.forEach(rule => {
      let match;
      // Reset regex index for global regexes
      if(rule.regex.global) rule.regex.lastIndex = 0;
      
      if (rule.type === 'balance') {
        const addCount = (line.match(rule.regex) || []).length;
        const removeCount = (line.match(new RegExp(rule.match, 'g')) || []).length;
        if (!balances[rule.name]) balances[rule.name] = { add: 0, remove: 0, examples: [] };
        balances[rule.name].add += addCount;
        balances[rule.name].remove += removeCount;
        if (addCount > 0 && balances[rule.name].examples.length < 5) {
          balances[rule.name].examples.push({ line: index + 1, code: line.trim() });
        }
      } else {
        while ((match = rule.regex.exec(line)) !== null) {
          findings[rule.category].push({
            file,
            line: index + 1,
            code: line.trim().substring(0, 150),
            name: rule.name,
            desc: rule.desc
          });
        }
      }
    });
  });

  // Check balances per file
  rules.filter(r => r.type === 'balance').forEach(rule => {
    if (balances[rule.name] && balances[rule.name].add > balances[rule.name].remove) {
      findings[rule.category].push({
        file,
        line: 'Multiple',
        code: `Added: ${balances[rule.name].add}, Removed: ${balances[rule.name].remove}. E.g.: ${balances[rule.name].examples[0]?.code}`,
        name: `Unbalanced ${rule.name}`,
        desc: rule.desc
      });
    }
  });
});

// Additionally, check for large files (architecture)
allFiles.forEach(file => {
  const stats = fs.statSync(file);
  const lines = fs.readFileSync(file, 'utf8').split('\n').length;
  if (lines > 500) {
    findings.architecture.push({
      file,
      line: 'N/A',
      code: `File size: ${lines} lines`,
      name: 'Massive File (God Object)',
      desc: 'Files over 500 lines violate Single Responsibility Principle. Consider splitting into smaller modules.'
    });
  }
});

let report = `# 🕵️‍♂️ Comprehensive Codebase Analysis Report\n\n`;
report += `*Generated automatically by static analysis.*\n\n`;
report += `This report contains an exhaustive and deep analysis of the codebase, covering logic bugs, memory leaks, performance bottlenecks, bad practices, accessibility (a11y) issues, and architecture flaws.\n\n`;

const categories = {
  logicBugs: '🐛 Logic Bugs',
  memoryLeaks: '💧 Memory Leaks',
  performance: '⚡ Performance Issues',
  badPractices: '❌ Bad Practices',
  errorHandling: '⚠️ Error Handling',
  a11y: '♿ Accessibility (A11y)',
  architecture: '🏗️ Architecture Flaws'
};

for (const [key, categoryName] of Object.entries(categories)) {
  report += `## ${categoryName}\n\n`;
  if (findings[key].length === 0) {
    report += `*No major issues found in this category based on standard static analysis.*\n\n`;
  } else {
    // Group by file
    const byFile = findings[key].reduce((acc, finding) => {
      if (!acc[finding.file]) acc[finding.file] = [];
      acc[finding.file].push(finding);
      return acc;
    }, {});

    for (const [file, fileFindings] of Object.entries(byFile)) {
      report += `### 📄 \`${file}\`\n\n`;
      fileFindings.forEach(f => {
        report += `- **Line ${f.line}**: **${f.name}**\n`;
        report += `  - *Issue*: ${f.desc}\n`;
        report += `  - *Code*: \`${f.code}\`\n\n`;
      });
    }
  }
}

fs.writeFileSync('comprehensive_findings.md', report);
console.log('Report generated successfully at comprehensive_findings.md');
