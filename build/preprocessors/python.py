from pathlib import Path
import subprocess

SENTINAL = "PYTHON"


def process_python_line(line: str, file: Path, root_dir: Path) -> str:
    line = line.strip()
    elements = line.split(" ")
    script = elements[0].strip()
    args = [e.strip() for e in elements[1:]]
    script_path = (file.parent / script).absolute()
    assert script_path.is_file(), f"File {script_path} does not exist"

    formatted_args = " ".join(args)
    # Run the script and capture the standard output
    result = subprocess.run(f"python3 {script_path} {formatted_args}",
                            shell=True,
                            stdout=subprocess.PIPE,
                            executable='/bin/bash')
    script_result = result.stdout.decode("utf-8")
    return script_result
