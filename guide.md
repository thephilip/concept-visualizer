# Guide: Interactive OpenShift concept one-pagers

A reference for creating interactive, single-page HTML reference documents that explain OpenShift, ARO, ROSA, or OCP architectures and concepts. Designed to be pasted into Claude as a prompt prefix, or shared with teammates.

---

## What these are

Dark-themed, single-file HTML documents that combine:

- A **clickable flow diagram** showing how components relate
- An **interactive detail panel** that expands per-component notes when clicked
- **Reference cards** for quick-reference facts (commands, timings, gotchas)
- A **scope banner** when content is platform-specific (ARO vs. ROSA vs. OCP)
- A **source/KCS link bar** at the bottom

The output is a single `.html` file anyone can open in a browser with no dependencies.

---

## Prompt template

Paste this into Claude, fill in the bracketed sections, and attach any existing diagram images if you have them.

```
Create an interactive single-page HTML reference document explaining [CONCEPT/ARCHITECTURE].

Platform scope: [ARO / ROSA Classic / ROSA HCP / OCP / all — be specific]

[If attaching an image: "Here is an existing diagram from my colleague — use it as the
basis for the flow, fix any spelling/grammar errors, and expand with accurate details."]

[Optional: "Key components to include: X, Y, Z"]
[Optional: "Known gotchas or failure modes to highlight: ..."]
[Optional: "Relevant KCS or docs links: ..."]

Follow the one-pager spec below.
```

Then append the **Spec** section below.

---

## Spec

Include this verbatim when prompting Claude. It defines the visual language, accuracy rules, and structure.

---

### Visual design

Source files reference shared assets at `../../assets/style.css` and `../../assets/theme.js`. The compile step (`/visualize compile`) inlines these to produce self-contained files in `docs/diagrams/`. Do not embed a `<style>` block or duplicate the design system in source files — edit `assets/style.css` instead.

**Required `<head>` structure (source files):**

```html
<script>
  /* Prevent FOUC — apply theme before CSS renders */
  document.documentElement.setAttribute('data-theme',
    localStorage.getItem('cv-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );
</script>
<link rel="stylesheet" href="../../assets/style.css">
```

**Required nav bar (first element inside `<body>`):**

```html
<div class="nav-bar">
  <a href="../index.html" class="nav-link">← Concept Visualizer</a>
  <button id="theme-toggle" class="theme-btn" onclick="toggleTheme()">☾ Dark</button>
</div>
```

**Required script at end of `<body>` (after inline `nodeData`):**

```html
<script src="../../assets/theme.js"></script>
```

The design tokens (colors, radii, spacing) live in `assets/style.css` as CSS variables. Dark theme is `:root`; light theme overrides are `[data-theme="light"]`. Never hardcode hex values in source files.

- Monospace font stack: `'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace`
- No gradients, no box-shadows (except focus rings), no blur effects
- Border radius: `10px` standard, `14px` for outer cards
- Borders: `1px solid rgba(255,255,255,0.08)` default, `rgba(255,255,255,0.18)` on hover/active

**Color palette** (define in `:root`):

| Role | Variable | Value |
|---|---|---|
| Blue (K8s/OCP layer) | `--blue-dim` / `--blue-border` | `rgba(59,130,246,0.15)` / `rgba(59,130,246,0.35)` |
| Teal (node-level / infra) | `--teal-dim` / `--teal-border` | `rgba(20,184,166,0.12)` / `rgba(20,184,166,0.3)` |
| Amber (cloud DNS / platform) | `--amber-dim` / `--amber-border` | `rgba(245,158,11,0.12)` / `rgba(245,158,11,0.3)` |
| Purple (custom/private) | `--purple-dim` / `--purple-border` | `rgba(167,139,250,0.12)` / `rgba(167,139,250,0.3)` |
| Green (external/internet) | `--green-dim` / `--green-border` | `rgba(74,222,128,0.1)` / `rgba(74,222,128,0.25)` |
| Red (warnings) | `--red` | `#f87171` |

Colors encode **semantic meaning**, not sequence. Blue = Kubernetes/OCP layer. Teal = node-level or infrastructure-specific. Amber = cloud provider. Purple = custom/private. Green = external. Never cycle through colors decoratively.

---

### Page structure (top to bottom)

1. **Header** — title + one-line subtitle. No decorative badges unless they are interactive and filter content. Remove any badge that is purely decorative.

2. **Scope banner** (amber, `⚠` prefix) — required whenever content is platform-specific. State clearly what applies to which platform and what does not. Example: *"ARO-specific. The dnsmasq hop described here does not exist on ROSA or self-managed OCP."*

3. **Legend** — one line, colored swatches matching node colors, explaining what each color encodes.

4. **Flow diagram** — horizontal left-to-right flow of components connected by arrows with short labels. Nodes are clickable. A secondary row below the main flow shows optional/branch paths (e.g. custom DNS forwarder) with a vertical drop line and a dot connector.

5. **Detail panel** — a fixed-height panel below the diagram. Shows a placeholder hint by default. When a node is clicked: displays the node name with a colored dot, then 3–4 detail cards in a responsive grid.

6. **Reference cards** — a 4-column responsive grid of quick-reference cards. Each card covers a distinct topic: timing/behavior, config commands, cloud provider specifics, diagnostic commands.

7. **KCS / docs bar** — a single-line blue bar at the bottom with the relevant KCS article number, description, and a link.

---

### SVG-based diagrams (complex topologies)

For diagrams with more than ~5 nodes, cross-zone connections, bidirectional flows, or 2D layouts that don't fit a single horizontal row, use the SVG overlay approach instead of CSS flexbox arrows.

**Structure:**
```html
<div class="diagram-wrap">
  <!-- SVG defines container height via its height attribute -->
  <svg class="diagram-svg" width="900" height="[H]" viewBox="0 0 900 [H]">
    <!-- zone backgrounds, connection paths, labels -->
  </svg>
  <!-- Nodes overlay the SVG absolutely -->
  <div class="dn-layer">
    <div class="dn" style="left:[x]px;top:[y]px;width:[w]px;" onclick="selectNode('id')">
      <div class="node-box c-[color]" id="box-id">...</div>
    </div>
    ...
  </div>
</div>
```

**Required CSS (add in a `<style>` block in `<head>` alongside the shared asset link):**
```css
.diagram-wrap { position: relative; min-width: 900px; }
.diagram-svg  { display: block; pointer-events: none; overflow: visible; }
.dn-layer     { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.dn-layer .dn { pointer-events: all; }
.dn { position: absolute; cursor: pointer; transition: transform 0.15s; }
.dn:hover { transform: translateY(-2px); }
.dn:hover .node-box { border-color: var(--border-hi); }
.dn .node-box { width: 100%; min-width: unset; }
```

**Calculating diagram height — do this before writing the file:**

For each node, estimate its rendered height:
- Standard node (label + sub only): **~55px**
- Node with `oval` shape: **~50px**
- Node with a nested list (e.g. `.op-list` with 3 lines): **~120px**

Required height = `max(top + estimatedHeight)` across all nodes, **+ 20px bottom padding**.

Set `height="[H]"` and `viewBox="0 0 900 [H]"` on the SVG. Zone background rects use `height = H - 30`.

**Do not use a fixed `height` on `.diagram-wrap`** — the SVG block element sets the container height automatically and grows with content.

---

### Flow diagram nodes (simple linear flows)

Each node is a `<div class="node">` wrapping a `<div class="node-box c-{color}">` with:
- `.node-label` — component name, 12px bold, `white-space: nowrap`
- `.node-sub` — short descriptor, 10px muted, `white-space: nowrap`

Node shapes communicate layer:
- **Rounded rect** (default `border-radius: 10px`) — standard component
- **Oval** (`border-radius: 999px`) — cluster-internal service (e.g. CoreDNS)
- **Hexagon-like** (`clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)`) — node-level forwarder or middleware
- **Cloud** (`border-radius: 24px 24px 8px 8px`) — cloud provider service or internet
- **Trapezoid** (`clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)`) — custom/external server

Arrows: `flex: 1` flex children between nodes, with a `::after` triangle arrowhead. Include a short `.arrow-label` above the midpoint for the relationship name.

All nodes must be `cursor: pointer` with `transition: transform 0.15s` hover lift and `onclick="selectNode('id')"`.

Active state: `border-color: var(--blue-border); box-shadow: 0 0 0 3px var(--blue-dim); animation: node-pulse 0.4s ease-out`.

---

### Detail cards

Each detail card has:
- `.detail-card-title` — 10px, uppercase, letter-spacing, muted color. Keep to 3–5 words.
- `.detail-card-body` — 12px, muted text, line-height 1.7
- Inline `<code>` for commands/values: amber text, slight amber background
- `<span class="warn">` for gotchas: red text
- `<span class="ok">` for positive callouts: green text

4 cards per component is the target. Cover: role/purpose, key behavior or config, gotcha or failure mode, commands or references.

**`nodeData` structure** (defined in the page's inline `<script>` block, consumed by `selectNode` in `assets/theme.js`):

```js
const nodeData = {
  myNode: {
    dotClass: 'c-blue',   // one of: c-blue c-teal c-amber c-purple c-green
    title: 'Display name shown in detail panel header',
    cards: [
      { title: 'Card title (3–5 words, uppercase)', body: 'Card body HTML...' },
      ...
    ]
  },
  ...
};
```

Use `dotClass` — not a hardcoded hex `color` property — so the detail panel dot adapts to light/dark theme.

---

### Timeout / behavior timeline

When documenting a timing-sensitive failure mode, include a timeline row inside a reference card:

```html
<div class="timeline">
  <div class="tl-seg tl-ok"><div class="tl-label">Query sent</div><div class="tl-val">t=0</div></div>
  <div class="tl-seg tl-warn"><div class="tl-label">Timeout</div><div class="tl-val">~t=Xs</div></div>
  <div class="tl-seg tl-warn"><div class="tl-label">Blocked</div><div class="tl-val">+Xs</div></div>
  <div class="tl-seg tl-ok"><div class="tl-label">Retry</div><div class="tl-val">~t=Xs</div></div>
</div>
```

`.tl-ok` = green-tinted background. `.tl-warn` = red-tinted background.

---

### Accuracy rules

These are non-negotiable. Apply before writing any content.

1. **Scope every claim to the correct platform.** ARO, ROSA Classic, ROSA HCP, and self-managed OCP have architectural differences. Never label something as universal if it is platform-specific. If unsure, ask before writing.

2. **Use only official sources.** Red Hat documentation (`docs.redhat.com`, `docs.openshift.com`), KCS articles (`access.redhat.com/solutions/`), and Microsoft Learn (`learn.microsoft.com`) for ARO. No blogs, no Medium articles, no community wikis.

3. **Search before asserting.** If the accuracy of a detail is uncertain — especially platform-specific behavior, version gates, or component names — do a web search against official sources before including it. Do not guess.

4. **No decorative badges.** If a badge (ARO / ROSA / OCP) does not filter or change the page content interactively, remove it. A badge that just sits there implies the content applies to all labeled platforms, which is often wrong.

5. **Distinguish managed vs. self-managed concerns.** Note when a behavior is controlled by Red Hat SRE vs. the customer, and when a config path is available vs. restricted.

6. **Version-gate when needed.** If a feature or behavior is version-specific (e.g. only available from OCP 4.x), state the version. Do not assume the latest behavior applies universally.

---

### What makes a good topic

Good candidates:
- A flow with 4–7 discrete components that interact in sequence (e.g. DNS resolution, image pull, auth flow, upgrade process, CSI provisioning)
- A concept with a known platform-specific failure mode or gotcha that engineers keep re-explaining in cases
- An architecture that differs meaningfully between ARO / ROSA / OCP — the comparison itself is the value

Less suitable:
- Pure conceptual definitions with no flow (better as a wiki page)
- Topics that are identical across all platforms with no gotchas (low value-add over docs)
- Topics requiring frequent updates (the HTML file will go stale)

---

### Example topics

These would work well with this format:

- OVN-Kubernetes packet flow (pod → OVN → host → external)
- MachineConfig / MachineConfigPool apply cycle
- ROSA HCP control plane isolation and SRE access boundary
- CSI driver provisioning flow (PVC → StorageClass → Azure Disk / AWS EBS)
- OpenShift image pull flow (CRI-O → mirror → registry auth)
- OLM operator install and upgrade lifecycle
- ARO egress lockdown and gateway proxy architecture
- ROSA HCP PrivateLink network path

---

## Tips for getting the best result

- **Attach the existing diagram image** if one exists. Claude will use it as a structural reference and fix errors.
- **Name the failure mode** you want documented. The most useful one-pagers are built around a specific thing that goes wrong and why.
- **Paste in the relevant KCS number** if you know it — Claude will fetch the article and use it as a primary source rather than guessing.
- **Review the scope banner first** before sharing with a customer or teammate. If the banner is wrong or missing, the rest of the document may mislead.
- **Iterate on the detail cards**, not the diagram. The diagram structure is usually right on the first pass; the cards are where accuracy nuance lives.
