// Simple script to check for non-async functions in files with "use server" directive
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get list of files with "use server" directive
const output = execSync(
  'grep -l "use server" $(find src -name "*.ts" -o -name "*.tsx")'
).toString();
const files = output.split("\n").filter(Boolean);

console.log(`Found ${files.length} files with "use server" directive.`);

// Function to check if a file contains non-async exported functions
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Simple regex to find exported functions that are not async
  const nonAsyncFunctionPattern = /export\s+function\s+([a-zA-Z0-9_]+)/g;

  const matches = [...content.matchAll(nonAsyncFunctionPattern)];
  if (matches.length > 0) {
    console.log(`\n${filePath} contains non-async exported functions:`);
    matches.forEach((match) => {
      console.log(`  - ${match[1]}`);
    });
    return true;
  }
  return false;
}

// Check all files
let hasIssues = false;
for (const file of files) {
  if (checkFile(file)) {
    hasIssues = true;
  }
}

if (!hasIssues) {
  console.log(
    "No issues found! All exported functions in server files are async."
  );
} else {
  console.log(
    '\nFix these issues by making the functions async, or removing the "use server" directive if not needed.'
  );
}
