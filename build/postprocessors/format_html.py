from pathlib import Path
from html.parser import HTMLParser


class HeadTagCounter(HTMLParser):

    def __init__(self, *, convert_charrefs: bool = True) -> None:
        super().__init__(convert_charrefs=convert_charrefs)
        self.start_head_tags = 0
        self.end_head_tags = 0

    def handle_starttag(self, tag, attrs):
        if tag == "head":
            self.start_head_tags += 1

    def handle_endtag(self, tag):
        if tag == "head":
            self.end_head_tags += 1


def process_document_into_html(
    lines: list[str], file: Path, root_dir: Path
) -> list[str]:
    # Expect document to start with <head> tag, and have a single <head> and </head> tag

    doc_str = "\n".join(lines)
    head_counter = HeadTagCounter()
    head_counter.feed(doc_str)

    assert (
        head_counter.start_head_tags == 1
    ), f"Expected 1 <head> tag, found {head_counter.start_head_tags} in {file}."
    assert (
        head_counter.end_head_tags == 1
    ), f"Expected 1 </head> tag, found {head_counter.end_head_tags} in {file}."

    # Strip empty lines.
    clean_lines = [line for line in lines if line.strip() != ""]

    # Expect document to start with <head>
    assert (
        clean_lines[0].strip().startswith("<head>")
    ), f"Expected document to start with <head> tag, found {clean_lines[0]}"

    # Add body start tag and end tag. Body should start immediately after head close
    head_close_index = lines.index("</head>\n")
    lines.insert(head_close_index + 1, "<body>")
    lines.append("</body>")

    # Add HTML start tag and end tag.
    lines.insert(0, "<html>")
    lines.insert(0, "<!DOCTYPE html>")
    lines.append("</html>")

    return lines
