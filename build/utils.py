from pathlib import Path
import hashlib
import os
import tempfile
import shutil


def read_lines(file: Path):
    file = Path(file)
    assert file.exists(), f"File {file} does not exist"
    with open(file, "r") as f:
        lines = f.readlines()
    return lines


def write_lines(file: Path, lines):
    file = Path(file)
    with open(file, "w") as f:
        f.writelines(lines)


def run_command(cmd):
    print(cmd)
    return os.popen(cmd).read().strip()


def make_tmp_copy(path: Path) -> Path:
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=path.suffix)
    shutil.copy2(path, tmp.name)
    return Path(tmp.name)
