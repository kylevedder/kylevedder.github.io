from pathlib import Path

# Glob all ply files

ply_files = sorted(Path().glob("*.ply"))

# Move all ply files to be named raw_*.ply
for i, ply_file in enumerate(ply_files):
    ply_file.rename(ply_file.with_name(f"raw_{i:04d}.ply"))


raw_files = sorted(Path().glob("raw_*.ply"))
# Only include 6 to 22
for i, raw_file in enumerate(raw_files):
    if 6 <= i <= 22:
        raw_file.rename(raw_file.with_name(f"{i-5:04d}.ply"))
    else:
        raw_file.unlink()
