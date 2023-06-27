#!/bin/bash
docker run -ti -v `pwd`:/project kylevedder/kylevedderwebsite:latest python3 ./build/build.py
# docker run -ti -v `pwd`:/project kylevedderwebsite python3 ./build/build_pubs.py
