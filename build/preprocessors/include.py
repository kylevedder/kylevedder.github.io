from pathlib import Path

SENTINAL = "INCLUDE"

def process_include_line(line: str, file: Path, root_dir: Path) -> str:
    relative_file_path = Path(line.strip())
    include_file = (file.parent / relative_file_path).absolute()

    assert include_file.is_file(), f"File {include_file} does not exist"

    with open(include_file, "r") as f:
        include_str = f.read()
    return include_str
    
