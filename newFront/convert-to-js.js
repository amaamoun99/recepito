import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

// Get current file path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      fileList = getAllFiles(filePath, fileList);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to convert TypeScript to JavaScript
function convertTsToJs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove type annotations
  let jsContent = content
    // Remove import type statements
    .replace(/import\s+type\s+.*?from\s+(['"]).*?\1;?/g, '')
    // Remove type imports from regular import statements
    .replace(/import\s+{(.*?)}\s+from\s+(['"]).*?\2;?/g, (match, importList) => {
      const cleanedImports = importList
        .split(',')
        .map(i => i.trim())
        .filter(i => !i.startsWith('type '))
        .join(', ');
      
      if (cleanedImports.length === 0) return '';
      return `import { ${cleanedImports} } from ${match.split('from')[1]}`;
    })
    // Remove interface declarations
    .replace(/export\s+interface\s+\w+\s*{[\s\S]*?}/g, '')
    .replace(/interface\s+\w+\s*{[\s\S]*?}/g, '')
    // Remove type declarations
    .replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, '')
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
    // Remove type annotations in function parameters
    .replace(/(\w+)\s*:\s*\w+(\[\])?/g, '$1')
    // Remove return type annotations
    .replace(/\)\s*:\s*\w+(\[\])?/g, ')')
    // Remove generic type parameters
    .replace(/<.*?>/g, '')
    // Remove extends VariantProps<...> and similar type extensions
    .replace(/extends\s+\w+(<.*?>)?(\s*,\s*\w+(<.*?>)?)*\s*{/g, '{')
    // Remove as const assertions
    .replace(/as\s+const/g, '')
    // Remove type assertions
    .replace(/as\s+\w+(\[\])?/g, '');

  // Special handling for React.forwardRef<Type, Props>
  jsContent = jsContent.replace(/React\.forwardRef<.*?>/g, 'React.forwardRef');
  
  // Create new file path (.ts -> .js, .tsx -> .jsx)
  const newFilePath = filePath.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  
  // Write the new file
  fs.writeFileSync(newFilePath, jsContent);
  
  // Delete the original TypeScript file
  fs.unlinkSync(filePath);
  
  console.log(`Converted: ${filePath} -> ${newFilePath}`);
}

// Function to update configuration files
function updateConfigFiles() {
  // Convert tsconfig files to jsconfig
  if (fs.existsSync('./tsconfig.json')) {
    const tsConfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'));
    
    // Create jsconfig.json
    const jsConfig = {
      ...tsConfig,
      compilerOptions: {
        ...tsConfig.compilerOptions,
        allowJs: true,
        checkJs: false
      }
    };
    
    fs.writeFileSync('./jsconfig.json', JSON.stringify(jsConfig, null, 2));
    console.log('Created jsconfig.json');
  }
  
  // Convert vite.config.ts to vite.config.js
  if (fs.existsSync('./vite.config.ts')) {
    convertTsToJs('./vite.config.ts');
  }
  
  // Convert tailwind.config.ts to tailwind.config.js
  if (fs.existsSync('./tailwind.config.ts')) {
    convertTsToJs('./tailwind.config.ts');
  }
  
  // Update package.json to remove TypeScript dependencies
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  // Remove TypeScript-related devDependencies
  const typescriptDeps = ['typescript', '@types/react', '@types/react-dom', '@types/node', 'typescript-eslint'];
  
  if (packageJson.devDependencies) {
    typescriptDeps.forEach(dep => {
      if (packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
      }
    });
  }
  
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json');
}

// Main function
function main() {
  const rootDir = process.cwd();
  console.log(`Starting conversion in: ${rootDir}`);
  
  // Get all TypeScript files
  const tsFiles = getAllFiles(rootDir);
  console.log(`Found ${tsFiles.length} TypeScript files to convert`);
  
  // Convert each file
  tsFiles.forEach(convertTsToJs);
  
  // Update configuration files
  updateConfigFiles();
  
  console.log('Conversion complete!');
}

// Execute the main function
main();
