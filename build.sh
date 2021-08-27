#!/bin/bash
pandoc publications.md -o publications.html
pandoc index.md -o index.html
pandoc xstar.md -o xstar.html
pandoc misc/mujoco_py.md -o misc/mujoco_py.html
pandoc misc/screen.md -o misc/screen.html
pandoc resume.md -o KyleVedderResume.pdf