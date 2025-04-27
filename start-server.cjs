
// This is a simple script to build and start the server for production
// Usage: node start-server.js

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname);
process.chdir(projectRoot);

// Create a dist directory if it doesn't exist
const distPath = path.join(projectRoot, 'dist');
if (!fs.existsSync(distPath)) {
  // Build the project using the npm scripts from package.json
  console.log('Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Start the server
console.log('Starting server...');
try {
  // Use ts-node to run the server.ts file
  execSync('npx ts-node src/server.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Server failed to start:', error);
  process.exit(1);
}
