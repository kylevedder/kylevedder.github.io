# Hard-drive unit prices - sources and CPI-adjusted data points

Backing data for `hdd_prices.png`, expressed as the price of a complete hard
disk drive unit rather than dollars per gigabyte. This is the better proxy for
the electromechanical mechanism: spindle motor, platters, actuator arm, heads,
bearings, enclosure, and drive electronics. Capacity is listed only to identify
the quoted product; it is not used in the plotted value.

The main historical series is a low advertised retail / street-price series
assembled from old ads and web archives. It should be read as "what did a
cheap complete HDD cost as a physical mechanism?" rather than as an industry
average selling price.

## Inflation methodology

Real prices are reported in **2026 USD** using the BLS CPI-U (All Items,
U.S. City Average) series. Multipliers use annual-average CPI where available;
2026 uses an approximate CPI anchor of 325. The early-2026 BLS series is still
partial as of April 26, 2026.

| From year | CPI-U | Multiplier to 2026 |
|---|---:|---:|
| 1980 | 82.4 | 3.94x |
| 1985 | 107.6 | 3.02x |
| 1995 | 152.4 | 2.13x |
| 2000 | 172.2 | 1.89x |
| 2005 | 195.3 | 1.66x |
| 2009 | 214.5 | 1.52x |
| 2012 | 229.6 | 1.42x |
| 2016 | 240.0 | 1.35x |
| 2019 | 255.7 | 1.27x |
| 2023 | 304.7 | 1.07x |
| 2026 | ~325 | 1.00x |

Sources: [BLS CPI-U All Items, U.S. City Average](https://data.bls.gov/timeseries/CUUR0000SA0)
and [BLS CPI-U data tools](https://data.bls.gov/cgi-bin/surveymost?cu).

---

## Complete-drive unit-price series

These rows use complete HDD prices, not $/GB. In years where the source table
contains many drives, the row generally chooses a low advertised complete-drive
price that still represents a normal HDD product rather than a removable
cartridge or media-only item.

| Year | Nominal unit price | 2026 USD / unit | Product / datum | Source |
|---|---:|---:|---|---|
| 1980 | $4,199 | $16,500 | North Star 18 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1981 | $1,700 | $6,100 | Seagate 5 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1983 | $1,650 | $5,400 | Davong 10 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1984 | $1,075 | $3,400 | Pegasus / Great Lakes 10 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1985 | $710 | $2,100 | First Class Peripherals 10 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1987 | $899 | $2,600 | Iomega 10 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1988 | $799 | $2,200 | 20 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1989 | $899 | $2,400 | Western Digital 20 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1995 | $250 | $530 | 240 MB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1996 | $380 | $790 | IBM 1.76 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1997 | $280 | $570 | Western Digital 2.1 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1998 | $227 | $450 | Fujitsu 3.2 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 1999 | $140 | $270 | Fujitsu 6.4 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2000 | $144 | $270 | Maxtor 15.3 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2001 | $90 | $170 | Western Digital 40 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2002 | $90 | $160 | Western Digital 40 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2003 | $90 | $160 | Maxtor 40 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2004 | $98 | $170 | Maxtor 80 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2005 | $130 | $220 | Hitachi Deskstar 250 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2006 | $35 | $56 | Samsung 80 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2007 | $70 | $110 | Seagate 160 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2008 | $200 | $300 | Seagate 750 GB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2009 | $75 | $110 | Hitachi 1 TB | [mkomo.com](https://mkomo.com/cost-per-gigabyte) |
| 2010 | $64 | $95 | 1 TB external drive | [TechCrunch](https://techcrunch.com/2010/10/27/crunchdeals-1-tb-external-drive-for-64/) |
| 2011 | $90 | $130 | 1 TB notebook HDD, Pricewatch listing | [Pricewatch archive PDF](https://willus.com/archive/cpu/2011/pricewatch_harddrives_20110105.pdf) |
| 2012 | $190 | $270 | Seagate 4 TB retail MAP | [Seagate MAP list, May 2012](https://www.seagate.com/www-content/about/legal-privacy/en-us/docs/seagate-map-pricelist-rtl-asof-051312.pdf) |
| 2014 | $130 | $180 | Seagate / WD 4 TB external sale pricing | [9to5Toys](https://9to5toys.com/2014/04/08/seagate-expansion-4tb-usb-3-0-desktop-external-hard-drive-130-shipped-reg-220/), [Digital Deals](https://digitaldeals.net/index.php/2014/05/28/western-digital-4tb-my-book-usb-3-0-desktop-external-hard-drive-129-99/) |
| 2016 | $97 | $130 | WD 4 TB My Book sale pricing | [Canon Rumors](https://www.canonrumors.com/deal-wd-4tb-my-book-desktop-usb-3-0-external-hard-drive-97-reg-129/) |
| 2018 | $80 | $100 | WD Blue 4 TB internal HDD sale pricing | [PCWorld](https://www.pcworld.com/article/397938/massive-storage-at-a-miniature-price-this-4tb-wd-blue-hard-drive-is-80-at-newegg.html) |
| 2019 | $80 | $100 | 4 TB external mainstream price | [Forbes Vetted](https://www.forbes.com/sites/tjmccue/2019/08/19/the-best-4tb-external-hard-drives-under-100) |
| 2023 | $70 | $75 | Seagate IronWolf 4 TB early-2023 price cited in 2026 price survey | [Tom's Hardware](https://www.tomshardware.com/pc-components/hdds/hard-drive-prices-have-surged-by-an-average-of-46-percent-since-september-iconic-24tb-seagate-barracuda-now-usd500-as-ai-claims-another-victim) |
| 2026 | $70-100 | $70-100 | Entry 4 TB bulk-storage HDDs | [StorageDiskPrices](https://storagediskprices.com/hdd-prices/) |

---

## Interpretation

The unit-price picture is much less dramatic than the storage-density picture:

- The complete-drive mechanism fell from roughly **$16.5k in 2026 dollars** in
  1980 to the low hundreds by the early 2000s.
- Since the early 2000s, the cheap complete-drive floor has mostly lived around
  **$50-200 real** depending on sale timing, capacity class, and whether the
  quote is bare internal, external, refurbished, or enterprise.

That is the relevant distinction for the "mechanical movement" analogy. HDDs
kept getting far cheaper per byte because the same basic electromechanical
package stored vastly more data. The price of the physical precision assembly
itself did not fall by seven or eight orders of magnitude.

## Industry events and caveats

### HDD industry consolidation

HDD production is now concentrated in three suppliers: Seagate, Western Digital,
and Toshiba. That matters for interpreting the modern floor because price
movement reflects capacity allocation, cloud/datacenter demand, product mix,
and supplier discipline, not only manufacturing yield.

Sources: [Wikipedia: Hard disk drive](https://en.wikipedia.org/wiki/Hard_disk_drive),
[Mordor Intelligence HDD market report](https://www.mordorintelligence.com/industry-reports/hard-disk-drive-market).

## Notes on plot construction

- Y axis on `hdd_prices.png` is **2026 USD per complete drive** on a log scale.
- Dotted segments interpolate between discrete sourced price anchors.
- Capacity is shown only to identify the quoted drive. It is deliberately not
  normalized away, because the intended proxy is the complete mechanical
  assembly rather than storage.
- 2026 rows should be refreshed before publication because the HDD market was
  moving quickly in early 2026.
