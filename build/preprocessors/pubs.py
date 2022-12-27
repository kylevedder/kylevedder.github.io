from pathlib import Path
import bibtexparser

SENTINAL = "PUBS"


def load_bibtex(file: Path):
    file = Path(file)
    assert file.exists(), f"File {file} does not exist"
    with open(file, "r") as f:
        bib = bibtexparser.load(f)
    return bib


def extract_names(names_str):
    names = names_str.split(" and ")
    names = [name.strip() for name in names]
    # Flip first and last name
    names = [name.split(", ") for name in names]
    names = [f"{name[1]} {name[0]}" for name in names]
    names = [n if n != "Kyle Vedder" else "**Kyle Vedder**" for n in names]
    return names


def entry_to_markdown(entry):
    authors_lst = extract_names(entry["author"])

    authors = ", ".join(authors_lst)
    title = entry["title"].replace("{", "").replace("}", "").replace("*", "\*")


    markdown = f"- {authors}. _{title}_. "

    if "booktitle" in entry:
        booktitle = entry["booktitle"].replace("{", "").replace("}", "")
        markdown += f"{booktitle}, "
    elif "journal" in entry:
        booktitle = entry["journal"].replace("{", "").replace("}", "")
        markdown += f"{booktitle}, "
    year = entry["year"]

    markdown += f"{year}."

    if "website" in entry:
        url = entry["website"]
        markdown += f" [[website]]({url})"
    if "pdf" in entry:
        pdf = entry["pdf"]
        markdown += f" [[pdf]]({pdf})"
    if "code" in entry:
        code = entry["code"]
        markdown += f" [[code]]({code})"
    if "slides" in entry:
        slides = entry["slides"]
        markdown += f" [[slides]]({slides})"
    if "video" in entry:
        video = entry["video"]
        markdown += f" [[video]]({video})"
    if "poster" in entry:
        poster = entry["poster"]
        markdown += f" [[poster]]({poster})"
    if "bibtex" in entry:
        bibtex = entry["bibtex"]
        markdown += f" [[bibtex]]({bibtex})"

    return markdown


def process_pub_line(line: str, file: Path, root_dir: Path) -> str:
    bib = load_bibtex(root_dir / line.strip())
    entries = bib.entries
    entries = [entry_to_markdown(entry) for entry in entries]
    return "\n".join(entries)
