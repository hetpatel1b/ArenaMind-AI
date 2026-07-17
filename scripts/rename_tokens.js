const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['src', 'tests'];

const REPLACEMENTS = [
  { regex: /\bStadium\b/g, replacement: 'Venue' },
  { regex: /\bstadium\b/g, replacement: 'venue' },
  { regex: /\bStadiums\b/g, replacement: 'Venues' },
  { regex: /\bstadiums\b/g, replacement: 'venues' },
  { regex: /\bstadiumId\b/g, replacement: 'venueId' },
  { regex: /\bCrowdData\b/g, replacement: 'CrowdSnapshot' },
  { regex: /\bcrowdData\b/g, replacement: 'crowdSnapshots' },
];

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (
      entry.isFile() &&
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js'))
    ) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const { regex, replacement } of REPLACEMENTS) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of DIRECTORIES_TO_SCAN) {
  const fullPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    processDirectory(fullPath);
  }
}

console.log('Token replacement complete.');
