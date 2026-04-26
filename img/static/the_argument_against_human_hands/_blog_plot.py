"""Shared plot styling for the case-against-human-hands blog post.

Usage:

    from _blog_plot import (
        apply_style, COLORS, ERA_GREY, ERA_PURPLE,
        style_axes, add_era, save_for_blog,
    )

    apply_style()
    fig, ax = plt.subplots(figsize=(10, 6))
    ...
    style_axes(ax)
    add_era(ax, 1973, 1983, "Quartz crisis", ERA_GREY, label_y=320)
    save_for_blog(fig, "movement_prices.png")

Goals:
- Computer Modern typeface (matches default LaTeX) without requiring a
  system LaTeX install — uses the cmr10 font bundled with matplotlib.
- Colorblind-safe Okabe-Ito palette.
- Output rendered at 200 DPI then Lanczos-downsampled to exactly
  TARGET_WIDTH_PX wide so it matches the blog's max text width.
"""

from pathlib import Path
import matplotlib.pyplot as plt
from PIL import Image

# Final output width in pixels. The blog's max text width is 800 px, but
# we render at 3x for HiDPI / retina displays — browsers scale this down
# to display width while keeping glyphs and lines crisp.
BLOG_DISPLAY_WIDTH_PX = 800
DPI_SCALE = 3
TARGET_WIDTH_PX = BLOG_DISPLAY_WIDTH_PX * DPI_SCALE

# Okabe-Ito colorblind-safe palette.
COLORS = {
    "vermilion": "#D55E00",
    "amber":     "#E69F00",
    "blue":      "#0072B2",
    "green":     "#009E73",
    "sky":       "#56B4E9",
    "rose":      "#CC79A7",
    "yellow":    "#F0E442",
}

# Annotation colors for shaded "era" regions.
ERA_GREY   = "#666666"
ERA_PURPLE = "#7B5CA8"


def apply_style() -> None:
    """Set rcParams for the blog's plot style. Call before plt.subplots."""
    plt.rcParams.update({
        # Computer Modern (matches default LaTeX). cmr10 ships with
        # matplotlib, so no system LaTeX install is required.
        "font.family": "serif",
        "font.serif": ["cmr10", "Computer Modern Roman", "DejaVu Serif"],
        "mathtext.fontset": "cm",
        "axes.formatter.use_mathtext": True,
        "axes.unicode_minus": False,  # cmr10 lacks the unicode minus glyph

        "font.size": 11,
        "axes.titlesize": 14,
        "axes.titleweight": "semibold",
        "axes.labelsize": 11,
        "axes.labelcolor": "#333333",
        "axes.edgecolor": "#888888",
        "axes.linewidth": 0.8,
        "xtick.color": "#555555",
        "ytick.color": "#555555",
        "xtick.labelsize": 10,
        "ytick.labelsize": 10,
        "legend.frameon": False,
        "legend.fontsize": 10,
    })


def style_axes(ax, *, grid_axis: str = "y") -> None:
    """Strip top/right spines and apply a light grid behind data.

    Pass grid_axis="both" if you want grid on both axes (e.g. for log
    scales where vertical reference lines help).
    """
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(True, axis=grid_axis, linestyle="-", linewidth=0.5,
            color="#DDDDDD", alpha=0.9, zorder=0)
    ax.set_axisbelow(True)


def add_era(ax, x0: float, x1: float, label: str, color: str,
            label_y: float, *, alpha: float = 0.10) -> None:
    """Shade an era band between x0 and x1 and place its label at label_y,
    centered horizontally over the band.

    Multiple eras placed at the same label_y read as a parallel series.
    """
    ax.axvspan(x0, x1, color=color, alpha=alpha, zorder=0, linewidth=0)
    ax.text((x0 + x1) / 2, label_y, label, color=color,
            ha="center", va="top", fontsize=9, style="italic")


def save_for_blog(fig, path) -> tuple[int, int]:
    """Render at high DPI with bbox_inches='tight', then Lanczos-resample
    to exactly TARGET_WIDTH_PX wide (3x the blog display width for HiDPI).

    Returns the final (width, height) in pixels.
    """
    path = Path(path)
    fig.savefig(path, dpi=200 * DPI_SCALE, bbox_inches="tight", facecolor="white")
    with Image.open(path) as img:
        ratio = TARGET_WIDTH_PX / img.width
        new_size = (TARGET_WIDTH_PX, round(img.height * ratio))
        img.resize(new_size, Image.LANCZOS).save(path, optimize=True)
    return new_size
