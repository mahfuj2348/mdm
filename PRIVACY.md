# MDM Privacy Policy

Last updated: 30 October 2026

MDM has two parts: a macOS desktop application and the **MDM Integration**
browser extension. This policy covers both. The short version: **nothing leaves
your computer except the downloads you start.**

## What the extension accesses

The extension needs to see which media a page requests, otherwise it cannot offer
a download button. While you browse, it observes, for pages you open:

- media request URLs and content types (video, audio, HLS playlists);
- the page title and the tab it belongs to;
- request headers for the media you choose to download — `Cookie`,
  `Authorization`, `User-Agent`, `Origin` and `Referer`.

These headers are kept in memory and in extension-local storage, scoped to that
tab, only so the download can be authenticated the way your browser would have
made it. They are cleared when the tab closes or the entry expires.

## Where data goes

- To the **MDM desktop app on the same Mac**, over `127.0.0.1`, authenticated with
  a per-session random token. This is the only destination.
- Nowhere else. There is no server, no analytics, no crash reporting, no
  advertising, no third-party SDK, and no account.

## What is stored, and where

- Download history and settings: `~/.mdm` on your Mac, readable only by you.
- The extension keeps its per-tab media list in browser-local storage.
- Nothing is uploaded, and nothing is sold or shared.

## What MDM never does

- It does not read or upload browsing history.
- It does not collect credentials for its own use; captured headers are forwarded
  only for the exact URL you selected and are stripped from history and on
  cross-origin redirects.
- It does not download anything you did not ask for.
- It does not bypass DRM or paid access.

## Removing your data

Delete `~/.mdm` to remove all MDM data. Removing the extension deletes its local
storage. Uninstalling the app leaves `~/.mdm` in place so you can inspect it first.

## Contact

Open an issue at https://github.com/mahfuj2348/mdm/issues.
