# Spring PetClinic Design System

Generated for COG-113 with `extract-design-system@0.1.11`.

This is a practical reference for Codex and Maestro agents working on the
Spring PetClinic microservices UI. It documents observed tokens and cautious
integration guidance; it does not replace the application CSS automatically.

## Source and Extraction

- Target URL: `http://localhost:8080/`
- Served source: `spring-petclinic-api-gateway/src/main/resources/static`
- Extraction command: `extract-design-system http://localhost:8080/ --extract-only`
- Token generation command: `extract-design-system init`
- Generated artifacts:
  - `.extract-design-system/raw.json`
  - `.extract-design-system/normalized.json`
  - `design-system/tokens.json`
  - `design-system/tokens.css`

The normalized extractor output detected typography and spacing but emitted an
empty color palette. The raw extractor output and repository CSS did expose
colors, radii, shadows and component state values, so `tokens.json` and
`tokens.css` include those values with source notes.

## Tokens

Use `design-system/tokens.json` for structured agent reads and
`design-system/tokens.css` for CSS variable names. Token names are prefixed with
`pc` for PetClinic to avoid collisions with Bootstrap variables already present
in `petclinic.css`.

Core observed colors:

- `--pc-color-brand-charcoal`: `#34302d`, primary text and navbar background.
- `--pc-color-brand-green`: `#6db33f`, Spring accent and navbar hover state.
- `--pc-color-nav-hover-text`: `#eeeeee`, navbar hover text.
- `--pc-color-surface-page`: `#ffffff`, page and bot chat surface.
- `--pc-color-chat-header`: `#075e54`, chat header and send button.
- `--pc-color-chat-header-hover`: `#128c7e`, chat send button hover.
- `--pc-color-chat-user-bubble`: `#dcf8c6`, user chat bubble.
- `--pc-color-border-input`: `#cccccc`, chat input border.

Bootstrap colors remain available in the app CSS. Mirror them through `pc`
tokens only when an agent is generating new repo-owned UI documentation or
isolated examples.

## Typography

Observed font families:

- Body: `"varela_roundregular", sans-serif`
- Headings and strong text: `"montserratregular", sans-serif`
- Navigation: `"montserratregular", sans-serif`

Observed type scale:

- Navigation: `14px`
- Body and h3: `16px`
- h2: `18px`
- Mobile subtitle: `21px`
- h1: `24px`

Heading patterns:

- h1: `24px / 30px`, Montserrat regular.
- h2: `18px / 24px`, Montserrat bold, `10px` bottom margin.
- h3: `16px / 24px`, Varela Round bold, `10px` bottom margin.

## Layout

- Outer shell uses Bootstrap `.container-fluid`.
- Main content uses `.container.xd-container`.
- Mobile layout changes below `768px`.
- Navbar brand is `229px x 46px` desktop and `148px x 50px` mobile.
- Chatbox is a fixed `300px` panel with `10px` bottom and right offsets.
- Chatbox content height is `400px`.

Spacing values observed by the extractor were `10px`, `40px` and `100px`.
The token scale also records common local CSS values such as `6px`, `12px`,
`20px`, `28px` and `30px`.

## Components and States

Navbar:

- Default: charcoal background, 4px Spring green top border.
- Link text: uppercase Montserrat, `14px`, `28px 20px` padding.
- Hover: Spring green background with `#eeeeee` text.
- Mobile: top border removed, centered mobile logo, toggler positioned top left.

Headings:

- Use Montserrat for h1 and h2.
- Keep h1 compact; the existing app does not use oversized hero typography.

Chatbox:

- Container: muted surface, `10px` radius, soft shadow.
- Header: `#075e54` background, white text, `10px` padding.
- Messages: `80%` max width, `10px` padding, `20px` radius, `14px` text.
- User message: `#dcf8c6`, right aligned, square lower-right corner.
- Bot message: white background, subtle border, left aligned, square lower-left corner.
- Input: `20px` radius, `#cccccc` border.
- Send button: round, `#075e54` default, `#128c7e` hover.

## Accessibility

- Maintain visible link and button focus states when adding UI; Bootstrap focus
  ring tokens are already present in `petclinic.css`.
- Preserve text contrast: use charcoal on white/muted surfaces and white on
  charcoal or chat header green.
- Keep interactive controls keyboard reachable. The chat header is currently a
  button and should remain one if restyled.
- Keep image `alt` text when adding or replacing PetClinic images.
- Respect reduced motion; existing Bootstrap CSS sets smooth scrolling only when
  `prefers-reduced-motion: no-preference`.

## Usage Examples

Import tokens only in an isolated prototype or after an explicit migration task:

```css
@import "./design-system/tokens.css";
```

Use tokens in new CSS like this:

```css
.pc-panel {
  color: var(--pc-color-text-primary);
  background: var(--pc-color-surface-page);
  border: 1px solid var(--pc-color-border-default);
  border-radius: var(--pc-radius-md);
  font-family: var(--pc-font-body);
}

.pc-action {
  background: var(--pc-color-brand-green);
  color: var(--pc-color-text-inverse);
  transition: background-color var(--pc-motion-base);
}
```

Agent guidance:

- Prefer `tokens.json` for exact value lookup and source attribution.
- Prefer `tokens.css` for generated CSS examples.
- Do not mass-replace current application CSS without a dedicated migration
  issue.
- When adding UI inside the existing AngularJS app, keep Bootstrap class
  conventions and use PetClinic tokens for app-specific colors and typography.

## Limits

- Extraction was from the locally served static gateway home page, not a fully
  running microservice stack.
- AngularJS routes requiring backend data were not captured during extraction.
- The extractor normalized output did not preserve palette colors, so color
  tokens were completed from raw extractor output and repo-owned CSS.
- This is a starter design system, not proof of a complete product-wide visual
  language.
