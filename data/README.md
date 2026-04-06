# Content data for Sacha Tours site

Edit **content.json** to change all site text and image paths. The site supports three languages: **sr** (Serbian), **it** (Italian), **fr** (French).

## Structure

- **meta** — `siteName` (object with `sr`, `it`, `fr`), `defaultLang`
- **nav** — Labels for navigation: `home`, `tours`, `household`, `contact` (each an object with `sr`, `it`, `fr`)
- **landing** — Home page:
  - **hero** — `title`, `subtitle`, `customNote` (objects by lang), `image` (string path)
  - **testimonials** — `sectionTitle`, `items` (array of `{ sr: { text, author }, it: { ... }, fr: { ... } }`)
  - **gallery** — `sectionTitle`, `images` (array of paths)
  - **guide** — `sectionTitle`, `name`, `description` (objects by lang), `image` (path)
- **tours** — `pageTitle`, `pageSubtitle`, `priceFrom`, `perPerson`, `detailsTitle` (objects by lang), **items** (array of tours):
  - Each tour: `id` (string), `sr` / `it` / `fr` with `title`, `shortDesc`, `details`, `price` (string), and **images** (array of paths)
- **household** — `pageTitle`, `description`, `offersTitle`, **offers** (array of strings per lang: object with `sr`, `it`, `fr`), **images** (paths), `followUs`, `facebook`, `instagram` (URLs)
- **contact** — `pageTitle`, `phone`, `email`, `address` (object by lang), `guideSection`, `householdSection`, **guide** (`facebook`, `linkedin`, `instagram` URLs), **household** (`facebook`, `instagram` URLs)

## Images

Put image files in the **images/** folder (or the path you use in JSON). Current placeholder paths in the JSON:

- `images/hero.jpg` — Landing hero
- `images/gallery-1.jpg` … `images/gallery-6.jpg` — Landing gallery
- `images/guide.jpg` — Guide photo
- `images/tours/belgrade-1.jpg` etc. — Tour images
- `images/household-1.jpg` … — Household page

Replace these paths in **content.json** with your real file names or full URLs.
