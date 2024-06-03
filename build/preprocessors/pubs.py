from pathlib import Path
import bibtexparser

SENTINAL = "PUBS"


def load_bibtex(file: Path):
    file = Path(file)
    assert file.exists(), f"File {file} does not exist"
    bib = bibtexparser.parse_file(file)
    if len(bib.failed_blocks) > 0:
        print("Some blocks failed to parse.")
        print(bib.failed_blocks)
        raise Exception("Failed to parse bibtex file")
    return bib


def extract_names(names_str):
    names = names_str.split(" and ")
    names = [name.strip() for name in names]
    # Flip first and last name
    names = [name.split(", ") for name in names]
    names = [f"{name[1]} {name[0]}" for name in names]
    names = [f"**{n}**" if "Kyle Vedder" in n else n for n in names]
    if len(names) > 10:
        names = [names[0] + " et al"]
    return names


def entry_to_markdown(entries_wrapper):

    entries = {e.key: e.value for e in entries_wrapper.fields}

    authors_lst = extract_names(entries["author"])

    if len(authors_lst) == 1:
        authors = authors_lst[0]
    else:
        authors = ", ".join(authors_lst)
    title = entries["title"].replace("{", "").replace("}",
                                                      "").replace("*", "\*")

    markdown = f"- {authors}. _{title}_. "

    if "booktitle" in entries:
        booktitle = entries["booktitle"].replace("{", "").replace("}", "")
        markdown += f"{booktitle}, "
    elif "journal" in entries:
        booktitle = entries["journal"].replace("{", "").replace("}", "")
        markdown += f"{booktitle}, "
    year = entries["year"]

    markdown += f"{year}."

    if "website" in entries:
        url = entries["website"]
        markdown += f" [[website]]({url})"
    if "pdf" in entries:
        pdf = entries["pdf"]
        markdown += f" [[pdf]]({pdf})"
    if "code" in entries:
        code = entries["code"]
        markdown += f" [[code]]({code})"
    if "slides" in entries:
        slides = entries["slides"]
        markdown += f" [[slides]]({slides})"
    if "video" in entries:
        video = entries["video"]
        markdown += f" [[video]]({video})"
    if "poster" in entries:
        poster = entries["poster"]
        markdown += f" [[poster]]({poster})"
    if "bibtex" in entries:
        bibtex = entries["bibtex"]
        markdown += f" [[bibtex]]({bibtex})"

    return markdown


def process_pub_line(line: str, file: Path, root_dir: Path) -> str:
    line = line.strip()
    arguments = [e.strip() for e in line.split(" ")]
    bib = load_bibtex(root_dir / arguments[0])
    entries = bib.entries
    if len(arguments) == 2:
        entries = [entry for entry in entries if entry["ID"] == arguments[1]]
    entries = [entry_to_markdown(entry) for entry in entries]
    return "\n".join(entries)
