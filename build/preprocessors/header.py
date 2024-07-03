from pathlib import Path
from dataclasses import dataclass
import json

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


@dataclass
class HeaderArgs:
    page_name: str
    teaser_img: str | None


def _parse_line(line: str) -> HeaderArgs:
    line = line.strip()
    # If the line doesn't start with a "{" then it's not dictionary, it's just a description
    if not line.startswith("{"):
        return HeaderArgs(page_name=line, teaser_img=None)

    # If the line starts with a "{" then it's a dictionary; parse it as JSON
    print(line)
    header_args_dict = json.loads(line)
    return HeaderArgs(**header_args_dict)


def process_header_line(line: str, file: Path, root_dir: Path) -> str:
    header_args = _parse_line(line)

    root_to_current_file = file.parent.absolute().relative_to(root_dir)
    if root_to_current_file == Path("."):
        current_file_to_root = Path(".")
    else:
        current_file_to_root = Path("../" * len(root_to_current_file.parts))

    return load_replaced_header_content(
        {
            "TITLE": header_args.page_name,
            "DESCRIPTION": header_args.page_name,
            "TEASER_IMG": (
                header_args.teaser_img if header_args.teaser_img is not None else ""
            ),
            "PARENT_FOLDER": str(current_file_to_root),
        }
    )
