# Concept Visualizer

Interactive architecture diagrams for ARO, ROSA, HCP, and OCP — built for Technical Support Engineers.

**Live site:** [thephilip.github.io/concept-visualizer](https://thephilip.github.io/concept-visualizer/)

## What's in here

| Path | Purpose |
|---|---|
| `guide.md` | Spec for authoring new one-pagers — read this first |
| `assets/` | Shared CSS design system and JS (theme toggle, interactivity) |
| `aro/CLAUDE.md` | ARO Classic platform conventions, known KCS, gotchas |
| `hcp/CLAUDE.md` | HyperShift / HCP conventions (ROSA HCP, ARO HCP, Agent-based) |
| `rosa/CLAUDE.md` | ROSA Classic conventions |
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

| Command | What it does |
|---|---|
| `/visualize [topic]` | Create a new one-pager — auto fact-checks before delivering |
| `/visualize compile` | Fact-checks new/modified files, then publishes to `docs/` |
| `/visualize fact-check [file]` | Manually verify an existing page — parallel link check + factual claims |

## Platform routing

| Topic | Folder |
|---|---|
| ARO Classic (DNS, upgrades, identity) | `aro/` |
| ROSA HCP, ARO HCP, generic HyperShift | `hcp/` |
| ROSA Classic | `rosa/` |
| Self-managed OCP | `ocp/` |

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
| `aro/outputs/aro-networking.html` | ARO networking — Public/Internal LB, NSG, Private Link, egress SNAT | `aro/sources/aro-networking.md` |
| `aro/outputs/aro-vnet-peering.html` | ARO VNet peering — hub-and-spoke, NVA, gateway transit, UDR | `aro/sources/aro-vnet-peering.md` |

### HCP

| File | Topic | Sources |
|---|---|---|
| `hcp/outputs/hcp-konnectivity.html` | Konnectivity in HyperShift HCP — tunnel architecture, :8090/:8091, proxy sidecars | `hcp/sources/hcp-konnectivity.md` |
| `hcp/outputs/rosa-hcp-networking.html` | ROSA HCP networking — cross-account PrivateLink, egress, Route 53 | `hcp/sources/rosa-hcp-networking.md` |

### ROSA Classic

*None yet.*

### OCP

*None yet.*

## Maintainers

Philip Smith (florida_man) — initial structure and one-pagers
