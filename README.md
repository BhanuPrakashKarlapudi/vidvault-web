# VidVault Web

A responsive, ad-free static website with a premium dark theme, purple accents, and neon green highlights.

## Included
- Mobile-responsive UI
- Detects YouTube, Instagram, X/Twitter, direct media-file URL patterns, and unknown URLs
- Opens platform URLs in their official website/app handoff where the browser permits
- Platform-specific guidance for official download/offline/export flows
- Copy link and save links locally in the browser
- No ad networks, analytics, tracking pixels, login, or backend server
- No social account passwords requested

## Important limitations
This is a **static link helper**, not a universal video extraction service. It does not download or proxy social-media videos from page URLs. The platform's official app/site controls whether download/offline/export is available. The "direct media" action opens the media URL in a new tab; whether it downloads or plays depends on the server's headers and browser.

The saved list uses the browser's `localStorage` on the current device/browser profile. It is not synced across devices and is not encrypted storage. Google Fonts is referenced by CSS; remove the `@import` in `styles.css` if you want to avoid contacting that third-party font host. The rest of the site does not include ad networks or analytics.

## Run locally
You can double-click `index.html` to preview the page. Clipboard access may require HTTPS or localhost.

Optional local server:
- Python installed: run `python -m http.server 8000` from this folder
- Open `http://localhost:8000`

## Free deployment: GitHub Pages
1. Create/sign in to a GitHub account.
2. Create a new public repository, e.g. `vidvault-web`.
3. Upload `index.html`, `styles.css`, `app.js`, `favicon.svg`, and `README.md` to the repository root.
4. Open repository **Settings → Pages**.
5. Under build/deployment, choose **Deploy from a branch**.
6. Choose the `main` branch and `/ (root)`, then save.
7. Wait for deployment. GitHub will show the website URL in Settings → Pages.

GitHub Pages serves static files and does not add ads to this project. Hosting plan details and usage terms may change; a public repository is the simplest route for a personal static site. Your URL will typically resemble `https://YOUR-USERNAME.github.io/vidvault-web/`.

## Free deployment: Cloudflare Pages
1. Create/sign in to Cloudflare.
2. Choose Workers & Pages → Create → Pages.
3. Connect a Git repository or upload the static files if Direct Upload is offered in your account.
4. No build command is needed; set the output directory to the project root (or the directory containing `index.html`).
5. Deploy and use the generated `pages.dev` URL.

Cloudflare plan limits and policies can change. Static hosting does not make video bandwidth unlimited, but this site itself does not host the videos.

## Privacy and legal
Use the site's platform options only for content you own or are authorized to save. Platform terms, copyright, access controls, and creator download settings still apply. Do not add bypasses for DRM, private media, or platform restrictions.
