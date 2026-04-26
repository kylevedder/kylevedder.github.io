"""
Hard-disk-drive unit price history.

Y axis is in **2026 USD per complete HDD**, adjusted from nominal
year-of-quote prices using BLS CPI-U (All Items, US City Average)
multipliers. Capacity is not normalized away; the plotted value is the
price of the physical electromechanical drive assembly.

Nominal anchors and citations live alongside this script in hdd_prices.md.
Dotted lines between anchors interpolate years that are not directly sourced.

Run: python plot_hdd_prices.py
Output: hdd_prices.png in the same directory.
"""

from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker

from _blog_plot import (
    apply_style, COLORS, ERA_GREY, ERA_PURPLE,
    style_axes, add_era, save_for_blog,
)

# CPI-U multipliers from each source year to 2026 USD.
# 2026 uses an approximate CPI anchor of 325.
CPI = {
    1980: 3.94, 1981: 3.58, 1983: 3.26, 1984: 3.13, 1985: 3.02,
    1987: 2.86, 1988: 2.75, 1989: 2.62,
    1995: 2.13, 1996: 2.07, 1997: 2.02, 1998: 1.99, 1999: 1.95,
    2000: 1.89, 2001: 1.84, 2002: 1.81, 2003: 1.77, 2004: 1.72,
    2005: 1.66, 2006: 1.61, 2007: 1.57, 2008: 1.51, 2009: 1.52,
    2010: 1.49, 2011: 1.45, 2012: 1.42, 2014: 1.37, 2016: 1.35,
    2018: 1.29, 2019: 1.27, 2023: 1.07, 2026: 1.00,
}


def adj(year: int, nominal_usd: float) -> float:
    return nominal_usd * CPI[year]


def dollars(x: float, _pos: int | None = None) -> str:
    if x >= 1000:
        return f"${x:,.0f}"
    return f"${x:g}"


# --- Data ---------------------------------------------------------------
# Each series: (year, nominal_usd_per_complete_drive) anchors.
# Full citations in hdd_prices.md.

low_complete_drive_nominal = [
    (1980, 4199),  # North Star 18 MB
    (1981, 1700),  # Seagate 5 MB
    (1983, 1650),  # Davong 10 MB
    (1984, 1075),  # Pegasus / Great Lakes 10 MB
    (1985, 710),   # First Class Peripherals 10 MB
    (1987, 899),   # Iomega 10 MB
    (1988, 799),   # 20 MB
    (1989, 899),   # Western Digital 20 MB
    (1995, 250),   # 240 MB
    (1996, 380),   # IBM 1.76 GB
    (1997, 280),   # Western Digital 2.1 GB
    (1998, 227),   # Fujitsu 3.2 GB
    (1999, 140),   # Fujitsu 6.4 GB
    (2000, 144),   # Maxtor 15.3 GB
    (2001, 90),    # Western Digital 40 GB
    (2002, 90),    # Western Digital 40 GB
    (2003, 90),    # Maxtor 40 GB
    (2004, 98),    # Maxtor 80 GB
    (2005, 130),   # Hitachi Deskstar 250 GB
    (2006, 35),    # Samsung 80 GB
    (2007, 70),    # Seagate 160 GB
    (2008, 200),   # Seagate 750 GB
    (2009, 75),    # Hitachi 1 TB
    (2010, 64),    # 1 TB external
    (2011, 90),    # Pricewatch 1 TB notebook HDD
    (2012, 190),   # Seagate 4 TB retail MAP
    (2014, 130),   # Seagate / WD 4 TB external sale pricing
    (2016, 97),    # WD 4 TB My Book sale pricing
    (2018, 80),    # WD Blue 4 TB sale pricing
    (2019, 80),    # 4 TB external mainstream price
    (2023, 70),    # Seagate IronWolf 4 TB early-2023 price
    (2026, 85),    # Entry 4 TB bulk-storage midpoint of $70-100
]

low_complete_drive = [(y, adj(y, p)) for y, p in low_complete_drive_nominal]

# Capacity milestones at tier transitions. Format: (idx, label, "above"/"below")
MILESTONES = [
    (0,  "18 MB",  "above"),
    (4,  "10 MB",  "below"),
    (6,  "20 MB",  "above"),
    (8,  "240 MB", "below"),
    (13, "15 GB",  "below"),
    (18, "250 GB", "above"),
    (22, "1 TB",   "below"),
    (25, "4 TB",   "above"),
]

# --- Plot ---------------------------------------------------------------
apply_style()
fig, ax = plt.subplots(figsize=(10, 6))

series = [
    ("Low advertised complete HDD", low_complete_drive, COLORS["blue"],      "o"),
]

for name, points, color, marker in series:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    if len(set(xs)) > 1:
        ax.plot(xs, ys, linestyle=(0, (1, 2)), color=color,
                alpha=0.55, linewidth=1.4)
    ax.plot(xs, ys, marker=marker, color=color, markersize=7,
            markeredgecolor="white", markeredgewidth=1.0,
            linestyle="None", label=name)

for idx, label, position in MILESTONES:
    year, price = low_complete_drive[idx]
    dy_pts = 14 if position == "above" else -14
    ax.annotate(
        label,
        xy=(year, price),
        xytext=(0, dy_pts),
        textcoords="offset points",
        ha="center",
        va="bottom" if position == "above" else "top",
        fontsize=9,
        color="#555555",
    )

# --- Axes ---------------------------------------------------------------
ax.set_yscale("log")
ax.set_ylim(40, 30_000)
ax.set_xlim(1972, 2030)
ax.yaxis.set_major_formatter(mticker.FuncFormatter(dollars))
ax.yaxis.set_minor_formatter(mticker.NullFormatter())
ax.xaxis.set_major_locator(mticker.MultipleLocator(10))
style_axes(ax, grid_axis="both")
# Light minor grid for log-scale readability.
ax.grid(True, which="minor", linestyle=":", linewidth=0.4,
        color="#DDDDDD", alpha=0.5, zorder=0)

ax.set_xlabel("Year")
ax.set_ylabel("Complete hard-drive unit price (2026 USD, log scale)")
ax.set_title("Hard-drive mechanisms, real complete-unit price",
             loc="left", pad=14)

# --- Footnote -----------------------------------------------------------
fig.text(
    0.5, -0.05,
    "CPI-adjusted to 2026 USD (BLS CPI-U, All Items). "
    "Complete-drive unit price; capacity is not normalized. "
    "Dotted segments interpolate between sourced anchors.",
    ha="center", fontsize=8.5, style="italic", color="#777777",
)

plt.tight_layout()
out = Path(__file__).parent / "hdd_prices.png"
size = save_for_blog(fig, out)
print(f"wrote {out} ({size[0]}x{size[1]})")
