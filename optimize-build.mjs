#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function optimizeBuild() {
  console.log('🚀 Starting build optimization...');
  
  try {
    // Clean up node_modules cache
    const cacheDirectories = [
      'node_modules/.cache',
      'frontend/node_modules/.cache',
      '.cache',
      'frontend/.cache',
      'backend/.cache'
    ];
    
    for (const dir of cacheDirectories) {
      try {
        await fs.rm(join(__dirname, dir), { recursive: true, force: true });
        console.log(`✅ Cleaned ${dir}`);
      } catch (error) {
        console.log(`⚠️  Cache directory ${dir} not found or already clean`);
      }
    }
    
    // Check for common issues
    console.log('🔍 Checking for common build issues...');
    
    // Check if all required files exist
    const requiredFiles = [
      'frontend/package.json',
      'backend/package.json',
      'backend/functions/server.mjs',
      'netlify.toml'
    ];
    
    for (const file of requiredFiles) {
      try {
        await fs.access(join(__dirname, file));
        console.log(`✅ ${file} exists`);
      } catch (error) {
        console.error(`❌ Missing required file: ${file}`);
        process.exit(1);
      }
    }
    
    console.log('✨ Build optimization complete!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeBuild();
}

export default optimizeBuild; 