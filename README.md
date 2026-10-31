# Cardinal Land Company — CardinalLand.com

Static marketing site: plain HTML, one shared stylesheet, one small script. No build step.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Home: hero, lease-offer callout, how it works, four land uses, why landowners call, assessment form |
| `how-it-works.html` | The three steps in depth, what we do not do, FAQ |
| `landowners.html` | Solar, natural gas, minerals, timber: what each is and questions to ask before signing |
| `about.html` | Joe Lesher, how the firm works, note for energy company land departments |
| `404.html` | Not-found page (uses root-absolute paths because Apache serves it at any URL) |
| `styles.css` | Shared stylesheet, mobile-first |
| `main.js` | Mobile menu, Formspree submit without reload, offer pre-check, mobile call bar |
| `sitemap.xml`, `robots.txt` | Search engine files (absolute URLs on cardinalland.com) |
| `.htaccess` | Caching, compression, 404 routing, optional HTTPS redirect (commented) |
| `favicon.ico` | Browser tab icon, from the charcoal cardinal |
| `assets/logo-red.png`, `assets/logo-charcoal.png` | Original logo files as supplied |
| `assets/logo-*-lockup.png/.webp` | Web-optimized transparent logos used in header and footer |
| `assets/og-image.png` | 1200x630 Open Graph / social share image (red logo on cream) |
| `assets/favicon-*.png`, `assets/icon-*.png`, `assets/apple-touch-icon.png` | Icon set |
| `assets/fonts/*.woff2` | Libre Caslon Text, self-hosted (SIL Open Font License) |

## Deploying to Hostinger

1. In hPanel open **Websites → Manage → File Manager** (or connect with FTP using the credentials under **Files → FTP Accounts**).
2. Open `public_html`, delete the placeholder `default.php` if present, and upload every file and folder in this repository **except** `.git` and this README, keeping the folder structure (`assets/fonts/...`). Make sure `.htaccess` is uploaded; file managers sometimes hide dotfiles.
3. In hPanel, enable the free SSL certificate for cardinalland.com if it is not already active, then uncomment the HTTPS redirect block at the bottom of `.htaccess`.
4. Visit https://cardinalland.com/ and https://cardinalland.com/sitemap.xml to confirm, then submit the sitemap in Google Search Console.

## Replacing the placeholder phone number

The phone number `717-123-4567` is a placeholder and appears in exactly one format everywhere, including `tel:` links, the schema metadata and `main.js`. When the real number arrives, one pass replaces it all:

```
grep -rl "717-123-4567" --include="*.html" --include="*.js" --include="*.md" . | xargs sed -i "s/717-123-4567/NEW-NUMBER/g"
```

## Wiring up the form (Formspree)

1. Create a free account at https://formspree.io, add a new form, and set its notification email to `info@CardinalLand.com`.
2. Copy the form's endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find the `TODO` comment above the `<form>` and replace `YOUR_FORM_ID` in the `action` attribute with the ID from step 2.
4. Upload the updated `index.html`, submit a test request, and confirm the email arrives. The first submission from a new form asks you to confirm the address once.

The site works with JavaScript off: the form then posts to Formspree directly and shows Formspree's thank-you page.
