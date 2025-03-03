const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== CLIENT BUILD SCRIPT STARTED ===');

try {
  // Check if client directory exists
  if (!fs.existsSync(path.join(__dirname, 'client'))) {
    console.error('Error: client directory not found');
    process.exit(1);
  }

  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  console.log('Building client...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // Check if build was successful
  const distPath = path.join(__dirname, 'client', 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(distPath)) {
    console.log('Dist directory created at:', distPath);
    
    if (fs.existsSync(indexPath)) {
      console.log('Build successful! index.html found at:', indexPath);
      console.log('Contents of dist directory:');
      const files = fs.readdirSync(distPath);
      console.log(files);
    } else {
      console.error('Error: index.html not found in dist directory');
      process.exit(1);
    }
  } else {
    console.error('Error: dist directory not created');
    process.exit(1);
  }

  console.log('=== CLIENT BUILD SCRIPT COMPLETED SUCCESSFULLY ===');
} catch (error) {
  console.error('Build failed with error:', error.message);
  process.exit(1);
} 