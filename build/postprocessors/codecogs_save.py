import requests
import hashlib
from pathlib import Path


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


def process_codecogs_line(line: str, file: Path, root_dir: Path) -> str:
    if "latex.codecogs.com" not in line:
        return line

    # Get number of parents to go up for file to get to the root

    # Extract the URL of the image
    codecogs_url = line.split('src="')[1].split('"')[0]

    # Download the image locally
    image_disk_path = _download_image_locally(codecogs_url, file.stem)

    file_num_parents = len(list(file.parents)) - 1
    current_file_to_root_relative = (
        Path(*[".." for _ in range(file_num_parents)]) / image_disk_path
    )

    # Replace the URL with the local path
    line = line.replace(codecogs_url, str(current_file_to_root_relative))
    return line
