# Ventara — Website (Black Concept)

Premium single-page marketing site for Ventara, a technology procurement company servicing the Australian region.

## Stack

- Vanilla HTML / CSS / JS — no build step
- Fonts: Sora (display) + Inter (body) via Google Fonts
- Imagery: AI-generated via Cloudflare Workers AI (FLUX-1-schnell)
- Hosted on Cloudflare Pages

## Structure

```
index.html          Single-page site
assets/css/         Styles
assets/js/          Hero particle canvas, reveal animations, nav
assets/img/         AI-generated imagery
assets/logos/       Vendor brand marks (simple-icons)
_headers            Cloudflare Pages security/cache headers
robots.txt          SEO
sitemap.xml         SEO
```

## Deploy

Cloudflare Pages, no build command, output directory `/`.

```
npx wrangler pages deploy . --project-name ventara-website-black --branch main --commit-dirty=true
```

## Notes

- Vendor logos are sourced from simple-icons; Microsoft and Adobe render as styled wordmarks (their marks are not distributable). Swap for licensed vectors before production.
- Hero "video" is implemented as a Ken Burns crossfade of AI-generated frames plus a particle canvas — no video file required.
