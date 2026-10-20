# ChaiUI registry items

Install: `npx shadcn@latest add @chaiui/<name>` after adding
`"registries": { "@chaiui": "https://ui.chaicode.com/r/{name}.json" }` to `components.json`.
Or by URL: `npx shadcn@latest add https://ui.chaicode.com/r/<name>.json`.

**Status:** every item below is `shipped`: live at https://ui.chaicode.com
since 2026-10-03, so install it with the commands above. Install
`@chaiui/chaiui` first in an existing app. Mark new items `shipped` once they
are deployed.

APIs of the built items:
- `Button`: `variant` soft (default) | solid | outline | muted | ghost | danger, `size` sm | md | lg | icon, `asChild`, `iconRight` (solid defaults to ArrowUpRight; `null` drops it).
- `Card`, `CardMedia`, `CardBody`, `CardTitle`, `CardText`, `CardFooter`.
- `Chip tone` default | success | danger | special. `Badge variant` overlay | new | hot | rated (on images only).
- `Level level="Easy|Medium|Hard"`, `LiveDot tone` live | special | success.
- `Input`, `SearchInput` (needs `aria-label`), `Select` (native), `IconButton variant` boxed | ghost (needs `aria-label`).
- `Segmented options={[{ value, label, 'aria-label'? }]} value onChange label`.
- `Dialog open onClose title description role busy initialFocus` + `DialogActions`.
- `ConfirmDialog open title confirmLabel cancelLabel tone typeToConfirm busy error onConfirm onCancel`.
- `ToastProvider` + `useToast()(message, { tone, duration })`.
- `ThemeProvider` (dark default, key `chaiui-theme`), `useTheme()`, `ThemeScript`, `ThemeSwitcher`, `Backdrop`.
- `AnimatedBadge` (children), `Logo wordmark?` (renders no link), `MenuToggle open` (a button; works as a Radix trigger), `ShinyText speed delay` (string child, once per page), `FancyArrow`.
- `TiltCard` > `TiltCardBody` > `TiltCardItem translateZ`; `CardSwap width height delay` > `CardSwapItem`.
- `Disclosure open defaultOpen onOpenChange openOnHover` > `DisclosureTrigger asChild?` + `DisclosureContent`.
- `MediaFrame src srcDark? alt` (inside a `group` link), `RotatingWord words interval`, `ShareButtons path text compact?`.
- Blocks install to `components/` and use plain `<a>`; swap in the router's Link.
- `Navbar logo layout="menu"|"inline" links groups actions`. Inline groups: `{ label, href }` or `{ label, columns?, items: [{ label, description?, href, icon? }] }`.
- `Footer logo tagline owner sections=[{ title, wide?, links: [{ label, href, external?, icon? }] }]`.
- `Hero badge title primary secondary media` with the lead as children (container queries, one media slot).
- `SectionHead title action? id?` with the subtitle as children.
- `ListingHead`, `Toolbar count noun aside filters` (controls as children), `CardGrid columns`, `ListCard href topLeft topRight title summary chips note action`, `ClearFilters`.
- `CourseCard course={ title href image description instructors badge rating chips price originalPrice } layout`, `EventCard href image alt`.
- `CohortCard name href status center orbit footer`, `Carousel label autoplay arrows` (fixed-width children).
- `FeatureBento features=[{ title description tone link }]` (7: three over four), `StatStrip stats`, `CtaPanel heading tagline action`.
- `TestimonialGroup` > `VideoTestimonial name batch video poster links`; `ReviewCard name username avatar href` (text as children).
- `AppBadges appStore googlePlay`, `Instructor name role photo photoAlt socials stats` (bio as children).
- `Tabs` > `TabsList variant="line"|"segmented"` > `TabsTrigger`, `TabsContent`. `Accordion type collapsible` > `AccordionItem` > `AccordionTrigger` + `AccordionContent`.
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. `Pagination page total href|onChange`. `Breadcrumbs items=[{ label, href? }]`.
- `Tooltip` > `TooltipTrigger` + `TooltipContent`. `Popover` > `PopoverTrigger` + `PopoverContent`. `Drawer` > `DrawerTrigger` + `DrawerContent side title description`.
- `Field label hint error aside` (wraps one control), `Fieldset legend`, `Textarea`, `RadioGroup options`, `CheckboxGroup options value onChange`, `InputOTP` > `InputOTPGroup` > `InputOTPSlot index`, `Combobox options value onChange label`.
- `Alert tone="info"|"success"|"warning"|"danger" title`, `Skeleton`, `Spinner label`, `Progress value max`, `Separator orientation`, `Kbd`, `AvatarGroup people max`.
- Auth: `SignInPage onSubmit onOAuth providers signUpHref forgotHref`, `SignUpPage onSubmit onOAuth termsHref privacyHref`, `ForgotPasswordPage onSubmit`. `onSubmit` returns nothing on success or a message to show. Build other auth screens from `auth-shell` (`AuthShell`, `Field`, `TextInput`, `PasswordInput`, `SubmitButton`, `FormError`, `OAuthButtons`, `useAuthSubmit`).
- Templates: `PageShell` (children; edit `NAV_LINKS` and `FOOTER_SECTIONS` in the file), `LandingPage`, `ListingPage`, `EventsPage`. Render one from a route; replace the constants at the top of the file.

| item | what | status |
|---|---|---|
| `chaiui` | the theme: tokens, fonts, highlight, card and button utilities | shipped |
| `utils` | `cn()` | shipped |
| `backdrop` | the hexagon glow background | shipped |
| `theme-provider`, `theme-switcher` | dark default, half-circle switch | shipped |
| `button` | solid / outline (asymmetric), soft, muted, ghost, danger | shipped |
| `highlight` | the cream phrase | shipped |
| `card`, `chip`, `badge`, `level`, `live-dot` | card and its labels | shipped |
| `input`, `search-input`, `select`, `segmented`, `icon-button` | toolbar controls | shipped |
| `dialog`, `confirm-dialog`, `toast`, `dropdown-menu` | overlays | shipped |
| `avatar`, `switch`, `checkbox` | shadcn, restyled | shipped |
| `animated-badge`, `logo`, `menu-toggle`, `shiny-text`, `fancy-arrow`, `tilt-card`, `card-swap`, `disclosure`, `media-frame`, `rotating-word`, `share-buttons` | primitives: the chaicode signatures | shipped |
| `tabs`, `accordion`, `table`, `pagination`, `breadcrumbs` | navigation and data | shipped |
| `tooltip`, `popover`, `drawer` | overlays | shipped |
| `field`, `textarea`, `radio-group`, `checkbox-group`, `input-otp`, `combobox` | forms | shipped |
| `alert`, `skeleton`, `spinner`, `progress` | feedback (progress is neutral, never orange) | shipped |
| `separator`, `kbd`, `avatar-group` | small pieces | shipped |

**Components** (`registry:block`). Reach for these before hand-rolling a page:

| item | what | status |
|---|---|---|
| `navbar` | sticky transparent header, blur on scroll, `layout: menu \| inline` | shipped |
| `hero` | one central element, badge, title, lead, solid + outline buttons | shipped |
| `footer` | logo column, link columns, the faded orange hairline | shipped |
| `section-head` | h2 plus a lead with the highlight phrase | shipped |
| `course-card`, `event-card`, `cohort-card`, `instructor` | the card family | shipped |
| `listing` | title, toolbar with segmented filter, card grid | shipped |
| `carousel`, `feature-bento`, `testimonials`, `stat-strip`, `cta-panel`, `app-badges` | landing page sections | shipped |

**Templates** (whole pages, `registry:block`, installed as components you render from a route):

| item | what | status |
|---|---|---|
| `page-shell` | background, navbar, the max-w-6xl column and footer; links in one place | shipped |
| `landing-page`, `listing-page`, `events-page` | full pages built from the blocks | shipped |
| `auth-shell`, `sign-in-page`, `sign-up-page`, `forgot-password-page` | auth pages; wire `onSubmit` and `onOAuth` to your auth provider | shipped |
