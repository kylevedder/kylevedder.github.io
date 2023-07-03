from pathlib import Path
import bibtexparser

from .pubs import load_bibtex

SENTINAL = "BIB"


def entry_to_formatted_bibtex(entry) -> str:

    breakpoint()


def process_bib_line(line: str, file: Path, root_dir: Path) -> str:
    line = line.strip()
    arguments = [e.strip() for e in line.split(" ")]
    assert len(arguments) == 2, f"Expected 2 arguments, got {len(arguments)}"
    bib = load_bibtex(root_dir / arguments[0])
    invalid_blocks = [b for b in bib.blocks if b.key != arguments[1]]
    bib.remove(invalid_blocks)
    assert len(
        bib.blocks
    ) == 1, f"Expected 1 block corresponding to {arguments[1]}, got {len(bib.blocks)}"
    result_string = bibtexparser.write_string(bib)
    return result_string