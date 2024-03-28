from postprocessors import processor_list
from typing import List
from pathlib import Path


def postprocess_lines(file_lines: List[str], file: Path, root_dir: Path) -> List[str]:
    for i in range(len(file_lines)):
        for processor in processor_list:
            file_lines[i] = processor(file_lines[i], file, root_dir)
    return file_lines
