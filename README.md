# ocp-visual-concepts

Interactive, single-page HTML reference documents explaining OpenShift, ARO, ROSA, and OCP architectures for Red Hat TSEs.

## What's in here

| Path | Purpose |
|---|---|
| `guide.md` | Spec for authoring new one-pagers — read this first |
| `aro/CLAUDE.md` | ARO platform conventions, known KCS, gotchas |
| `rosa/CLAUDE.md` | ROSA Classic and HCP conventions, known issues |
| `ocp/CLAUDE.md` | Self-managed OCP conventions |
| `{platform}/outputs/` | Rendered HTML one-pagers |
| `{platform}/sources/` | Markdown source notes — what each one-pager covers and what it was based on |

## Viewing a one-pager

Download the `.html` file from `outputs/` and open it in any browser. No server needed.

## Creating a new one-pager with Claude

1. Start a Claude session with this project attached (or paste the relevant files manually)
2. Claude will read `CLAUDE.md` (router), `guide.md` (spec), and the platform `CLAUDE.md`
3. Describe the concept you want documented and which platform(s) it applies to
4. Claude will research using official sources, build the HTML, and create a sources file

See `guide.md` for the full prompt template and authoring spec.

## Contributing

- HTML outputs go in `{platform}/outputs/`
- A corresponding sources file **must** accompany every new output in `{platform}/sources/`
- Sources files are plain markdown — see an existing one for the format
- Do not commit one-pagers that cover platform-specific behavior without a scope banner
- All content must be traceable to an official source (docs.redhat.com, docs.openshift.com, access.redhat.com/solutions/, learn.microsoft.com for ARO)

## Current one-pagers

### ARO

| File | Topic | Sources |
|---|---|---|
| `aro/outputs/aro-dns-flow.html` | ARO DNS resolution flow — pod → CoreDNS → dnsmasq → Azure DNS | `aro/sources/aro-dns-flow.md` |

### ROSA

*None yet.*

### OCP

*None yet.*

## Maintainers

Philip Smith (florida_man) — initial structure and ARO DNS one-pager
