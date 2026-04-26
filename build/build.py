from pathlib import Path
import hashlib
import shutil

from utils import read_lines, write_lines, run_command, make_tmp_copy
from preprocess import preprocess_lines
from postprocess import postprocess_lines

root_dir = Path().absolute()
output_dir = root_dir / "_site"

# Static assets to copy (preserve directory structure)
STATIC_ASSETS = [
    "css/",
    "js/",
    "fonts/",
    "img/",
    "publications/",
    "bibs/",
    "CNAME",
]


def setup_output_dir():
    """Create output directory and copy static assets."""
    output_dir.mkdir(parents=True, exist_ok=True)

    for asset in STATIC_ASSETS:
        src = root_dir / asset
        dst = output_dir / asset

        if not src.exists():
            print(f"Warning: Static asset {src} does not exist, skipping")
            continue

        if src.is_dir():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)


def preprocess(file: Path):
    tmp_file = make_tmp_copy(file)
    lines = read_lines(file)
    lines = preprocess_lines(lines, file, root_dir)
    write_lines(tmp_file, lines)
    return tmp_file


def postprocess(file: Path, source_file: Path):
    lines = read_lines(file)
    lines = postprocess_lines(lines, source_file, root_dir, output_dir)
    write_lines(file, lines)


def build_html(file: Path):
    file = Path(file)
    # Make path absolute if it isn't already
    if not file.is_absolute():
        file = root_dir / file
    assert file.exists(), f"File {file} does not exist"
    tmp_file = preprocess(file)

    # Compute output path in _site/
    relative_path = file.relative_to(root_dir)
    html_relative = relative_path.with_suffix(".html")
    html_file = output_dir / html_relative

    # Ensure output directory exists
    html_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"{file} -> {html_file}")
    run_command(
        f"pandoc --citeproc --webtex='https://latex.codecogs.com/png.latex?\\dpi{{200}}' {tmp_file} -o {html_file}"
    )
    postprocess(html_file, relative_path)
    Path(tmp_file).unlink()


def build_resume(resume_md: Path, resume_pdf: Path):
    resume_md = Path(resume_md)
    # Make path absolute if it isn't already
    if not resume_md.is_absolute():
        resume_md = root_dir / resume_md
    resume_pdf = output_dir / resume_pdf

    assert resume_md.exists(), f"File {resume_md} does not exist"
    resume_tmp = preprocess(resume_md)

    # Ensure output directory exists
    resume_pdf.parent.mkdir(parents=True, exist_ok=True)

    def get_file_md5(file):
        with open(file, "rb") as f:
            md5 = hashlib.md5()
            md5.update(f.read())
            md5 = md5.hexdigest()
        return md5

    def get_saved_md5(file):
        if not file.exists():
            return None
        md5 = run_command(f"exiftool {file} | awk '/^Subject/' | awk '{{print $3}}'")
        return md5

    md5 = get_file_md5(resume_tmp)
    existing_md5 = get_saved_md5(resume_pdf)

    # if the hashes don't match, rebuild the resume
    if md5 != existing_md5:
        print("Rebuilding resume")
        run_command(f"pandoc {resume_tmp} -o {resume_pdf}")
        run_command(f"exiftool -overwrite_original -Subject='{md5}' {resume_pdf}")

    resume_tmp.unlink()


# Setup output directory and copy static assets
setup_output_dir()

resume_md = "resume.md"
resume_pdf = "KyleVedderResume.pdf"

ignore_files = [resume_md, "README.md", "LICENSE.md", "AGENTS.md"]

# Directories to exclude from page compilation. Static asset directories are
# copied wholesale above; markdown notes inside them are not standalone pages.
exclude_dirs = [
    ".venv",
    "_site",
    ".git",
    "node_modules",
    "build",
    "css",
    "js",
    "fonts",
    "img",
    "publications",
    "bibs",
]

# grab all .md files recursively
md_files = list(Path(".").glob("**/*.md"))

# remove files in excluded directories
md_files = [f for f in md_files if not any(excl in f.parts for excl in exclude_dirs)]

# remove the files we don't want to convert
for ignore_file in [Path(e) for e in ignore_files]:
    if ignore_file in md_files:
        md_files.remove(ignore_file)

# run the rest of the files through pandoc
for md_file in md_files:
    build_html(md_file)

build_resume(resume_md, resume_pdf)
