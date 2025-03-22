// Debug script to identify nested QueryProvider instances
// Copy and paste this into your browser console when running the app

function findQueryClientProviders() {
  // React Query v5 adds a data-rq-client attribute to QueryClientProvider elements
  const providers = Array.from(document.querySelectorAll("[data-rq-client]"));

  console.log(`Found ${providers.length} QueryClientProvider instances:`);

  // Log each provider's depth and closest identifiable parent
  providers.forEach((provider, index) => {
    // Try to find closest component name
    const findComponentName = (element) => {
      // Check for common React component identifiers
      const idAttr = element.getAttribute("id");
      const dataTestId = element.getAttribute("data-testid");
      const className =
        element.className && typeof element.className === "string"
          ? element.className.split(" ")[0]
          : "";

      if (idAttr) return `#${idAttr}`;
      if (dataTestId) return `[data-testid="${dataTestId}"]`;
      if (className) return `.${className}`;

      // If we can't identify it, use the tag name
      return element.tagName.toLowerCase();
    };

    // Calculate DOM depth
    let depth = 0;
    let parent = provider;
    let path = [];

    while (parent) {
      depth++;
      if (parent.tagName) {
        const name = findComponentName(parent);
        path.unshift(name);
      }
      parent = parent.parentNode;
      // Limit path length to prevent huge outputs
      if (path.length > 5) {
        path = ["...", ...path.slice(path.length - 5)];
        break;
      }
    }

    console.log(`Provider #${index + 1}:`);
    console.log(`  Depth: ${depth}`);
    console.log(`  Path: ${path.join(" > ")}`);
    console.log(`  Element:`, provider);
  });

  // Check for React DevTools
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined") {
    console.log(
      "React DevTools detected - you can inspect the React component tree for more details"
    );
  } else {
    console.log(
      "React DevTools not detected - install the browser extension for better debugging"
    );
  }
}

// Run the function
findQueryClientProviders();

// Also log React Query client instances if using the dev tools
console.log("To see React Query data, open React Query DevTools (if visible)");

// Handle React Query v5 cache
console.log("Looking for React Query cache in window...");
const possibleCaches = Object.keys(window).filter(
  (key) => key.includes("REACT_QUERY") || key.includes("_QUERY_CACHE")
);
console.log("Possible cache keys:", possibleCaches);
