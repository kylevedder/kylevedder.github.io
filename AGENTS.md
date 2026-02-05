# Repo Architecture for Agents

This repository uses a custom build system to generate HTML files from Markdown.

## Important: Source vs Generated Files

- **Source files:** `*.md`, `_header.html`, `/build/*`, `/bibs/*`
- **Generated files:** Everything in `_site/` (never edit, never commit)
- **Static assets:** `/css/`, `/js/`, `/fonts/`, `/img/`, `/publications/`

## Build System

### Local Development
```bash
./preview.sh    # Build and serve at http://localhost:8000
```

### Build Only
```bash
./build.sh      # Build to _site/
```

### Deployment
Push to `master` branch. GitHub Actions automatically builds and deploys.

## File Structure
```
/                     # Source markdown files
/build/               # Build system (Python + preprocessors)
/bibs/                # BibTeX bibliography files
/css/, /js/, /fonts/  # Static assets (copied to _site/)
/img/                 # Images (copied to _site/)
/publications/        # PDFs (copied to _site/)
/_site/               # BUILD OUTPUT (gitignored)
```

## Adding New Pages
1. Create `pagename.md` in appropriate directory
2. Add HEADER preprocessor directive at top
3. Run `./preview.sh` to test locally
4. Commit the `.md` file only
