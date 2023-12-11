from pathlib import Path
import json
import argparse

parser = argparse.ArgumentParser()
# Required argument of the dataset folder
parser.add_argument("dataset_folder",
                    help="Path to the dataset folder",
                    type=Path)
args = parser.parse_args()

dataset_folder = args.dataset_folder
if not dataset_folder.is_absolute():
    cwd = Path(__file__).parent.resolve()
    dataset_folder = cwd / dataset_folder

assert dataset_folder.exists(
), f"Dataset folder {dataset_folder} does not exist"
subfolders = sorted([f for f in dataset_folder.iterdir() if f.is_dir()])


def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def print_legend_entry(category, color, count):
    formatted_category_name = category.replace("_", " ").title()
    # Truncate the category name if it's too long
    if len(formatted_category_name) > 20:
        formatted_category_name = formatted_category_name[:19] + "…"

    print(
        f"""<tr><td><div class="color-box" style="background-color: rgb({color[0] * 255}, {color[1]* 255}, {color[2]* 255});"></div></td><td>{formatted_category_name}</td><td style="text-align: right;">{count}</td></tr>"""
    )


print("<div class=\"entries\">", end="\n\n")

# Generate the raw data containers
for subfolder in subfolders:
    print(f"<!-- begin {subfolder.stem} --> ")
    print(f"<div id='{subfolder.stem}'>", end="\n\n")
    print(f"<h2>{subfolder.stem}</h2>")

    image_path = Path(".") / dataset_folder.name / subfolder.stem / "bev.png"
    print("<div class=\"content_wrapper\">")
    print(
        f"<a href=\"{image_path}\"><img src=\"{image_path}\" class=\"left_image\"></a>"
    )
    print(
        """<table class="legend-table"><tr><th>Color</th><th>Description</th><th>Count</th></tr>"""
    )

    color_json = load_json(subfolder / "category_color.json")
    count_json = load_json(subfolder / "category_count.json")
    for (category, color) in sorted(color_json.items()):
        if color is None:
            continue
        count = sum(count_json[category].values())
        print_legend_entry(category, color, count)
    print("""</table>""")
    print("</div><!-- end content_wrapper -->")
    print("</div>", end="\n\n")
    print(f"<!-- end {subfolder.stem} --> ")

print("</div>", end="\n\n")
