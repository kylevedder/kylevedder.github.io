from pathlib import Path

# Glob all ply files

ply_files = sorted(Path().glob("*.ply"))
json_files = sorted(Path().glob("0*.json"))

assert len(ply_files) == len(json_files)

# Move all ply files to be named raw_*.ply
for i, (ply_file, json_file) in enumerate(zip(ply_files, json_files)):
    ply_file.rename(ply_file.with_name(f"raw_{i:04d}.ply"))
    json_file.rename(json_file.with_name(f"raw_{i:04d}.json"))


raw_files = sorted(Path().glob("raw_*.ply"))
raw_flows = sorted(Path().glob("raw_*.json"))

min_val = 7
max_val = 23
# Only include 6 to 30
for i, (raw_file, raw_flow) in enumerate(zip(raw_files, raw_flows)):
    if min_val <= i <= max_val:
        raw_file.rename(raw_file.with_name(f"{i-min_val:04d}.ply"))
        raw_flow.rename(raw_flow.with_name(f"{i-min_val:04d}.json"))
    else:
        raw_file.unlink()
        raw_flow.unlink()
