# MDM

A macOS download manager with a compact desktop interface and browser video
capture. Native Apple Silicon build with segmented, resumable transfers.

**Based on:** the open-source [Awesome Downloader for macOS](https://github.com/abuzargifari/awesome-downloader-mac)
preview, which was itself ported from
[Awesome Downloader for Windows](https://github.com/TheAwesomeDeveloper/Awesome-Downloader-for-Windows).
MDM is an independent macOS fork with its own name, bundle identity and build.

**Early preview:** private/sign-in-required media, DRM and live streams are
unsupported.

## Features

- Multi-segmented parallel HTTP(S) downloads with real per-connection progress.
- Pause/resume for supported transfers, download history, scheduling and a global
  speed limiter.
- Download File Info dialog with custom save folder, categories, Download Later,
  and Start.
- Separate progress and completion windows, with duplicate-download prevention.
- Chrome / Edge / Brave / Opera video detection and quality selection; the chosen
  video and audio tracks are combined locally with FFmpeg.
- YouTube support through two independent paths: browser capture (works without
  any extra binary) and direct YouTube URL paste (uses the bundled `yt-dlp`).
- Native macOS integration: menu bar tray, dock icon, DMG installer and a native
  messaging bridge for the browser extension.

## Installation

1. Download **MDM-0.1.1-macOS-arm64.dmg** from the
   [releases page](https://github.com/mahfuj2348/mdm/releases) (Apple Silicon).
2. Open the DMG and drag **MDM** into your **Applications** folder.
3. Launch MDM from Applications or Spotlight.

The build is ad-hoc signed, not notarised. If macOS warns on first launch, open
**System Settings → Privacy & Security** and choose **Open Anyway**.

## Browser Extension Setup (Chrome / Edge / Brave / Opera)

Once the extension is listed in a browser store it installs in one click and
updates itself. Until then — or when testing local changes — load it by hand:

The extension adds one-click video detection and download:

1. Click **Browser Integration** in the MDM toolbar.
2. Click **Copy extension folder path**.
3. Click **Open Chrome extensions** (or your browser's extensions page).
4. Turn on **Developer mode**.
5. Click **Load unpacked**, press **Cmd+Shift+G**, paste the copied path, and
   select the folder.
6. MDM connects to the extension automatically. Refresh any video page to see the
   download button.

Building a submission package and the store steps are in
[docs/STORE-PUBLISH.md](docs/STORE-PUBLISH.md).

## Privacy

MDM runs entirely on your Mac and has no telemetry, analytics or crash reporting:

- The desktop↔browser bridge listens on `127.0.0.1` only, requires a random
  per-session bearer token, rejects cross-origin requests and accepts only JSON
  with an allow-listed set of fields.
- The extension keeps captured cookies, authorization headers and referrers in
  memory and forwards them only for the URL you selected. Credentials are
  stripped from history and on cross-origin redirects.
- Browser pages can never choose a filesystem path, and unknown headers are
  dropped by the native host.
- The only outbound connections are the downloads you start.

See [SECURITY.md](SECURITY.md) for the reporting process.

## Development

```bash
npm install     # install dependencies
npm test        # run the automated test suite
npm start       # run the desktop app from source
npm run dist    # build the DMG into ./release
```

Building requires Node.js 22+ and macOS.

## License

Project code is [MIT licensed](LICENSE). Bundled third-party binaries keep their
own licenses — see [THIRD-PARTY.md](THIRD-PARTY.md).
