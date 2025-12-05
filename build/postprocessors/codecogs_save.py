import requests
import hashlib
from pathlib import Path
import subprocess


def _download_image_locally(url: str, filename: str) -> Path:
    # Generate the MD5 hash of the URL to use as the file name
    url_hash = hashlib.md5(url.encode("utf-8")).hexdigest()
    local_path = Path("img") / "compiled" / filename / f"{url_hash}.png"

    # Ensure the directory exists
    local_path.parent.mkdir(parents=True, exist_ok=True)

    if not local_path.exists():
        # Download the image
        response = requests.get(url)
        response.raise_for_status()  # This will raise an exception for HTTP errors

        # Save the image locally
        with open(local_path, "wb") as f:
            f.write(response.content)

    return local_path


def get_image_size(path: Path) -> tuple[int, int] | None:
    try:
        # Use exiftool to get width and height
        # -s3: Short output (values only)
        # -ImageWidth -ImageHeight: tags to read
        # Note: We use shell=True to allow the command string to be executed
        cmd = f"exiftool -s3 -ImageWidth -ImageHeight {path}"
        output = (
            subprocess.check_output(cmd, shell=True)
            .decode("utf-8")
            .strip()
            .splitlines()
        )

        # exiftool returns lines in the order they are found in the file, not necessarily requested order?
        # Actually, if we request specific tags, it usually respects that or we should parse keys.
        # Let's use -s (short tag names) and parse "ImageWidth: 100" to be safe.

        cmd = f"exiftool -s -ImageWidth -ImageHeight {path}"
        output = (
            subprocess.check_output(cmd, shell=True)
            .decode("utf-8")
            .strip()
            .splitlines()
        )

        w = None
        h = None
        for line in output:
            if "ImageWidth" in line:
                w = int(line.split(":")[1].strip())
            elif "ImageHeight" in line:
                h = int(line.split(":")[1].strip())

        if w is not None and h is not None:
            return w, h

    except Exception as e:
        print(f"Error reading image size for {path}: {e}")
    return None


def process_codecogs_line(line: str, file: Path, root_dir: Path) -> str:
    if "latex.codecogs.com" not in line:
        return line

    # Get number of parents to go up for file to get to the root

    # Extract the URL of the image
    try:
        codecogs_url = line.split('src="')[1].split('"')[0]
    except IndexError:
        # Fallback if src format is different
        return line

    # Download the image locally
    image_disk_path = _download_image_locally(codecogs_url, file.stem)

    # Get image size
    size = get_image_size(image_disk_path)

    file_num_parents = len(list(file.parents)) - 1
    current_file_to_root_relative = (
        Path(*[".." for _ in range(file_num_parents)]) / image_disk_path
    )

    # Replace the URL with the local path
    if size:
        w, h = size
        # Halve the dimensions for 2x DPI (200 DPI vs 96-ish screen DPI, roughly 0.5 scale)
        # Using 200 DPI for print quality on screen -> scale by 0.5 to match font size
        w = int(w * 0.5)
        h = int(h * 0.5)

        # We replace the src="..." part with width="..." height="..." src="..."
        # This injects the dimensions.
        line = line.replace(
            f'src="{codecogs_url}"',
            f'class="latex-math" width="{w}" height="{h}" src="{current_file_to_root_relative}"',
        )
    else:
        # Fallback
        line = line.replace(codecogs_url, str(current_file_to_root_relative))

    return line
