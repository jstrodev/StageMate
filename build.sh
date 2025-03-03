#!/bin/bash
set -e

echo "Starting build process..."

# Install root dependencies
npm install

# Move to client directory
cd client

# Install client dependencies
npm install

# Build client
echo "Building client..."
npm run build

# Check if the build directory exists
if [ -d "dist" ]; then
  echo "Client build successful! Contents of dist directory:"
  ls -la dist
else
  echo "ERROR: dist directory not found after build"
  exit 1
fi

# Return to root
cd ..

echo "Build process completed" 