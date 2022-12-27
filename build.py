from pathlib import Path
import hashlib
import os
import tempfile
import shutil

root_dir = Path().absolute()


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
    return os.popen(cmd).read().strip()


def make_tmp_copy(path: Path) -> Path:
    tmp = tempfile.NamedTemporaryFile(delete=False)
    shutil.copy2(path, tmp.name)
    return Path(tmp.name)


def load_replaced_header_content(header_args):
    assert isinstance(header_args, dict), "header_args must be a dict"
    header_file = Path("_header.html")
    assert header_file.exists(), f"File {header_file} does not exist"
    with open(header_file, "r") as f:
        header_str = f.read()
    for key, value in header_args.items():
        header_str = header_str.replace(f"{{{key}}}", value)
    return header_str


def insert_header(file: Path):
    HEADER_SENTINAL = "//"
    tmp_file = make_tmp_copy(file)

    lines = read_lines(file)
    header_line = lines[0]
    if not header_line.startswith(HEADER_SENTINAL):
        print(f"File {file} does not have a header")
        write_lines(tmp_file, lines)
        return tmp_file

    page_name = header_line.replace(HEADER_SENTINAL, "").strip()

    root_to_current_file = file.parent.absolute().relative_to(root_dir)
    if root_to_current_file == Path("."):
        current_file_to_root = Path(".")
    else:
        current_file_to_root = Path("../" * len(root_to_current_file.parts))

    lines[0] = load_replaced_header_content({
        "TITLE":
        page_name,
        "DESCRIPTION":
        page_name,
        "PARENT_FOLDER":
        str(current_file_to_root),
    })
    write_lines(tmp_file, lines)
    return tmp_file


def build_html(file: Path):
    file = Path(file)
    assert file.exists(), f"File {file} does not exist"
    tmp_file = insert_header(file)

    html_file = file.parent / file.name.replace(".md", ".html")
    print(f"{file} -> {html_file}")
    run_command(f"pandoc {tmp_file} -o {html_file}")
    Path(tmp_file).unlink()


def build_resume(resume_md: Path, resume_pdf: Path):
    resume_md = Path(resume_md)
    resume_pdf = Path(resume_pdf)

    assert resume_md.exists(), f"File {resume_md} does not exist"

    def get_file_md5(file):
        with open(file, "rb") as f:
            md5 = hashlib.md5()
            md5.update(f.read())
            md5 = md5.hexdigest()
        return md5

    def get_saved_md5(file):
        if not file.exists():
            return None
        md5 = run_command(
            f"exiftool {file} | awk '/^Subject/' | awk '{{print $3}}'")
        return md5

    md5 = get_file_md5(resume_md)
    existing_md5 = get_saved_md5(resume_pdf)

    # if the hashes don't match, rebuild the resume
    if md5 != existing_md5:
        print("Rebuilding resume")
        run_command(f"pandoc {resume_md} -o {resume_pdf}")
        run_command(
            f"exiftool -overwrite_original -Subject='{md5}' {resume_pdf}")


resume_md = "resume.md"
resume_pdf = "KyleVedderResume.pdf"

ignore_files = [resume_md, "README.md", "LICENSE.md"]

# grab all .md files recursively
md_files = list(Path(".").glob("**/*.md"))

# remove the files we don't want to convert
for ignore_file in [Path(e) for e in ignore_files]:
    if ignore_file in md_files:
        md_files.remove(ignore_file)

# run the rest of the files through pandoc
for md_file in md_files:
    build_html(md_file)
