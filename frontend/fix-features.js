const fs = require('fs');
const path = require('path');

// Read Features_new.tsx
const newFilePath = path.join(__dirname, 'src/components/Features_new.tsx');
const oldFilePath = path.join(__dirname, 'src/components/Features.tsx');

try {
  const content = fs.readFileSync(newFilePath, 'utf8');
  fs.writeFileSync(oldFilePath, content, 'utf8');
  fs.unlinkSync(newFilePath);
  console.log('✓ Features.tsx has been successfully updated!');
} catch (error) {
  console.error('Error:', error.message);
}
