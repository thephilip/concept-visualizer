# /visualize

**When this skill is invoked, output this banner first — before anything else:**

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🔭  Concept Visualizer                                 ║
║                                                          ║
║   Interactive architecture diagrams for ARO, ROSA, OCP  ║
║                                                          ║
║   /visualize [topic]       →  create a new one-pager    ║
║   /visualize compile       →  publish to GitHub Pages   ║
║   /visualize fact-check    →  verify accuracy           ║
║                                                          ║
║   💡 Tip: attach a screenshot or flowchart and Claude   ║
║      will use it as the basis for the diagram layout.   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

You are helping create, maintain, publish, and fact-check interactive HTML one-pager diagrams for the **Concept Visualizer** project — a collection of interactive architecture reference documents for Red Hat Technical Support Engineers covering ARO, ROSA, and self-managed OCP topics.

The user invoked `/visualize` with these arguments: **$ARGUMENTS**

---

## Route the request

Parse `$ARGUMENTS` and branch to the appropriate section:

- If `$ARGUMENTS` is **empty** → ask the user what topic and platform they want to document, then follow **[Generate]**
- If `$ARGUMENTS` begins with a topic description (not a sub-command keyword) → follow **[Generate]**
- If `$ARGUMENTS` starts with `build` → follow **[Build]**
- If `$ARGUMENTS` starts with `compile` → follow **[Compile]**
- If `$ARGUMENTS` starts with `fact-check` → follow **[Fact-check]**
- If `$ARGUMENTS` starts with `internal` → follow **[Internal]**

---

## [Generate] — Create a new one-pager

> **💡 Got a diagram image?** If the user has attached a screenshot, whiteboard photo, or existing flowchart, use it as the structural basis for the flow — preserve the component layout and flow direction, correct any spelling/label errors, and expand with accurate detail cards. Skip to Step 3 after reading the spec files.

### Step 1: Read the spec and platform conventions

Before writing any HTML, read these files:

1. `guide.md` — full visual spec: HTML structure, CSS conventions, color semantics, node shapes, accuracy rules. Do not skip this.
2. The platform `CLAUDE.md` matching the topic:
   - ARO → `aro/CLAUDE.md`
   - ROSA (Classic or HCP) → `rosa/CLAUDE.md`
   - Self-managed OCP → `ocp/CLAUDE.md`
   - Multi-platform → all relevant CLAUDE.md files

### Step 2: Research

Search official sources before writing any content. Permitted sources only:

- `docs.redhat.com`
- `docs.openshift.com`
- `access.redhat.com/solutions/`
- `learn.microsoft.com` (ARO topics only)

For any KCS articles you believe are relevant:
- Check whether they are publicly accessible or paywalled
- Report the access status to the user before proceeding — do not cite a paywalled article without flagging it

Do not assert platform-specific behavior, version gates, or component names that you have not confirmed from an official source. Search first, write second.

### Step 3: Confirm scope with the user

Before writing HTML, confirm:

- Which platform(s) the topic covers (ARO / ROSA Classic / ROSA HCP / OCP / multi)
- Whether to anchor the diagram around a specific failure mode, a flow, or broad topology
- Any specific KCS numbers or docs the user wants prioritized
- Whether there is an existing diagram image to use as a structural reference

### Step 4: Build the HTML

Follow `guide.md` exactly. Key constraints:

- Single `.html` file — no external dependencies, all CSS and JS inline
- Dark theme: `#0f1117` body, `#161b26` cards, `#1e2435` nested elements
- All colors via CSS variables in `:root` — never hardcode hex outside `:root`
- Monospace font stack: `'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace`
- No gradients, no box-shadows except focus rings, no blur
- Color semantics: blue=OCP/K8s layer, teal=node-level/infra, amber=cloud provider, purple=custom/customer-managed, green=external/internet, red=warnings

**Page structure (top to bottom):**
1. Header — title + one-line subtitle, no decorative badges
2. Scope banner (amber, `⚠` prefix) — required whenever content is platform-specific
3. Legend — colored swatches explaining color semantics for this diagram
4. Flow diagram — 4–7 clickable nodes, left-to-right, arrows with short labels; optional secondary row for branch paths
5. Detail panel — fixed-height, shows placeholder until a node is clicked; 3–4 detail cards per node
6. Reference cards — 4-column responsive grid covering timing/behavior, config commands, cloud-specific facts, diagnostic commands
7. KCS/docs bar — single-line blue bar at bottom with link(s)

**Add these `<meta>` tags in `<head>`, immediately after `<meta name="viewport">`:***

```html
<meta name="cv-title" content="[page title — matches <title> tag]">
<meta name="cv-description" content="[1–2 sentence description for the index card]">
<meta name="cv-platform" content="[ARO | ROSA HCP | ROSA Classic | OCP | Multi]">
<meta name="cv-tags" content="[comma-separated tags, e.g. ARO,DNS,Networking]">
<meta name="cv-accent" content="[blue | teal | amber | purple | green]">
```

Choose `cv-accent` to match the dominant color of the diagram's main flow nodes.

### Step 4b: Layout verification (SVG diagrams only)

Before saving, verify that no node overflows the diagram bounds.

For each `.dn` node, extract `top` and `width` from its inline `style`. Estimate rendered height:
- Standard node (label + sub): **55px**
- Oval node: **50px**
- Node with a nested list (`.op-list`, extra content beyond label+sub): **120px**

Calculate: `requiredHeight = max(top + estimatedHeight) + 30`

Compare to the SVG `height` attribute. If `requiredHeight > svgHeight`:
1. Update the SVG `height` attribute and `viewBox` height to `requiredHeight`
2. Update zone background rect heights to `requiredHeight - 30`
3. Fix the diagram before saving — do not leave overflow in place

Report the layout check result: list each node's `top + estimatedHeight` and confirm the SVG height is sufficient.

### Step 5: Save files

- **HTML** → correct platform `outputs/` directory  
  e.g. `rosa/outputs/rosa-hcp-dns.html`
- **Sources** → correct platform `sources/` directory  
  e.g. `rosa/sources/rosa-hcp-dns.md`

The sources file must list every URL and KCS article used, with access status (public / paywalled) and the date verified. Flag any time-sensitive claims that may need re-verification.

### Step 5b: Automatic fact-check (post-build, pre-deliver)

After saving the HTML and sources files, automatically run a fact-check on the newly created file before delivering it to the user. Follow the **[Fact-check]** steps exactly — extract all links and claims, verify links (using the sub-agent if > 5 links), and report findings.

Present the fact-check results to the user alongside the completed diagram. If any **Incorrect** or **Dead** issues are found, fix them before considering the page ready. If only **Unverified** items remain, note them and let the user decide.

Do not run `/visualize compile` until the user confirms they are satisfied with the fact-check results.

### Output checklist before delivering

- [ ] `guide.md` read and spec followed
- [ ] Platform `CLAUDE.md` read
- [ ] All platform-specific claims scoped correctly
- [ ] Scope banner present if content is not universal
- [ ] `cv-*` meta tags present in `<head>`
- [ ] Sources file saved to the correct `sources/` directory
- [ ] KCS/docs bar present at the bottom of the HTML
- [ ] HTML saved to the correct `outputs/` directory
- [ ] **Sensitive data scan passed** — no customer data or RH-internal references in HTML or sources file
- [ ] Fact-check passed — no Incorrect or Dead findings outstanding

---

## [Build] — Compile all outputs to `docs/`

Compile every one-pager in the project into the `docs/` directory for GitHub Pages deployment.

### Step 1: Discover all one-pagers

Glob all files matching `*/outputs/*.html`. For each file, read the `cv-*` meta tags from `<head>`:

- `cv-title` — card title
- `cv-description` — card description text
- `cv-platform` — platform label (ARO / ROSA HCP / ROSA Classic / OCP / Multi)
- `cv-tags` — comma-separated tag list
- `cv-accent` — accent color variable name (e.g. `blue` → `var(--blue)`)

If any file is missing `cv-*` tags, report it to the user and skip it (do not guess values).

### Step 2: Copy files to `docs/diagrams/`

Create `docs/diagrams/` if it does not exist. Copy each discovered HTML file into it, preserving the original filename.

### Step 3: Generate `docs/index.html`

Generate the Concept Visualizer index using the template below. For each discovered one-pager, insert a `<a class="card">` block with the extracted metadata.

**Card sort order:** ARO first, then ROSA HCP, then ROSA Classic, then OCP, then Multi.

For each card:
- `href` → `diagrams/[filename].html`
- `data-platform` → `cv-platform` value (used by the platform filter buttons)
- `.card-accent` background → `var(--[cv-accent])`
- `.card-title` → `cv-title` value
- `.card-desc` → `cv-description` value
- `.tag` elements → one per value in `cv-tags`

**Index template — fill in `<!-- CARDS -->` with generated card HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Concept Visualizer</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f1117; --bg2: #161b26; --bg3: #1e2435;
    --border: rgba(255,255,255,0.08); --border-hi: rgba(255,255,255,0.18);
    --text: #e2e8f0; --text-muted: #8892a4; --text-dim: #5a6478;
    --blue: #3b82f6; --teal: #14b8a6; --amber: #f59e0b;
    --purple: #a78bfa; --green: #4ade80;
    --radius: 10px; --radius-lg: 14px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'SF Mono','Fira Code','Cascadia Code',ui-monospace,monospace; font-size: 13px; line-height: 1.6; min-height: 100vh; padding: 48px 24px; }
  .container { max-width: 960px; margin: 0 auto; }
  .site-header { margin-bottom: 48px; text-align: center; }
  .site-title { font-size: 24px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; margin-bottom: 8px; }
  .site-subtitle { font-size: 13px; color: var(--text-muted); max-width: 480px; margin: 0 auto; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; gap: 12px; }
  .card:hover { border-color: var(--border-hi); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .card-accent { width: 36px; height: 4px; border-radius: 2px; }
  .card-title { font-size: 16px; font-weight: 600; color: var(--text); letter-spacing: -0.3px; }
  .card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.7; }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: auto; }
  .tag { font-size: 10px; padding: 3px 8px; border-radius: 4px; background: var(--bg3); color: var(--text-dim); border: 1px solid var(--border); }
  .card-arrow { font-size: 12px; color: var(--text-dim); margin-top: 4px; transition: color 0.2s; }
  .card:hover .card-arrow { color: var(--text-muted); }
  .footer { margin-top: 64px; text-align: center; font-size: 11px; color: var(--text-dim); }
  .footer a { color: var(--text-dim); text-decoration: none; border-bottom: 1px solid var(--border); }
  .footer a:hover { color: var(--text-muted); }
</style>
</head>
<body>
<div class="container">
  <div class="site-header">
    <div class="site-title">Concept Visualizer</div>
    <div class="site-subtitle">Interactive architecture and flow diagrams for ARO, ROSA, and OpenShift troubleshooting</div>
  </div>
  <div class="card-grid">
    <!-- CARDS -->
  </div>
  <div class="footer">
    <a href="https://github.com/thephilip/concept-visualizer" target="_blank">View on GitHub</a>
  </div>
</div>
</body>
</html>
```

Replace `GITHUB_REPO` with the actual `owner/repo` path. If the git remote is already set, read it with `git remote get-url origin` and extract the owner/repo.

**Important:** The index template also includes a help modal (Using / Creating / Contributing tabs) and updated header layout. When regenerating `docs/index.html`, read the current `docs/index.html` and preserve the modal HTML, CSS, and JS exactly — only update the card grid contents. Do not reconstruct the modal from scratch.

### Step 4: Report

List every file copied to `docs/diagrams/`, confirm `docs/index.html` was written, and show the card titles that were generated. If any `*/outputs/*.html` files were skipped due to missing `cv-*` tags, list them so the user can fix them.

---

## [Compile] — Produce self-contained, minified outputs for deployment

Compile every source one-pager into a fully self-contained single HTML file in `docs/diagrams/`, then regenerate `docs/index.html`. This is the step that publishes to GitHub Pages.

### Step 1: Read shared assets

Read `assets/style.css` and `assets/theme.js` in full. These will be inlined into every output file.

### Step 2: Discover source files

Glob all `*/outputs/*.html`. For each file, read the `cv-*` meta tags. Skip any file missing required tags and report it to the user.

**Always exclude `internal/outputs/` from this glob.** Internal documents are never compiled to `docs/` and never appear in the public index. If the glob returns any path beginning with `internal/`, skip it silently.

### Step 3: Compile each file

For each source file:

1. Read the full HTML.
2. Replace `<link rel="stylesheet" href="../../assets/style.css">` with `<style>[contents of style.css]</style>`.
3. Replace `<script src="../../assets/theme.js"></script>` with `<script>[contents of theme.js]</script>`.
4. Rewrite the nav bar back-link: replace `href="../index.html"` with `href="../index.html"` (already correct for `docs/diagrams/` location — no change needed).
5. Apply basic minification:
   - Strip CSS comments (`/* ... */`)
   - Strip HTML comments (`<!-- ... -->`) except `<!DOCTYPE`
   - Collapse runs of whitespace in CSS/JS to single spaces (preserve content inside string literals)
   - Do **not** mangle variable names or alter HTML content/attributes
6. Write the result to `docs/diagrams/[original-filename].html`.

### Step 4: Regenerate `docs/index.html`

Follow the same index generation logic as **[Build]** — read `cv-*` tags from the compiled files, generate cards, write `docs/index.html`. The index template is in the **[Build]** section.

The index page should also include the theme toggle. Add this immediately after `<body>` in the index:

```html
<script>
  document.documentElement.setAttribute('data-theme',
    localStorage.getItem('cv-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );
</script>
```

And add a theme toggle button in the site header:

```html
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:48px;">
  <div class="site-header" style="margin-bottom:0;">...</div>
  <button id="theme-toggle" onclick="toggleTheme()" style="font-family:inherit;font-size:11px;color:var(--text-dim);background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;">☾ Dark</button>
</div>
```

Inline `assets/theme.js` at the end of `<body>` in the index as well (only the theme toggle portion — omit `selectNode` which is for one-pagers only).

### Step 4b: Pre-compile fact-check (new or modified files only)

Before compiling, identify which source files have been modified since their last compile by comparing git status or file modification times. For each modified or new file:

1. Run a fact-check (following **[Fact-check]** steps) on the source file — this includes the sensitive data scan (Step 2b).
2. Use the sub-agent for link verification if the file has > 5 external links.
3. If any **sensitive data** is found, **halt compilation for that file** immediately — do not compile until the user approves redactions and the data is removed from both the HTML and sources file.
4. If any **Incorrect** or **Dead** findings are found, report them and **halt compilation for that file** — do not compile until the user approves or fixes the issues.
5. If only **Unverified** items are found, note them in the compile report and proceed.

Skip fact-check for files that have not changed since their last compile (no need to re-verify unchanged content).

### Step 4c: Layout verification (SVG diagrams)

Before writing each compiled file, check for node overflow. For any source file containing `.dn-layer`:

Extract each `.dn` node's `top` and `width` from inline styles. Estimate height:
- Standard node (label + 1-line sub): **60px** · Oval: **55px** · Node with extra content (`.op-list` with 3 entries): **180px**

If `max(top + estimatedHeight) + 20 > svgHeight`, fix the SVG `height`, `viewBox`, and zone rect heights in the compiled output before writing. Report any corrections made.

### Step 4d: Generate `docs/manifest.json`

After writing all compiled files and `docs/index.html`, generate a machine-readable registry at `docs/manifest.json`.

For each compiled diagram (in the same sort order as the index cards), write one entry:

```json
{
  "diagrams": [
    {
      "file": "[filename].html",
      "title": "[cv-title]",
      "description": "[cv-description]",
      "platform": "[cv-platform]",
      "tags": ["tag1", "tag2"],
      "accent": "[cv-accent]",
      "source": "[platform]/outputs/[filename].html",
      "author": "[git log --follow --format='%an' -- [source file] | tail -1]",
      "compiledAt": "[today's date, YYYY-MM-DD]"
    }
  ]
}
```

- `file` — filename only (no path), as it appears in `docs/diagrams/`
- `source` — relative path to the original `*/outputs/` source file
- `author` — from `git log` on the source file; use `"unknown"` if unavailable
- `compiledAt` — today's date in `YYYY-MM-DD` format
- `tags` — array split from the comma-separated `cv-tags` value

### Step 5: Report

List every file written to `docs/diagrams/`, confirm `docs/index.html` and `docs/manifest.json` were written, note the pre/post file sizes if meaningful, and list any corrections made by the layout check or skipped files.

---

## [Fact-check] — Verify accuracy of an existing one-pager

**Arguments format:** `fact-check [path/to/file.html]`  
If no path is given, check the most recently modified HTML file in any `*/outputs/` directory.

### Step 1: Identify and read the file

Read the specified file. Also read the corresponding sources file in the matching `sources/` directory if it exists.

### Step 2: Extract all factual claims and links

Extract two things:

**Factual claims** — every specific assertion in the file: component names, behaviors, timeouts, CIDR defaults, CLI flag names, version gates, KCS article numbers and their described content, scope assertions (e.g. "ARO-specific", "does not apply to ROSA"), and any "does not exist on X platform" claims.

**All links** — every `href` in the file that points to an external URL (skip `#` anchors and relative paths). List them with their link text.

### Step 2b: Sensitive data scan

Before verifying links or claims, scan **both the HTML file and its corresponding sources file** for customer data and RH-internal information that must not appear in a public repository.

**Patterns to flag:**

| Category | Pattern | Example of a bad match |
|----------|---------|------------------------|
| SFDC case number | 8-digit number starting with `0`, near words like "case", "sfdc", "ticket" | `case 04421211` |
| AWS account ID in ARN | 12-digit number in an ARN (`arn:aws:...::<digits>:`) where the number is not a `<placeholder>` | `arn:aws:iam::407690150649:role/...` |
| Real OIDC config ID | Long alphanumeric string (>12 chars) in an OIDC provider path (`oidc.op1.openshiftapps.com/<id>`) rather than a `<config-id>` placeholder | `oidc.op1.openshiftapps.com/2f5rumespe9uc54vlemug5jnso7c33qj` |
| Customer cluster name in resource path | A specific cluster name embedded in an ARN, resource ID, or hosted zone path (not a generic `<cluster-name>` placeholder) | `rosa-qa-cluster-kube-system-control-plane-operator` in an ARN |
| Customer Azure subscription/tenant ID | UUID appearing in an Azure resource path (`/subscriptions/<uuid>/`) | `/subscriptions/a1b2c3d4-.../` |
| Customer AWS hosted zone ID | `Z` followed by alphanumeric chars in a Route53 zone reference, not a placeholder | `Z015168816UEPMRCE7QS8` |
| RH-internal URL | Hostnames under `corp.redhat.com`, `mojo.redhat.com`, `source.redhat.com`, `issues.redhat.com` (internal Jira), `pagerduty.redhat.com` | `issues.redhat.com/browse/OCPBUGS-...` |

**What counts as a placeholder (safe — do not flag):**
- Text in angle brackets: `<cluster-name>`, `<account-id>`, `<config-id>`, `<zone-id>`
- Generic example names used in documentation: `my-cluster`, `rosa-cluster`, `example.com`
- Hex color values in CSS: `#0f1117`, `rgba(...)` — not account IDs

**If any sensitive data is found:**
1. List every match in the report under a **Sensitive Data** section (see Step 5).
2. Suggest a redacted replacement for each match (e.g. replace the real account ID with `<account-id>`, replace the real OIDC config ID with `<oidc-config-id>`).
3. **Block delivery** — do not present the file as ready until the user approves the redactions or confirms each match is a false positive.
4. If approved, apply the redactions to both the HTML and sources file before proceeding (see Step 6).

If no sensitive data is found, note "No sensitive data found" and continue.

### Step 3: Verify links

Count the external URLs extracted in Step 2.

**If count > 5 — spawn a research sub-agent for parallel verification:**

Launch a general-purpose sub-agent with this prompt (substituting the actual URL list):

> You are a link verification agent. For each URL in the list below, fetch it and return its HTTP status. Report back as a JSON array: `[{"url": "...", "status": "Live|Redirected|Dead", "resolvedUrl": "...or null"}]`. Resolved URL is only needed if the URL redirected to a different location. URLs: [paste full list here]

Wait for the sub-agent to return results, then use them to build the links report. If the sub-agent is unavailable or fails, fall back to sequential verification.

**If count ≤ 5 — verify links inline sequentially** (no sub-agent overhead).

For any dead or redirected links, search official sources to find the correct replacement URL before reporting.

| Status | Meaning |
|---|---|
| **Live** | URL returns 2xx — include the resolved URL if it redirected |
| **Redirected** | URL redirected — note the new URL so the source can be updated |
| **Dead** | URL returns 4xx/5xx — needs replacing |

### Step 4: Verify factual claims against official sources

For each claim, search official sources to confirm:

- `docs.redhat.com`, `docs.openshift.com`, `access.redhat.com/solutions/`, `learn.microsoft.com` (ARO)
- Check that cited KCS numbers exist and that the article's content matches what the one-pager claims
- Check whether version-gated claims are still accurate for the currently supported OCP versions

### Step 5: Report findings

Return a structured report in three sections:

**Sensitive data** (Step 2b results — report first, block delivery if any findings):

| Location | Match | Category | Suggested replacement |
|----------|-------|----------|-----------------------|
| `sources/file.md:33` | `case 04421211` | SFDC case number | remove or replace with `<internal reference>` |

If no sensitive data was found: state "No sensitive data found" and proceed.

**Links:**

| URL | Link text | Status | Action |
|---|---|---|---|
| ... | ... | Live / Redirected / Dead | Replace with: [new URL] |

**Factual claims** — grouped into four categories:

| Category | Meaning |
|---|---|
| **Verified** | Confirmed against an official source — include the URL |
| **Outdated** | Was accurate but appears to have changed — include what changed |
| **Unverified** | Could not be confirmed from an official source — not necessarily wrong, but unsourced |
| **Incorrect** | Contradicted by an official source — include the correct information and source URL |

Do not edit the file until the user approves corrections. If sensitive data was found, that must be resolved before any other corrections are applied.

### Step 6: Apply corrections (if approved)

If the user approves, apply in this order:
1. Redact any sensitive data from both the HTML file and sources file.
2. Fix dead links and incorrect claims.
3. Update the corresponding `sources/` file to reflect all changes and note the date re-verified.

---

## [Issue] — Open a GitHub tracking issue for a new diagram

> **⚠ Not yet implemented.** This section defines the gate and content for the future auto-issue feature referenced in the help modal. Do not attempt to open issues yet — wire this up once the feature is built.

When implemented, this step will run automatically after a new one-pager is compiled and pushed. It must **not** be triggered unless all of the following are true:

### Prerequisites (hard gates — all must pass before opening an issue)

- [ ] The diagram has been through **[Fact-check]**, including the sensitive data scan (Step 2b)
- [ ] **No sensitive data findings** remain — all customer data and RH-internal references have been removed from both the HTML and sources file
- [ ] **No Incorrect or Dead link findings** remain — all fact-check issues resolved or explicitly acknowledged by the user
- [ ] The file has been **compiled** (`/visualize compile`) and exists in `docs/diagrams/`
- [ ] The compiled file has been **pushed** to the remote `main` branch

If any gate fails, do not open an issue. Report which gate failed and what must be resolved first.

### Issue content (when implemented)

Create a GitHub issue on `thephilip/concept-visualizer` with:

- **Title:** `[diagram] <cv-title>`
- **Body:**
  ```
  ## New diagram: <cv-title>

  **Platform:** <cv-platform>
  **Tags:** <cv-tags>

  <cv-description>

  **Live:** https://thephilip.github.io/concept-visualizer/diagrams/<filename>.html

  **Source:** <platform>/outputs/<filename>.html

  ---
  Fact-check status: passed (no Incorrect, Dead, or sensitive data findings)
  Compiled: <compiledAt>
  ```
- **Labels:** `diagram`, `<platform-lowercase>` (e.g. `rosa-hcp`)

Do not include case numbers, customer names, or any other data that would fail the sensitive data scan.

---

## [Internal] — Create or manage an internal-only one-pager

Internal documents live in `internal/outputs/` and `internal/sources/`. They are gitignored and never committed to the public repository, never compiled into `docs/`, and never listed in the public index.

**When to use this path:**
- Source material is from an internal source (source.redhat.com, internal Jira, internal Confluence, internal Slack discussions)
- Content includes RH-internal organizational guidance (SBR routing, team ownership, escalation paths)
- Content references internal case numbers or customer-identifiable data that cannot be fully redacted without losing meaning
- The audience is Red Hat engineers only — not suitable for public or customer-facing use

### Step 1: Read the spec

Read `guide.md` as normal — internal documents follow the same visual spec. Also read the relevant platform `CLAUDE.md` if the topic is platform-specific.

### Step 2: Source material handling

Internal source material (pasted article text, internal diagrams, screenshots) may be used freely. Do **not** include:
- Verbatim SFDC case numbers in the HTML or sources file (summarize the scenario instead)
- Customer-identifiable data of any kind
- Internal URLs as clickable links in the HTML (they won't work for anyone without VPN/auth)

In the sources file, cite internal documents as:
```
| Internal: [document title] | [brief description] | Internal (not publicly accessible) | [date] |
```

### Step 3: Build the HTML

Follow the same spec as [Generate] Step 4. Add one additional meta tag to mark the file as internal:

```html
<meta name="cv-internal" content="true">
```

Also add a prominent banner at the very top of the page body (above the nav bar), distinct from the scope banner:

```html
<div style="background:#1a0a0a;border-bottom:2px solid #f87171;padding:8px 16px;font-size:11px;color:#f87171;text-align:center;letter-spacing:0.05em;">
  🔒 INTERNAL — Red Hat engineers only. Do not share externally or link publicly.
</div>
```

### Step 4: Save files

- **HTML** → `internal/outputs/[filename].html`
- **Sources** → `internal/sources/[filename].md`

These paths are gitignored. The files will not be committed, compiled, or indexed.

### Step 4b: Compile to self-contained file for sharing

Internal source files reference `../../assets/style.css` and `../../assets/theme.js` via relative paths. These paths only resolve when the file is opened from within the repo. When shared directly as a standalone file (e.g. sent to a colleague), those paths resolve to nothing and the page renders unstyled.

After saving the source file, always produce a self-contained compiled copy:

1. Read `assets/style.css` and `assets/theme.js`.
2. Strip CSS comments from the stylesheet. Strip the top-level comment block from the JS.
3. In the source HTML, replace `<link rel="stylesheet" href="../../assets/style.css">` with `<style>[minified CSS]</style>`.
4. Replace `<script src="../../assets/theme.js"></script>` with `<script>[minified JS]</script>`.
5. Strip HTML comments. Collapse 3+ consecutive blank lines to one.
6. Write to **`internal/compiled/[filename].html`** — also gitignored.

The file in `internal/compiled/` is what gets shared with colleagues. The file in `internal/outputs/` is the editable source.

### Step 5: No fact-check required for internal sources

The standard fact-check (link verification against public docs, claim verification against official sources) does not apply to content that is explicitly sourced from internal guidance documents. However, still run the **sensitive data scan** (Step 2b) to catch any SFDC case numbers or customer identifiers that may have slipped in.

### Output checklist before delivering

- [ ] `guide.md` spec followed
- [ ] `cv-internal: true` meta tag present
- [ ] Internal banner present at top of body
- [ ] No SFDC case numbers or customer-identifiable data in HTML or sources file
- [ ] Sensitive data scan passed
- [ ] Source saved to `internal/outputs/` and `internal/sources/`
- [ ] **Self-contained compiled copy saved to `internal/compiled/` — share this file, not the source**
