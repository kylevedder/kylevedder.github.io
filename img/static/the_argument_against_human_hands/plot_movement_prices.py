"""
Wholesale price history of mass-market mechanical watch movements.

Y axis is in **2026 USD**, adjusted from nominal year-of-quote prices
using BLS CPI-U (All Items, US City Average) multipliers:

    1977  60.6  -> 5.40x
    1982  96.5  -> 3.40x
    1990 130.7  -> 2.50x
    2008 215.3  -> 1.55x
    2009 214.5  -> 1.55x
    2011 224.9  -> 1.45x
    2024 ~315   -> 1.05x

Nominal anchors and per-source citations live alongside this script in
mech_movement_prices.md. Dotted lines between anchors interpolate years
that are not directly sourced.

Run: python plot_movement_prices.py
Output: movement_prices.png in the same directory.
"""

from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker

from _blog_plot import (
    apply_style, COLORS, ERA_GREY, ERA_PURPLE,
    style_axes, add_era, save_for_blog,
)

# CPI-U multipliers from each source year to 2026 USD.
CPI = {
    1977: 5.40,
    1982: 3.40,
    1990: 2.50,
    2008: 1.55,
    2009: 1.55,
    2011: 1.45,
    2024: 1.05,
}


def adj(year: int, nominal_usd: float) -> int:
    return round(nominal_usd * CPI[year])


# --- Data ---------------------------------------------------------------
# Each series: (year, nominal_usd) anchors. Adjusted to 2026 USD below.
# Full citations in mech_movement_prices.md.

eta_2824_nominal = [
    (1982, 60),    # 2824-2 launch (estimate)
    (2009, 126),   # Sinn quote: 90 EUR
    (2024, 250),   # Small-qty replacement, midpoint of $200-300
]

miyota_8215_nominal = [
    (1977, 30),    # 8215 launch (estimate)
    (1990, 22),    # Settled into current band (estimate)
    (2024, 20),    # Wholesale midpoint of $15-25 in packs of 300
]

sellita_sw200_nominal = [
    (2008, 110),   # SW200-1 tech-sheet release (estimate)
    (2024, 180),   # Small-qty replacement, midpoint of $189-199
]

seiko_nh35_nominal = [
    (2011, 50),    # NH35 launch era (estimate)
    (2024, 60),    # Wholesale midpoint of $40-80
]

eta_2824      = [(y, adj(y, p)) for y, p in eta_2824_nominal]
miyota_8215   = [(y, adj(y, p)) for y, p in miyota_8215_nominal]
sellita_sw200 = [(y, adj(y, p)) for y, p in sellita_sw200_nominal]
seiko_nh35    = [(y, adj(y, p)) for y, p in seiko_nh35_nominal]

# --- Plot ---------------------------------------------------------------
apply_style()
fig, ax = plt.subplots(figsize=(10, 6))

series = [
    ("ETA 2824 / 2824-2 (Swiss)",         eta_2824,      COLORS["vermilion"], "o"),
    ("Sellita SW200 (Swiss, ETA clone)",  sellita_sw200, COLORS["amber"],     "s"),
    ("Seiko NH35 (Japan)",                seiko_nh35,    COLORS["blue"],      "^"),
    ("Miyota 8215 (Japan)",               miyota_8215,   COLORS["green"],     "D"),
]

YLIM_TOP = 340

for name, points, color, marker in series:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    ax.plot(xs, ys, linestyle=(0, (1, 2)), color=color,
            alpha=0.55, linewidth=1.4)
    ax.plot(xs, ys, marker=marker, color=color, markersize=8,
            markeredgecolor="white", markeredgewidth=1.2,
            linestyle="None", label=name)

# --- Era shading + consistently-placed labels --------------------------
ERA_LABEL_Y = YLIM_TOP * 0.94
add_era(ax, 1973, 1983, "Quartz crisis",                   ERA_GREY,   ERA_LABEL_Y)
add_era(ax, 2002, 2018, "Swatch / ETA supply restriction", ERA_PURPLE, ERA_LABEL_Y, alpha=0.08)

# --- Axes ---------------------------------------------------------------
ax.set_ylim(0, YLIM_TOP)
ax.set_xlim(1972, 2030)
ax.yaxis.set_major_formatter(mticker.StrMethodFormatter("${x:.0f}"))
ax.yaxis.set_major_locator(mticker.MultipleLocator(50))
ax.xaxis.set_major_locator(mticker.MultipleLocator(10))
style_axes(ax)

ax.set_xlabel("Year")
ax.set_ylabel("Wholesale price per unit (2026 USD, CPI-adjusted)")
ax.set_title("Mass-market mechanical watch movements, real wholesale price",
             loc="left", pad=14)

# --- Legend (horizontal, below) ----------------------------------------
ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12),
          ncol=4, handletextpad=0.5, columnspacing=1.6)

# --- Footnote -----------------------------------------------------------
fig.text(0.5, -0.05,
         "CPI-adjusted to 2026 USD (BLS CPI-U, All Items). "
         "Anchors are sourced data points; dotted segments interpolate.",
         ha="center", fontsize=8.5, style="italic", color="#777777")

plt.tight_layout()
out = Path(__file__).parent / "movement_prices.png"
size = save_for_blog(fig, out)
print(f"wrote {out} ({size[0]}x{size[1]})")
