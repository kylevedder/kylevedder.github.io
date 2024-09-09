from pathlib import Path

# Glob all ply files

ply_files = sorted(Path().glob("*.ply"))

# Move all ply files to be named raw_*.ply
for i, ply_file in enumerate(ply_files):
    ply_file.rename(ply_file.with_name(f"raw_{i:04d}.ply"))


raw_files = sorted(Path().glob("raw_*.ply"))

min_val = 7
max_val = 23
# Only include 6 to 30
for i, raw_file in enumerate(raw_files):
    if min_val <= i <= max_val:
        raw_file.rename(raw_file.with_name(f"{i-min_val:04d}.ply"))
    else:
        raw_file.unlink()
