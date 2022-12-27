from preprocessors import processor_map
from typing import List
from pathlib import Path


def preprocess_lines(file_lines: List[str], file : Path, root_dir : Path) -> List[str]:
    for i, line in enumerate(file_lines):
        for sentinal, processor in processor_map.items():
            if line.startswith(sentinal):
                args = line.replace(sentinal, "", 1)
                file_lines[i] = processor(args, file, root_dir) + "\n"
    return file_lines