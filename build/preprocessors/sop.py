from pathlib import Path

SENTINAL = "STATEMENT_OF_PURPOSE"

def process_sop_line(line: str, file: Path, root_dir: Path) -> str:
    sop_file = Path("_sop.html")
    assert sop_file.exists(), f"File {sop_file} does not exist"
    with open(sop_file, "r") as f:
        sop_str = f.read()
    return sop_str