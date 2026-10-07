const fs = require('fs');
const path = require('path');

function verifyDir(dirName) {
  console.log(`Checking ${dirName}...`);
  const files = fs.readdirSync(dirName).filter(f => f.endsWith('.html'));
  let missingCount = 0;

  files.forEach(f => {
    const content = fs.readFileSync(path.join(dirName, f), 'utf8');
    const regex = /src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const src = match[1];
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
        continue;
      }
      
      let filePath;
      if (src.startsWith('/images/')) {
        filePath = path.join('public', src);
      } else if (src.startsWith('../')) {
        filePath = path.normalize(path.join(dirName, src));
      } else {
        filePath = path.join(dirName, src);
      }

      // decode URL percent encoding if present e.g. %20
      filePath = decodeURIComponent(filePath);

      if (!fs.existsSync(filePath)) {
        console.error(`  MISSING: In ${dirName}/${f} -> "${src}" resolved to ${filePath}`);
        missingCount++;
      }
    }
  });

  if (missingCount === 0) {
    console.log(`  All local image references in ${dirName} resolved successfully!`);
  }
}

verifyDir('public');
verifyDir('combine latif');
