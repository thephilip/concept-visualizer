# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ocp-visual-concepts

This project produces interactive, single-page HTML reference documents that explain OpenShift, ARO, ROSA, and OCP architectures and concepts for use by Red Hat Technical Support Engineers.

## What you are helping with

When a user asks you to create, update, or review a one-pager in this project, your job is to produce accurate, platform-scoped, interactive HTML reference documents following the spec in `guide.md`.

**Read `guide.md` before starting any new one-pager.** It defines the visual language, HTML/CSS conventions, accuracy rules, and page structure. Do not improvise a different design.

## Project layout

```
ocp-visual-concepts/
├── CLAUDE.md              ← you are here
├── README.md
├── guide.md               ← one-pager spec; read this before authoring
│
├── aro/
│   ├── CLAUDE.md          ← ARO-specific conventions; read for any ARO topic
│   └── outputs/           ← rendered HTML one-pagers
│   └── sources/           ← markdown source notes per one-pager
│
├── rosa/
│   ├── CLAUDE.md          ← ROSA-specific conventions; read for any ROSA topic
│   └── outputs/
│   └── sources/
│
└── ocp/
    ├── CLAUDE.md          ← OCP self-managed conventions; read for any OCP topic
    └── outputs/
    └── sources/
```

## Routing

| User asks about | Read before starting |
|---|---|
| ARO (Azure Red Hat OpenShift) | `guide.md` + `aro/CLAUDE.md` |
| ROSA Classic or ROSA HCP | `guide.md` + `rosa/CLAUDE.md` |
| Self-managed OCP | `guide.md` + `ocp/CLAUDE.md` |
| A concept spanning multiple platforms | `guide.md` + all relevant platform `CLAUDE.md` files |

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

There is no build system. Each output is a single `.html` file with no external dependencies — all CSS and JS are inline. Files are opened directly in a browser.

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

### Sources file convention

For each `outputs/topic.html`, create `sources/topic.md` listing every KCS article, docs URL, and Jira/bug reference used. Note the date accessed for any time-sensitive claims.
