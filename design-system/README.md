# Spring PetClinic Design System

Generated for COG-113 with `extract-design-system@0.1.11`.

This is the repo-owned starter design system for the Spring PetClinic
microservices UI. It is practical by design: it captures the tokens and
component patterns that are actually visible in the repository source and in
the locally rendered gateway shell, and it separates observed values from
careful inference.

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

The normalized extractor output was sparse on palette data, so the token files
were completed from the raw extractor output and the repo CSS in:

- `spring-petclinic-api-gateway/src/main/resources/static/css/header.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/typography.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/responsive.css`
- `spring-petclinic-api-gateway/src/main/resources/static/css/petclinic.css`

## What Is Reliable

Observed from the source and extractor:

- Brand charcoal `#34302d`
- Spring green `#6db33f`
- Chat header green `#075e54`
- Chat hover green `#128c7e`
- Chat user bubble `#dcf8c6`
- Body font `varela_roundregular`
- Heading and navigation font `montserratregular`
- Layout shell `container-fluid` -> `container.xd-container`
- Desktop navbar brand size `229px x 46px`
- Mobile navbar brand size `148px x 50px`
- Chatbox panel size `300px` wide and `400px` tall

Careful inference, backed by the repo CSS:

- The app uses Bootstrap 5 for general utilities and focus styles.
- The existing chatbox is a fixed-position, WhatsApp-like panel.
- The navbar and headings are intentionally compact rather than promotional.

## Tokens

Use `design-system/tokens.json` for structured reads and source attribution.
Use `design-system/tokens.css` when you need CSS custom properties.

Core colors:

- `--pc-color-brand-charcoal`: primary text and navbar background.
- `--pc-color-brand-green`: Spring accent and navbar hover fill.
- `--pc-color-nav-hover-text`: navbar hover text.
- `--pc-color-surface-page`: page surface.
- `--pc-color-surface-muted`: chatbox shell.
- `--pc-color-surface-subtle`: chatbox footer.
- `--pc-color-chat-header`: chat header and send button.
- `--pc-color-chat-header-hover`: chat send hover.
- `--pc-color-chat-user-bubble`: user message bubble.
- `--pc-color-chat-bot-bubble`: bot message bubble.

Typography:

- Body: `"varela_roundregular", sans-serif`
- Headings: `"montserratregular", sans-serif`
- Navigation: `"montserratregular", sans-serif`
- Navigation size: `14px`
- Body size: `16px`
- h2: `18px`
- h3: `16px`
- h1: `24px`

Spacing:

- The extracted scale is intentionally small and centers on `10px`, `40px`
  and `100px`.
- The repo CSS also uses local values such as `6px`, `12px`, `20px`, `28px`
  and `30px`.

Layout:

- Shell: `.container-fluid` outer container and `.container.xd-container`
  content container.
- Mobile breakpoint: `768px`.
- Navbar brand: `229px x 46px` desktop, `148px x 50px` mobile.
- Chatbox: `300px` wide, `400px` high, `10px` bottom/right offsets.

Radius and shadows:

- Chatbox radius: `10px`.
- Input radius: `20px`.
- Chat button radius: `50%`.
- Chatbox shadow: `0 0 10px rgba(0, 0, 0, 0.1)`.

## Components and States

Navbar:

- Default: charcoal background with a `4px` Spring green top border.
- Links: uppercase Montserrat, `14px`, `28px 20px` padding.
- Hover: Spring green background with `#eeeeee` text.
- Mobile: top border removed, centered mobile brand, toggler top-left.

Headings:

- h1: `24px / 30px`, Montserrat regular.
- h2: `18px / 24px`, Montserrat bold with `10px` bottom margin.
- h3: `16px / 24px`, Varela Round bold with `10px` bottom margin.

Chatbox:

- Container: fixed panel, muted surface, rounded corners, soft shadow.
- Header: `#075e54` background, white text, `10px` padding.
- Messages: `80%` max width, `10px` padding, `20px` radius, `14px` text.
- User bubble: `#dcf8c6`, right-aligned, square lower-right corner.
- Bot bubble: white background, subtle border, square lower-left corner.
- Footer: subtle surface with `10px` padding.
- Input: `20px` radius, `#cccccc` border, `10px` padding.
- Send button: round `#075e54` action with `#128c7e` hover.
- Minimized state: content collapses to the header only.

## Accessibility

- Keep focus states visible on links, buttons and inputs.
- Keep the chat header as a button so it remains keyboard reachable.
- Preserve color contrast:
  - charcoal on white or muted surfaces;
  - white on charcoal, chat header green or dark action backgrounds.
- Do not remove keyboard affordances when restyling with Bootstrap classes.
- Respect reduced motion. The repository already uses smooth scrolling only
  when the user allows motion.
- Keep `alt` text when adding or replacing images.

## Usage Examples

Import the generated tokens in isolated docs, prototypes, or controlled
migrations:

```css
@import "./design-system/tokens.css";
```

Example component tokens:

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

Example agent guidance:

1. Prefer `tokens.json` when you need exact values and source attribution.
2. Prefer `tokens.css` when you need a CSS variable source of truth.
3. Do not mass-replace application CSS without a dedicated migration issue.
4. When generating new UI inside the AngularJS app, preserve Bootstrap
   conventions and map repo-specific colors and typography through the `pc`
   tokens.

## Notes For Agents

- The repository is an AngularJS app with Bootstrap 5 loaded through the
  gateway shell.
- The design system should be treated as a starter reference, not a universal
  product language.
- Use the token files for new repo-owned docs, prototypes, and isolated UI
  examples.
- Avoid editing application CSS unless the task explicitly requests a style
  migration.

## Limits

- Extraction used a temporary localhost server, not the full microservice
  runtime.
- AngularJS routes that need live backend data were not captured.
- The normalized extractor omitted palette colors, so this package combines
  extractor output with repo CSS values.
- This is a practical starter design system, not proof of a complete
  product-wide system.
