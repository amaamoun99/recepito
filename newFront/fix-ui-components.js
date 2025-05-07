import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uiComponentsDir = path.join(__dirname, 'src', 'components', 'ui');

// Get all .jsx files in the UI components directory
const files = fs.readdirSync(uiComponentsDir)
  .filter(file => file.endsWith('.jsx') || file.endsWith('.js'));

// Process each file
files.forEach(file => {
  const filePath = path.join(uiComponentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix 1: Fix import statements
  content = content.replace(/import \* +from "([^"]+)"/g, (match, p1) => {
    const moduleName = p1.split('/').pop().replace(/-/g, '');
    const pascalCase = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    return `import * as ${pascalCase} from "${p1}"`;
  });
  
  // Fix 2: Remove TypeScript generic type parameters in React.forwardRef
  content = content.replace(/React\.forwardRef<[^>]*>/g, 'React.forwardRef');
  
  // Fix 3: Remove TypeScript type annotations
  content = content.replace(/}: React\.[^)]+\)/g, '})');
  
  // Fix 4: Clean up extra spaces in imports
  content = content.replace(/from +"/g, 'from "');
  
  // Fix 5: Fix JSX closing issues - this is a basic fix, may need manual review
  content = content.replace(/\(\s*\n\s*\n\s*<([^>]+)>/g, '(\n    <$1>');
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${file}`);
});

console.log('All UI component files have been processed.');
