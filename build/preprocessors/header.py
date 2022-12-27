from pathlib import Path

SENTINAL = "HEADER"


def load_replaced_header_content(header_args):
    assert isinstance(header_args, dict), "header_args must be a dict"
    header_file = Path("_header.html")
    assert header_file.exists(), f"File {header_file} does not exist"
    with open(header_file, "r") as f:
        header_str = f.read()
    for key, value in header_args.items():
        header_str = header_str.replace(f"{{{key}}}", value)
    return header_str


def process_header_line(line: str, file: Path, root_dir: Path) -> str:
    page_name = line.strip()

    root_to_current_file = file.parent.absolute().relative_to(root_dir)
    if root_to_current_file == Path("."):
        current_file_to_root = Path(".")
    else:
        current_file_to_root = Path("../" * len(root_to_current_file.parts))

    return load_replaced_header_content({
        "TITLE":
        page_name,
        "DESCRIPTION":
        page_name,
        "PARENT_FOLDER":
        str(current_file_to_root),
    })