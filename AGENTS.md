# Repo Architecture for Agents

This repository uses a custom build system to generate HTML files from Markdown and other sources.

**IMPORTANT:** Do not edit HTML files directly. They are generated artifacts.

## Build System

To build the site, run the following command from the root of the repository:

```bash
./build.sh
```

This script handles:
- Pre-processing of content
- Conversion of Markdown to HTML
- Post-processing (e.g., headers, footers, includes)

Always run `./build.sh` after making changes to source files (e.g., `.md`, `_header.html`, python scripts) to ensure the HTML is up to date.
