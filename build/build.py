from pathlib import Path
import hashlib
import os
import tempfile
import shutil

from utils import read_lines, write_lines, run_command, make_tmp_copy
from preprocess import preprocess_lines

root_dir = Path().absolute()


def preprocess(file: Path):
    tmp_file = make_tmp_copy(file)
    lines = read_lines(file)
    lines = preprocess_lines(lines, file, root_dir)
    write_lines(tmp_file, lines)
    return tmp_file


def build_html(file: Path):
    file = Path(file)
    assert file.exists(), f"File {file} does not exist"
    tmp_file = preprocess(file)

    html_file = file.parent / file.name.replace(".md", ".html")
    print(f"{file} -> {html_file}")
    run_command(f"pandoc {tmp_file} -o {html_file}")
    Path(tmp_file).unlink()


def build_resume(resume_md: Path, resume_pdf: Path):
    resume_md = Path(resume_md)
    resume_pdf = Path(resume_pdf)

    assert resume_md.exists(), f"File {resume_md} does not exist"
    resume_tmp = preprocess(resume_md)

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

    md5 = get_file_md5(resume_tmp)
    existing_md5 = get_saved_md5(resume_pdf)

    # if the hashes don't match, rebuild the resume
    if md5 != existing_md5:
        print("Rebuilding resume")
        run_command(f"pandoc {resume_tmp} -o {resume_pdf}")
        run_command(
            f"exiftool -overwrite_original -Subject='{md5}' {resume_pdf}")

    resume_tmp.unlink()


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

build_resume(resume_md, resume_pdf)