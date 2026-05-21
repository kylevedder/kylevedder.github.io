HEADER {"page_name": "The runbook -- a shared memory for me and my coding agents", "teaser_img": "https://vedder.io/img/static/agent_runbook/header.png"}

# The runbook -- a shared memory for me and my coding agents

_TL;DR: A plain directory of markdown files, indexed by hand and written to by both me and my coding agents. Cheap, scrutable, survives across sessions._

A lot of my day-to-day ML research work lives outside any single git repo -- training jobs on a cluster, evaluation requests against a remote eval server, model dumps to object storage, ad hoc data preprocessing pipelines. Each of these has its own long-running side effects: Slurm job IDs, WandB runs, checkpoint paths, dataset versions. None of that fits naturally into a commit message or a PR description, and most of it is too verbose to keep in my head past the day it happened.

For a while my answer to this was `~/code/runbook.sh` -- a single shell file where I'd append a few lines of context plus the literal commands I'd just run, so that when I came back to the same project a week later I could grep my own history. That worked until the file hit ~25,000 tokens, which is about where a single file stops fitting cleanly into a coding agent's context window without paging through tools. At that point a runbook the agent can't load in one shot is much less useful than one it can.

I wanted something that was:

1. Plain text -- no database, no app, nothing to install or stand up
2. Cheap to append to -- both for me at the keyboard and for an agent at the end of a session
3. Cheap to load -- the part the agent reads on session start has to be small enough to fit in context without me thinking about it
4. Scrutable -- I can `cat` any file and read it like an English document
5. Persistent across sessions -- the next agent (or the next me, the next morning) can pick up where the previous one stopped

What I landed on is a directory of markdown files I call _the runbook_, plus one small convention layered on top.

## Layout

The whole thing lives at `~/code/runbook/`:

```
runbook/
├── index.md
├── templates.sh
├── references/
│   └── workflow_A.md
├── streams/
│   ├── workstream_001.md
│   ├── workstream_002.md
│   ├── workstream_003.md
│   └── ... + per-stream logs, .yaml, .py, .json artifacts
└── archive/
    ├── 2025/
    │   ├── index.md
    │   └── workstream_a01.md, workstream_a02.md, ...
    └── 2026/
        ├── index.md
        └── workstream_b01.md, workstream_b02.md, ...
```

Four categories, that's it:

- `index.md` is the manifest. It lists the currently active streams in a table (stream name, started, last updated, repo, one-line description), the canonical references, the recently completed streams, and the per-year archive indexes. It's intentionally small -- a single screen -- because this is the file the agent reads on every session start, and I want it cheap. The index also carries a short "Global Rules" section for org-wide policies, e.g. "Never set an evaluation request priority above Normal without my explicit instruction".
- `streams/` is where work in progress lives. One file per project / investigation. A stream file accretes notes, commands, job IDs, and short result summaries over its lifetime, and it can pull in adjacent artifacts (a `.yaml` for a job submission, a `.sh` monitor script, raw log captures) sitting next to it in the same folder.
- `references/` is where canonical "this is how we do X now" workflows live, separate from any single investigation. They're for stuff that is shared across many streams (e.g. the source of truth for a frequently-used data pipeline CLI), where I want to update one place instead of copying the same notes into every stream that touches it.
- `archive/YYYY/` is where streams go to die. When a stream is done, I (or the agent) move it under `archive/` and update both `index.md` _and_ the yearly archive index. The yearly index gives a one-line summary of every completed stream from that year without me having to open the full file.

There's also a `templates.sh` at the top level with reusable command patterns -- a GPU train submission, a model dump submission, a data-mix preview. It's the kind of stuff I'd otherwise paste between projects, and now I point at it.

The actual `index.md` is just markdown tables. Stripped down, it looks like this:

```
# Runbook

Command log for ML training, evaluation, and infrastructure work.
See [templates.sh](templates.sh) for reusable command patterns.

## Global Rules

- Never set an evaluation request priority above Normal without my explicit instruction.

## Active Streams

| Stream | Started | Updated | Repo | Description |
|--------|---------|---------|------|-------------|
| [workstream_001](streams/workstream_001.md) | 2026-05-19 | 2026-05-20 | monorepo | one-line description of the current investigation |
| [workstream_002](streams/workstream_002.md) | 2026-03-09 | 2026-04-12 | monorepo | another one-liner |
| [workstream_003](streams/workstream_003.md) | 2026-03-26 | 2026-05-04 | monorepo | another one-liner; older history lives in streams/workstream_003_cold.md |
| ... | | | | |

## References

- [workflow_A](references/workflow_A.md) -- one-line summary of what this canonical workflow covers

## Recently Completed

| Stream | Period | Repo | Key Outcome |
|--------|--------|------|-------------|
| [workstream_b01](archive/2026/workstream_b01.md) | Mar 23 - Apr 6 | monorepo | one-line outcome |
| [workstream_b02](archive/2026/workstream_b02.md) | Feb 10 - Mar 2 | monorepo | another one-line outcome |
| ... | | | |

## Archive Indexes

- [2025 archive](archive/2025/index.md) -- everything completed in 2025
- [2026 archive](archive/2026/index.md) -- everything completed so far in 2026
```

The "Active Streams" table is the only part the agent has to read carefully on every session start. Everything else is there so I can grep across years of completed work without paging through full files.

## The convention

The convention that ties this all together is a short block I keep in both my `~/CLAUDE.md` (loaded by Claude Code) and `~/.codex/AGENTS.md` (loaded by Codex), so the same agent-side rules apply no matter which CLI I'm in:

```
## Runbook

The runbook lives at `~/code/runbook/`. See `~/code/runbook/index.md` for the full manifest.

When running commands for training, evaluation, model dumps, or infrastructure:
1. Check `~/code/runbook/index.md` for existing streams related to your task
2. Log commands you run to the appropriate stream file in `~/code/runbook/streams/`
3. Use your actor ID in entries: `## YYYY-MM-DD [claude-opus] Description` or `[codex]` or `[claude-sonnet]`
4. Put commands in fenced ```sh blocks with narrative context above
5. If starting a new project, create a new stream file in `streams/` and add it to `index.md`
6. When a stream is complete, move it to `archive/YYYY/` and update both `index.md` and the yearly archive index
```

That's the whole protocol. It works because:

- The agent loads its instructions file before any user turn, so it knows the runbook exists and what the entry format is _before_ I ask it to do anything
- Loading `index.md` is its own step -- the agent only pays for the small manifest unless it actually needs to open a stream
- The actor tags (`[claude-opus]`, `[claude-sonnet]`, `[codex]`) in entry headers mean I can later tell which model wrote which note, and so can the next agent -- it can decide how much to trust an entry based on the tag
- The "move to archive when done" step keeps the active set small even after months of work

The runbook itself is _not_ in git -- it's a working scratchpad, not a deliverable. If I lose it I'm sad but nothing breaks. (It lives on a backed-up filesystem.)

## How it actually gets used

I have three months of session histories on disk to check -- 619 Claude Code sessions and 701 Codex sessions:

**Claude Code** -- 619 sessions, 41 (6.6%) touched the runbook in some way:

| | count |
|---|---|
| user-typed `runbook` mentions (non-boilerplate) | 52 |
| `Read` calls on a runbook file | 109 |
| `Bash` calls touching a runbook path | 56 |
| `Edit` / `Write` calls in the runbook | 99 |
| `Grep` / `Glob` calls touching the runbook | 28 |
| tool results that returned runbook content | 152 |
| sessions that wrote to the runbook | 12 |
| sessions that read from the runbook | 17 |

**Codex** -- 701 sessions, 84 (12%) touched the runbook. Codex shows up more often than Claude in this dataset because I use it for autonomous worker loops that grind through long-running stream files for hours at a time:

| | count |
|---|---|
| user-typed `runbook` mentions | 210 |
| agent tool calls touching the runbook | 2,714 |
| tool results containing runbook content | 1,383 |

The most-touched files: the current hot stream (`streams/workstream_003.md`, 47 sessions), `index.md` itself (45 sessions), the next active stream (`streams/workstream_002.md`, 41), and `templates.sh` (35). The long tail is archive files -- when the agent doesn't know how something was done before, it grep-walks the archive.

The piece I find most telling is the comparison between user mentions and agent reads. In the Claude Code data, I _typed_ the word `runbook` in only 52 user messages across 619 sessions, but the agent issued 109 `Read` calls on runbook files and 99 `Edit`/`Write` calls. I almost never have to remind the agent that the runbook exists -- it picks that up from the instructions file. But when I do mention it explicitly, my verbs are heavily skewed toward writing (16 "update", 7 "check", 4 "add", 4 "look"). I'm telling it to deposit information much more often than to retrieve it. The retrieval happens silently, as part of the agent's own context-gathering at the start of the next session.

## A sample entry

The metadata block at the top of an active stream file:

```
# Workstream 001 - <one-line topic>

- **Status:** active
- **Started:** 2026-05-19
- **Updated:** 2026-05-20
- **Repo:** monorepo
- **PR:** <link to the in-flight PR>
- **Description:** One paragraph describing the current goal and any hard constraints on what counts as a result.
```

Then in the body, sections like:

- Problem Statement -- one paragraph, plus a hard list of "do this, not that" constraints
- Baselines -- the literal artifact paths and any reference metadata I want at hand
- Current Harness -- the new files in the PR and a single-line invocation for the diagnostic
- Validation Run -- the Slurm job ID, the node, the output root, a results table, and the literal `jq` command to regenerate the table from `result.json`
- How To Run It -- the working `sbatch` wrap command, including any cluster-specific workarounds (e.g. nodes that don't have `bazel` on PATH and need a copied `bazelisk`)
- Correctness Contract -- the tolerance, the gate (which output goes against which reference), and what _not_ to use as the gate
- Operational Notes And Gotchas -- a bulleted list of dead jobs by ID with their failure modes (`77768, 77769: no GPU resource, CPU fallback/OOM`, `77796: .venv dependency mismatch`, ...)
- Current Bottom Line -- the few numbers that describe where the project currently stands

Every section is something a new agent (or new me) can pick up cold and act on without having to reconstruct context from chat logs.
