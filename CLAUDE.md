# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Concept Visualizer

This project produces interactive, single-page HTML reference documents that explain OpenShift, ARO, ROSA, and OCP architectures and concepts for use by Red Hat Technical Support Engineers.

## Primary workflow: `/visualize`

The `/visualize` slash command is the standard entry point for all one-pager work. It has four modes:

| Invocation | What it does |
|---|---|
| `/visualize` or `/visualize [topic]` | Create a new one-pager — reads spec, researches, builds HTML, then **auto-runs fact-check** before delivering |
| `/visualize compile` | Fact-checks new/modified files, then inlines assets and publishes to `docs/` |
| `/visualize fact-check [path]` | Manually verify an existing one-pager — checks links (parallel sub-agent if > 5) and factual claims against official sources |
| `/visualize internal [topic]` | Create an internal-only one-pager saved to `internal/outputs/` — never committed or published |

The full instructions for each mode are in `.claude/commands/visualize.md`. Read that file when running the command — do not reconstruct the workflow from memory.

## What you are helping with

When a user asks you to create, update, or review a one-pager in this project, your job is to produce accurate, platform-scoped, interactive HTML reference documents following the spec in `guide.md`.

**Read `guide.md` before starting any new one-pager.** It defines the visual language, HTML/CSS conventions, accuracy rules, and page structure. Do not improvise a different design.

## Project layout

```
concept-visualizer/
├── CLAUDE.md              ← you are here
├── README.md
├── guide.md               ← one-pager spec; read this before authoring
│
├── aro/
│   ├── CLAUDE.md          ← ARO-specific conventions; read for any ARO topic
│   └── outputs/           ← rendered HTML one-pagers
│   └── sources/           ← markdown source notes per one-pager
│
├── hcp/
│   ├── CLAUDE.md          ← HyperShift/HCP conventions; read for any HCP topic
│   └── outputs/           ← HCP one-pagers (ROSA HCP, ARO HCP, generic HCP)
│   └── sources/
│
├── rosa/
│   ├── CLAUDE.md          ← ROSA Classic conventions; read for ROSA Classic topics
│   └── outputs/
│   └── sources/
│
├── ocp/
│   ├── CLAUDE.md          ← OCP self-managed conventions; read for any OCP topic
│   └── outputs/
│   └── sources/
│
└── internal/              ← GITIGNORED — never committed or published
    ├── outputs/           ← internal-only HTML one-pagers (local access only)
    └── sources/           ← internal sources (may reference internal URLs/docs)
```

**`internal/` is gitignored.** Files there are never committed, never compiled into `docs/`, and never listed in the public index. Use `/visualize internal [topic]` to create content here. Source material may include internal Red Hat guidance (source.redhat.com, internal Jira, SBR routing docs) that cannot be publicly cited.

## Routing

| User asks about | Read before starting |
|---|---|
| ARO (Azure Red Hat OpenShift) Classic | `guide.md` + `aro/CLAUDE.md` |
| ARO HCP (Hosted Control Planes) | `guide.md` + `hcp/CLAUDE.md` + `aro/CLAUDE.md` |
| ROSA Classic | `guide.md` + `rosa/CLAUDE.md` |
| ROSA HCP | `guide.md` + `hcp/CLAUDE.md` |
| HyperShift / generic HCP concepts | `guide.md` + `hcp/CLAUDE.md` |
| Self-managed OCP | `guide.md` + `ocp/CLAUDE.md` |
| A concept spanning multiple platforms | `guide.md` + all relevant platform `CLAUDE.md` files |

**HCP content belongs in `hcp/`**, not in `rosa/` or `aro/`. ROSA Classic content belongs in `rosa/`. If content applies to all HCP variants (ROSA HCP, ARO HCP, Agent-based), scope it as Multi and save it in `hcp/`.

If you are unsure which platform a topic belongs to, ask before starting. Misscoping a one-pager (e.g. presenting ARO-specific behavior as universal) is the most common accuracy failure in this project.

## Accuracy rules (summary — full rules in `guide.md`)

- Use only official sources: `docs.redhat.com`, `docs.openshift.com`, `access.redhat.com/solutions/`, `learn.microsoft.com` (for ARO)
- Search before asserting anything platform-specific or version-gated
- Every one-pager that covers platform-specific content must include a scope banner
- No decorative badges — if a badge does not filter content, remove it

## Output checklist

Before delivering a completed one-pager, confirm:

- [ ] `guide.md` was read and spec was followed
- [ ] Platform `CLAUDE.md` was read for relevant conventions
- [ ] All platform-specific claims are scoped correctly
- [ ] A scope banner is present if content is not universal
- [ ] All sources used are listed in the corresponding `sources/` file
- [ ] KCS or docs link bar is present at the bottom of the HTML
- [ ] HTML file is saved to the correct `outputs/` directory
- [ ] Sources file is saved to the correct `sources/` directory

---

## HTML one-pager architecture

Source files in `*/outputs/` reference shared assets via relative paths. The `/visualize compile` command inlines and minifies those assets to produce self-contained files in `docs/diagrams/` for GitHub Pages deployment. Do not open source files and expect all features to work — compile first, then open from `docs/`.

### Key constraints

- Single `.html` file — no imports, no CDN links, no frameworks
- All styles in a `<style>` block in `<head>`; all interactivity in a `<script>` block at the end of `<body>`
- All colors via CSS variables in `:root`; never hardcode hex values elsewhere
- Dark background: `#0f1117` (body), `#161b26` (cards/panels), `#1e2435` (nested elements)
- Monospace font stack: `'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace`
- No gradients, no `box-shadow` (except focus rings), no blur effects

### Color semantics (CSS variables in `:root`)

Colors encode **layer meaning**, not visual decoration. Never assign colors to nodes arbitrarily.

| Color | Variable prefix | Meaning |
|---|---|---|
| Blue | `--blue-dim` / `--blue-border` | Kubernetes / OCP layer |
| Teal | `--teal-dim` / `--teal-border` | Node-level / infrastructure-specific |
| Amber | `--amber-dim` / `--amber-border` | Cloud provider / platform service |
| Purple | `--purple-dim` / `--purple-border` | Custom / private / customer-managed |
| Green | `--green-dim` / `--green-border` | External / internet |
| Red | `--red` | Warnings and gotchas |

### Page structure (top to bottom)

1. **Header** — title + one-line subtitle. No decorative badges.
2. **Scope banner** — amber, `⚠` prefix. Required for any platform-specific content.
3. **Legend** — colored swatches explaining color semantics for this diagram.
4. **Flow diagram** — horizontal left-to-right, clickable nodes (`onclick="selectNode('id')"`), arrows with short labels. Optional branch paths in a secondary row below.
5. **Detail panel** — fixed-height panel; shows placeholder by default; populates when a node is clicked (3–4 detail cards in a responsive grid).
6. **Reference cards** — 4-column responsive grid; topics: timing/behavior, config commands, cloud-specific facts, diagnostic commands.
7. **KCS / docs bar** — single-line blue bar at the bottom with KCS number, description, and link.

### Node shapes and their meaning

| Shape | CSS | Represents |
|---|---|---|
| Rounded rect | `border-radius: 10px` | Standard component (default) |
| Oval | `border-radius: 999px` | Cluster-internal service (e.g. CoreDNS) |
| Hexagon | `clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)` | Node-level forwarder / middleware |
| Cloud | `border-radius: 24px 24px 8px 8px` | Cloud provider service or internet |
| Trapezoid | `clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)` | Custom / external server |

All nodes: `cursor: pointer`, `transition: transform 0.15s` hover lift, `onclick="selectNode('id')"`.  
Active state: `border-color: var(--blue-border); box-shadow: 0 0 0 3px var(--blue-dim); animation: node-pulse 0.4s ease-out`.

### Detail card structure

Each card has `.detail-card-title` (10px, uppercase, 3–5 words) and `.detail-card-body` (12px, line-height 1.7).  
Inline formatting: `<code>` = amber text on slight amber background; `<span class="warn">` = red; `<span class="ok">` = green.  
Target: 4 cards per node covering role/purpose, key behavior, gotcha/failure mode, commands/references.

### Required `cv-*` meta tags

Every HTML one-pager must include these meta tags immediately after `<meta name="viewport">`. They are read by `/visualize build` to generate the index — files missing them are skipped by the build.

```html
<meta name="cv-title" content="[page title]">
<meta name="cv-description" content="[1–2 sentence description for the index card]">
<meta name="cv-platform" content="[ARO | ROSA HCP | ROSA Classic | OCP | Multi]">
<meta name="cv-tags" content="[comma-separated tags, e.g. ARO,DNS,Networking]">
<meta name="cv-accent" content="[blue | teal | amber | purple | green]">
```

`cv-accent` should match the dominant color of the diagram's main flow nodes.

### Build pipeline

`/visualize build` compiles all `*/outputs/*.html` into `build/diagrams/` and regenerates `build/index.html` as a GitHub Pages index. Card sort order: ARO → ROSA HCP → ROSA Classic → OCP → Multi.

### Sources file convention

For each `outputs/topic.html`, create `sources/topic.md` listing every KCS article, docs URL, and Jira/bug reference used. Note the date accessed and access status (public / paywalled) for any time-sensitive claims.
