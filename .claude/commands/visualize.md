# /visualize

You are helping create, maintain, publish, and fact-check interactive HTML one-pager diagrams for the **Concept Visualizer** project — a collection of interactive architecture reference documents for Red Hat Technical Support Engineers covering ARO, ROSA, and self-managed OCP topics.

The user invoked `/visualize` with these arguments: **$ARGUMENTS**

---

## Route the request

Parse `$ARGUMENTS` and branch to the appropriate section:

- If `$ARGUMENTS` is **empty** → ask the user what topic and platform they want to document, then follow **[Generate]**
- If `$ARGUMENTS` begins with a topic description (not a sub-command keyword) → follow **[Generate]**
- If `$ARGUMENTS` starts with `build` → follow **[Build]**
- If `$ARGUMENTS` starts with `fact-check` → follow **[Fact-check]**

---

## [Generate] — Create a new one-pager

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

### Step 5: Save files

- **HTML** → correct platform `outputs/` directory  
  e.g. `rosa/outputs/rosa-hcp-dns.html`
- **Sources** → correct platform `sources/` directory  
  e.g. `rosa/sources/rosa-hcp-dns.md`

The sources file must list every URL and KCS article used, with access status (public / paywalled) and the date verified. Flag any time-sensitive claims that may need re-verification.

### Output checklist before delivering

- [ ] `guide.md` read and spec followed
- [ ] Platform `CLAUDE.md` read
- [ ] All platform-specific claims scoped correctly
- [ ] Scope banner present if content is not universal
- [ ] `cv-*` meta tags present in `<head>`
- [ ] Sources file saved to the correct `sources/` directory
- [ ] KCS/docs bar present at the bottom of the HTML
- [ ] HTML saved to the correct `outputs/` directory

---

## [Build] — Compile all outputs to `build/`

Compile every one-pager in the project into the `build/` directory for GitHub Pages deployment.

### Step 1: Discover all one-pagers

Glob all files matching `*/outputs/*.html`. For each file, read the `cv-*` meta tags from `<head>`:

- `cv-title` — card title
- `cv-description` — card description text
- `cv-platform` — platform label (ARO / ROSA HCP / ROSA Classic / OCP / Multi)
- `cv-tags` — comma-separated tag list
- `cv-accent` — accent color variable name (e.g. `blue` → `var(--blue)`)

If any file is missing `cv-*` tags, report it to the user and skip it (do not guess values).

### Step 2: Copy files to `build/diagrams/`

Create `build/diagrams/` if it does not exist. Copy each discovered HTML file into it, preserving the original filename.

### Step 3: Generate `build/index.html`

Generate the Concept Visualizer index using the template below. For each discovered one-pager, insert a `<a class="card">` block with the extracted metadata.

**Card sort order:** ARO first, then ROSA HCP, then ROSA Classic, then OCP, then Multi.

For each card:
- `href` → `diagrams/[filename].html`
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
    Red Hat Technical Support &nbsp;·&nbsp; <a href="https://github.com/thephilip/concept-visualizer" target="_blank">View on GitHub</a>
  </div>
</div>
</body>
</html>
```

Replace `GITHUB_REPO` with the actual `owner/repo` path. If the git remote is already set, read it with `git remote get-url origin` and extract the owner/repo.

### Step 4: Report

List every file copied to `build/diagrams/`, confirm `build/index.html` was written, and show the card titles that were generated. If any `*/outputs/*.html` files were skipped due to missing `cv-*` tags, list them so the user can fix them.

---

## [Fact-check] — Verify accuracy of an existing one-pager

**Arguments format:** `fact-check [path/to/file.html]`  
If no path is given, check the most recently modified HTML file in any `*/outputs/` directory.

### Step 1: Identify and read the file

Read the specified file. Also read the corresponding sources file in the matching `sources/` directory if it exists.

### Step 2: Extract all factual claims

List every specific factual assertion in the file: component names, behaviors, timeouts, CIDR defaults, CLI flag names, version gates, KCS article numbers and their described content, scope assertions (e.g. "ARO-specific", "does not apply to ROSA"), and any "does not exist on X platform" claims.

### Step 3: Verify against official sources

For each claim, search official sources to confirm:

- `docs.redhat.com`, `docs.openshift.com`, `access.redhat.com/solutions/`, `learn.microsoft.com` (ARO)
- Check that cited KCS numbers exist and that the article's content matches what the one-pager claims
- Check whether version-gated claims are still accurate for the currently supported OCP versions

### Step 4: Report findings

Return a structured report grouped into four categories:

| Category | Meaning |
|---|---|
| **Verified** | Confirmed against an official source — include the URL |
| **Outdated** | Was accurate but appears to have changed — include what changed |
| **Unverified** | Could not be confirmed from an official source — not necessarily wrong, but unsourced |
| **Incorrect** | Contradicted by an official source — include the correct information and source URL |

Do not edit the file until the user approves corrections.

### Step 5: Apply corrections (if approved)

If the user approves, edit the HTML file to fix any incorrect or outdated claims. Update the corresponding `sources/` file to reflect the changes and note the date re-verified.
