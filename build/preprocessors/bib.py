from pathlib import Path
import bibtexparser

from .pubs import load_bibtex

SENTINAL = "BIB"


def escape_author_astrisks(fields : list) -> list:
    for idx in range(len(fields)):
        if fields[idx].key == "author":
            fields[idx].value = fields[idx].value.replace("\*", "")
    return fields


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

    # Remove astricks from the author fields
    bib.blocks[0].fields = escape_author_astrisks(bib.blocks[0].fields)
    result_string = bibtexparser.write_string(bib)
    return result_string