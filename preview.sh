#!/bin/bash
set -e

# Build the site
./build.sh

# Serve locally
echo "Serving at http://localhost:8000"
cd _site && python3 -m http.server 8000
