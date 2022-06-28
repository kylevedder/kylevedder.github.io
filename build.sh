#!/bin/bash
pandoc publications.md -o publications.html
pandoc index.md -o index.html
pandoc xstar.md -o xstar.html
pandoc sparse_point_pillars.md -o sparse_point_pillars.html
pandoc misc/mujoco_py.md -o misc/mujoco_py.html
pandoc misc/screen.md -o misc/screen.html
pandoc misc/writings/next_5_to_10_years_2022.md -o misc/writings/next_5_to_10_years_2022.html
pandoc bio.md -o bio.html

resume_hash=$(md5sum resume.md | awk '{print $1}');
existing_resume_hash=$(exiftool KyleVedderResume.pdf | awk '/^Subject/' | awk '{print $3}');
if [ "$resume_hash" != "$existing_resume_hash" ]; then
  echo "Rebuilding resume";
  pandoc resume.md -o KyleVedderResume.pdf
  exiftool -overwrite_original -Subject="$resume_hash" KyleVedderResume.pdf
fi