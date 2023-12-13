#!/usr/bin/env node

import run from '../src/index.js';  

try {
  const currentDirectory = process.cwd()
  await run(currentDirectory)
} catch (error) {
  console.log(error)
}