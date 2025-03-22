// Script to check for constant/variable exports in files with "use server" directive
const fs = require("fs");
const { execSync } = require("child_process");

// Get list of files with "use server" directive
const output = execSync(
  'grep -l "use server" $(find src -name "*.ts" -o -name "*.tsx")'
).toString();
const files = output.split("\n").filter(Boolean);

console.log(`Found ${files.length} files with "use server" directive.`);

// Function to check if a file contains constant/variable exports
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Regex to find exported constants/variables
  const exportPatterns = [
    /export\s+const\s+([a-zA-Z0-9_]+)/g,
    /export\s+let\s+([a-zA-Z0-9_]+)/g,
    /export\s+var\s+([a-zA-Z0-9_]+)/g,
    /export\s+(\{[^}]+\})/g, // Export statements like export { foo, bar }
  ];

  let hasIssues = false;

  for (const pattern of exportPatterns) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      if (!hasIssues) {
        console.log(`\n${filePath} contains non-function exports:`);
        hasIssues = true;
      }

      matches.forEach((match) => {
        console.log(`  - ${match[1]}`);
      });
    }
  }

  return hasIssues;
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
    "No issues found! All exports in server files are async functions."
  );
} else {
  console.log(
    '\nFix these issues by converting constants/variables to async functions, or removing the "use server" directive if not needed.'
  );
  console.log(
    'Example: Change "export const foo = 123" to "export async function getFoo() { return 123; }"'
  );
}
