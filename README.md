# BrainFirst Nigeria

## Structure

```
site/               static homepage, no build step, deployable as-is
  index.html

studio/schemas/      Sanity document schemas (plug into your Sanity Studio's schemaTypes)
  index.js
  article.js
  testimonial.js
```

## Site

`site/index.html` is a single static file (HTML/CSS/JS inline, no build tool).
Open it directly in a browser, or serve the `site/` folder from any static host
(GitHub Pages, Netlify, Vercel static, etc).

It pulls featured testimonials and articles live from Sanity. Before it'll show
real content, set these two values near the bottom of the file:

```js
const SANITY_PROJECT_ID = 'YOUR_PROJECT_ID';
const SANITY_DATASET = 'production';
```

Both are in manage.sanity.io -> your project -> API. You'll also need to:
- add this site's origin under Project -> API -> CORS Origins
- make sure the dataset allows public read access (no auth token is used client-side)

Until those are set, the page shows placeholder content instead of failing.

## Studio schemas

`studio/schemas/` holds the `article` and `testimonial` document types plus the
`schemaTypes` index that groups them. Drop this folder into an existing Sanity
Studio project's schema location, or use it as the `schemaTypes` for a fresh one.

## GitHub setup

```bash
cd brainfirst-nigeria
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
