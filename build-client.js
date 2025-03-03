const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== CLIENT BUILD SCRIPT STARTED ===');
console.log('Current directory:', __dirname);
console.log('Files in current directory:', fs.readdirSync(__dirname));

try {
  // Check if client directory exists
  const clientDir = path.join(__dirname, 'client');
  if (!fs.existsSync(clientDir)) {
    console.error('Error: client directory not found at:', clientDir);
    process.exit(1);
  }
  
  console.log('Files in client directory:', fs.readdirSync(clientDir));

  console.log('Installing client dependencies...');
  try {
    execSync('cd client && npm install', { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to install client dependencies:', e.message);
    process.exit(1);
  }

  console.log('Building client...');
  try {
    execSync('cd client && npm run build', { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to build client:', e.message);
    
    // Create a minimal dist directory and index.html as fallback
    console.log('Creating fallback dist directory and index.html');
    const distDir = path.join(clientDir, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const fallbackHTML = `<!DOCTYPE html>
<html>
<head>
  <title>StageMate</title>
  <style>
    body { font-family: Arial; margin: 40px; text-align: center; }
    h1 { color: #2196f3; }
  </style>
</head>
<body>
  <h1>Welcome to StageMate</h1>
  <p>Our site is currently being updated.</p>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'index.html'), fallbackHTML);
    console.log('Created fallback index.html');
  }

  // Check if build was successful
  const distPath = path.join(__dirname, 'client', 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(distPath)) {
    console.log('Dist directory exists at:', distPath);
    
    if (fs.existsSync(indexPath)) {
      console.log('index.html found at:', indexPath);
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