// Script to fix constant/variable exports in files with "use server" directive
const fs = require("fs");
const { execSync } = require("child_process");

// Get list of files with "use server" directive
const output = execSync(
  'grep -l "use server" $(find src -name "*.ts" -o -name "*.tsx")'
).toString();
const files = output.split("\n").filter(Boolean);

console.log(`Found ${files.length} files with "use server" directive.`);

// Functions to fix different export patterns
function fixFileExports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let fixed = false;

  // Pattern 1: export const foo = async () => { ... }
  // Replace with: export async function foo() { ... }
  const arrowFunctionPattern =
    /export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*async\s*\(([^)]*)\)\s*=>\s*(\{[\s\S]*?\n\})/g;
  content = content.replace(
    arrowFunctionPattern,
    (match, name, params, body) => {
      fixed = true;
      return `export async function ${name}(${params})${body}`;
    }
  );

  // Pattern 2: export const foo = () => { ... }
  // Replace with: export async function foo() { ... }
  const nonAsyncArrowPattern =
    /export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*\(([^)]*)\)\s*=>\s*(\{[\s\S]*?\n\})/g;
  content = content.replace(
    nonAsyncArrowPattern,
    (match, name, params, body) => {
      fixed = true;
      return `export async function ${name}(${params})${body}`;
    }
  );

  // If we fixed anything, write the file back
  if (fixed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed exports in ${filePath}`);
    return true;
  }

  return false;
}

// Fix all files
let fixedCount = 0;
for (const file of files) {
  if (fixFileExports(file)) {
    fixedCount++;
  }
}

if (fixedCount > 0) {
  console.log(`\nFixed ${fixedCount} files.`);
  console.log(
    "You may need to manually review some files as the automatic fixes might not cover all cases."
  );
  console.log("Run check-server-exports.js again to verify remaining issues.");
} else {
  console.log("No files needed fixing or automatic fixes were not sufficient.");
  console.log("You may need to manually fix any remaining issues.");
}
