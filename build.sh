#!/bin/bash
# Clean previous build
rm -rf _site/

# Run build
docker run -v `pwd`:/project kylevedder/kylevedderwebsite:latest python3 ./build/build.py
