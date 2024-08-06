const fs = require('fs');
const path = require('path');

function tree(dir, level = 0) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (file === 'node_modules' || file === '.git') return;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    console.log(`${' '.repeat(level * 2)}- ${file}`);

    if (stat.isDirectory()) {
      tree(filePath, level + 1);
    }
  });
}

const directoryPath = path.resolve(process.argv[2] || '.');
tree(directoryPath);