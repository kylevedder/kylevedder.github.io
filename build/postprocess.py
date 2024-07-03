from postprocessors import line_processor_list, whole_document_processor_list
from typing import List
from pathlib import Path


def postprocess_lines(file_lines: List[str], file: Path, root_dir: Path) -> List[str]:
    for i in range(len(file_lines)):
        for line_processor in line_processor_list:
            file_lines[i] = line_processor(file_lines[i], file, root_dir)

    for whole_processor in whole_document_processor_list:
        file_lines = whole_processor(file_lines, file, root_dir)
    return file_lines
