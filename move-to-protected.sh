#!/bin/bash

# Directories to move to the protected route group
# Excluding login, forgot-password (they're in auth group) and the root page
DIRECTORIES=(
    "admin"
    "bom-lists"
    "fixed-assets"
    "processes"
    "production"
    "sales"
    "stock-cards"
    "warehouse"
    "workflow-cards"
)

# Create the protected directory if it doesn't exist
mkdir -p src/app/\(protected\)

# Move each directory to the protected route group
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "src/app/$dir" ]; then
        echo "Moving $dir to protected route group..."
        mkdir -p "src/app/(protected)/$dir"
        cp -r "src/app/$dir/"* "src/app/(protected)/$dir/"
        rm -rf "src/app/$dir"
    else
        echo "Directory $dir doesn't exist, skipping"
    fi
done

echo "Done! All directories have been moved to the protected route group." 