# Publishing the extension to a browser store

## Why not GitHub?

A GitHub link cannot install a Chrome, Edge, Brave or Opera extension.

Chrome only installs extensions from the Chrome Web Store, except for unpacked
extensions loaded by hand in Developer mode. Force-installing a self-hosted
extension through enterprise policy is limited to Windows machines joined to a
domain, or to machines managed by MDM — a normal personal Mac is excluded, so
even the managed-policy route is closed. Firefox is the exception: it accepts a
signed self-distributed `.xpi`.

So for a one-click install with no Developer mode, the extension has to be
published in a store. Two stores matter, and they differ only in price:

| Store | Fee | Review | Covers |
| --- | --- | --- | --- |
| Microsoft Edge Add-ons | none | typically 1–3 business days | Edge |
| Chrome Web Store | 5 USD, one-time | typically 1–3 business days | Chrome, and other Chromium browsers that use the store |

Both stores accept the same ZIP from `./scripts/package-extension.sh`.

## Before submitting

1. Build the package:

   ```bash
   ./scripts/package-extension.sh
   # -> release-extension/MDM-Extension-0.1.1.zip
   ```

   `manifest.json` must sit at the archive root — the script guarantees this.

2. Check the extension loads cleanly: `chrome://extensions` → Developer mode →
   **Load unpacked** → `extension/`. Any console error must be fixed first.

3. Have these ready:
   - **Store icon**: `extension/icons/icon128.png` (already 128×128 PNG).
   - **Screenshots**: at least one 1280×800 or 640×400 PNG/JPG of the extension
     popup or the download button on a page.
   - **Privacy policy URL**:
     `https://github.com/mahfuj2348/mdm/blob/main/PRIVACY.md`
   - **Single purpose statement**: "Adds a download button to media you are
     already playing, and hands the selected media to the MDM desktop app."

## Edge Add-ons (free)

1. Sign in at [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/public/login)
   with a Microsoft account (a GitHub account works and creates one).
2. Choose **Individual**, pick a publisher display name such as `MDM`.
3. After verification, choose **New extension** → upload the ZIP.
4. Fill the listing, then submit. Approval is free.

## Chrome Web Store (one-time fee)

1. Register at the [developer console](https://chrome.google.com/webstore/devconsole)
   and pay the one-time registration fee.
2. Verify your contact email, then **New item** → upload the ZIP.
3. Fill the listing, the privacy tab and the permission justifications below.
4. Submit for review.

### Permission justifications

- **nativeMessaging** — passes the selected media URL to the MDM desktop app on
  this machine. Without it the extension cannot start a download.
- **storage** — remembers the media detected for each tab and the user's own
  toggle settings.
- **activeTab** — acts on the page the user is currently viewing when they click
  the toolbar button.
- **contextMenus** — adds the "Download with MDM" right-click entry.
- **webRequest** — observes media requests so the toolbar can list what is
  available to download on that page.
- **downloads** — replaces a browser download with the MDM transfer once the user
  accepts, and keeps the browser download if they decline.
- **host_permissions `http://*/*`, `https://*/*`** — the extension cannot offer a
  download button on a site it is not allowed to inspect, and the sites a user
  visits are not knowable in advance. It reads media request metadata only; page
  content, form data and history are not collected.

## After approval

The store gives you a link such as
`https://chromewebstore.google.com/detail/<id>`. That is the one-click install
path to put in the README and the app's **Browser Integration** dialog. Store
builds also update themselves, so users stop having to reload an unpacked copy.

Keep the Developer-mode path documented as well: it is the only way to test
changes without publishing a new version.
