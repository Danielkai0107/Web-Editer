Design system & layout shell (reusable)
Apply the following as a consistent product shell for any [PRODUCT_NAME] in [DOMAIN: e.g. fintech, crypto, banking, SaaS analytics]. Keep structure identical across products; only swap branding, copy, nav labels, and domain-specific widgets.

Visual language
* Theme: Light mode only.
    * Color tokens (treat as CSS-like variables):
    * --bg-base: #F8F9FC
    * --bg-card: #FFFFFF
    * --bg-card-elevated: #F0F4FF
    * --border: black ~6% opacity; --border-strong: black ~12% opacity
    * --text-primary: #0A0E1A
    * --text-secondary: #4A5568
    * --text-muted: #8B9BB4
    * --accent: #086CF2 + subtle glow / focus ring using ~15% accent alpha
    * --accent-secondary: #A78BFA
    * --success: #34D399; --danger: #F87171 (use light tinted backgrounds for chips / table deltas)
    * --gold or --tier: #C9960A for premium / tier / highlights
    * Typography:
    * Display / logo / key headlines: DM Sans.
    * UI body & CJK: DM Sans.
    * Numbers, amounts, codes, tables: DM Mono (or equivalent monospace).
    * Never use emoji
* Radius: cards ~16px; inputs, icon buttons, small chips ~10px.
* Style: Prefer flat cards, 1px hairline borders, optional very soft shadow (no heavy skeuomorphism). Expect dense data UI: tables, stat tiles, line/area charts, small badges (e.g. asset tickers).

Layout shell
* Sidebar (fixed left): ~220px wide; on large viewports support collapse to ~72px icon-only with tooltips. Include: [LOGO_MARK] + [PRODUCT_NAME], optional mode / workspace switch (e.g. Personal | Business — replace with product-specific modes), grouped primary nav with section labels, utility cluster at bottom (search, notifications, sign out). Active nav item: left vertical bar on the row + slightly elevated surface or stronger text color.
* Top bar (~52px): Centered page title (changes per view). Right cluster: connection / trust pill (e.g. "Secure connection" + status dot), search, notifications; on narrow screens, hamburger replaces or supplements sidebar.
* Main: Comfortable max-width for forms and marketing blocks; full-width for tables and analytics. Use responsive card grid (2–3 columns desktop, 1 column mobile).

Responsive behavior (RWD)
* Breakpoints (suggested): <640 mobile, 640–1023 tablet, ≥1024 desktop (adjust if product needs a wider "tablet landscape" band).
* Sidebar: On <1024, default to hidden off-canvas drawer opened by topbar menu; overlay + dismiss on outside tap / ESC; preserve same nav order as desktop. On ≥1024, fixed sidebar with optional collapse to icon rail (~72px).
* Topbar: Mobile shows menu, compact title (truncate with ellipsis), and essential actions only (e.g. notifications); move secondary actions into overflow "more" or sidebar footer if crowded.
* Content width: Full-bleed on small screens with 16px horizontal padding (or 20–24px on tablet); re-stack multi-column grids to 1 column on mobile, 2 columns on tablet where appropriate.
* Tables: On narrow viewports, prefer horizontal scroll with sticky first column OR card list representation of rows (same data fields, stacked). Never shrink text below 12px for body; use scroll instead.
* Typography scale: Slightly reduce display sizes on mobile; keep line-height comfortable for CJK; avoid ultra-wide measure on large screens (cap readable column width for long text).
* Touch targets: Minimum 44×44px hit area for icon buttons and list rows on touch devices.
* Charts: Ensure legible labels on small widths (fewer ticks, rotate labels only if readable); allow chart min-height so lines aren't crushed.
* Modals / drawers: Full-screen sheet on small phones for complex flows; centered modal on tablet/desktop.

Placeholders (optional)
[MOBILE_PADDING], [DESKTOP_MAX_CONTENT_WIDTH], [DRAWER_BREAKPOINT]

Reusable output expectations
* Auto-layout, 8px spacing scale, named layers, componentized buttons / inputs / tables / charts / modals / toasts.
* If the tool supports variables: map the color tokens above.

Placeholders to fill each time
[PRODUCT_NAME] · [DOMAIN] · [PRIMARY_NAV_GROUPS_AND_ITEMS] · [MODE_SWITCH_LABELS_IF_ANY] · [TRUST_PILL_COPY] · [KEY_SCREENS_LIST]
