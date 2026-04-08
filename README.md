# Concept Visualizer

Interactive architecture diagrams for ARO, ROSA, and OCP — built for Technical Support Engineers.

**Live site:** [thephilip.github.io/concept-visualizer](https://thephilip.github.io/concept-visualizer/)

## What's in here

| Path | Purpose |
|---|---|
| `guide.md` | Spec for authoring new one-pagers — read this first |
| `assets/` | Shared CSS design system and JS (theme toggle, interactivity) |
| `aro/CLAUDE.md` | ARO platform conventions, known KCS, gotchas |
| `rosa/CLAUDE.md` | ROSA Classic and HCP conventions, known issues |
| `ocp/CLAUDE.md` | Self-managed OCP conventions |
| `{platform}/outputs/` | Source HTML one-pagers (reference shared assets) |
| `{platform}/sources/` | Markdown source notes per one-pager |
| `docs/` | Compiled, self-contained outputs — served by GitHub Pages |

## Viewing

The live site is at the link above. Individual compiled pages are also fully self-contained and can be downloaded from `docs/diagrams/` and opened in any browser with no server needed.

## Creating a new one-pager

Use the `/visualize` slash command in Claude Code:

```
/visualize [topic description]
```

Claude will display a help banner, read the spec and platform conventions, research official sources, confirm scope, and build the HTML. You can also **attach a screenshot or existing flowchart** — Claude will use it as the structural basis for the diagram.

Sub-commands:

| Command | What it does |
|---|---|
| `/visualize [topic]` | Create a new one-pager |
| `/visualize compile` | Inline assets, minify, and publish to `docs/` |
| `/visualize fact-check [file]` | Verify accuracy against official sources |

## Contributing

- Source HTML goes in `{platform}/outputs/`
- A corresponding sources file **must** accompany every output in `{platform}/sources/`
- Do not commit one-pagers with platform-specific content without a scope banner
- All claims must be traceable to an official source (`docs.redhat.com`, `docs.openshift.com`, `access.redhat.com/solutions/`, `learn.microsoft.com` for ARO)
- Run `/visualize compile` and commit the updated `docs/` before pushing

## Current one-pagers

### ARO

| File | Topic | Sources |
|---|---|---|
| `aro/outputs/aro-dns-flow.html` | ARO DNS resolution flow — pod → CoreDNS → dnsmasq → Azure DNS | `aro/sources/aro-dns-flow.md` |

### ROSA

| File | Topic | Sources |
|---|---|---|
| `rosa/outputs/rosa-hcp-networking.html` | ROSA HCP networking — cross-account PrivateLink, egress, Route 53 | `rosa/sources/rosa-hcp-networking.md` |

### OCP

*None yet.*

## Maintainers

Philip Smith (florida_man) — initial structure and one-pagers
