#!/bin/bash
pandoc publications.md -o publications.html
pandoc index.md -o index.html
pandoc misc/mujoco_py.md -o misc/mujoco_py.html