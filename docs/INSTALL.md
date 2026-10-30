# Install and use MDM

## Download

Open **[Latest release](https://github.com/mahfuj2348/mdm/releases/latest)**:

- **Windows 10/11 x64:** download `MDM-0.1.2-Windows-x64-Setup.exe`, run it and follow the wizard. Open MDM from Start or the desktop shortcut.
- **Apple Silicon Mac:** download `MDM-0.1.2-macOS-arm64.dmg`.
- **Intel Mac:** download `MDM-0.1.2-macOS-x64.dmg`.

No Git, Node.js, Python or terminal is needed. The Windows installer is unsigned,
so an unknown-publisher prompt may appear. Video speed depends on the source server.

The build is ad-hoc signed, not notarised, so macOS may refuse the first launch.
Do not disable Gatekeeper system-wide. Instead open **System Settings → Privacy &
Security**, find the blocked-item notice for MDM and choose **Open Anyway**. You
can verify the download against the SHA-256 checksum published with the release.

Open the DMG and drag **MDM** into **Applications**. Launch it from Applications
or Spotlight. Keep the app in Applications so browser integration can find it.

## Enable video buttons (Chrome / Edge / Brave / Opera)

The browser extension adds **Download this video** buttons to supported videos. It
is included with the installed application; there is no separate ZIP to download.
Add it once per browser:

1. The app shows **Browser integration** on first launch. You can open it later
   from the toolbar.
2. Click **Copy extension folder path**. This copies the location of the extension
   that came with the app — not your downloads folder.
3. Click the button for **Chrome**, **Edge**, **Brave**, or **Opera**. If the
   button cannot find your browser, type `chrome://extensions`,
   `edge://extensions`, `brave://extensions` or `opera://extensions` in that
   browser's address bar.
4. Switch on **Developer mode**.
5. Click **Load unpacked**. A file picker opens.
6. On macOS, press **Cmd+Shift+G** and paste the copied path. On Windows, paste it into the file picker address bar. Press **Enter**.
7. Select the **extension** folder itself — not a file inside it and not its
   `icons` subfolder — then click **Select**.
8. The Extensions page should now list **MDM Integration** with its switch on.
   Leave Developer mode on while using this unpacked build.
9. Return to MDM. The panel re-checks automatically and reports the connection.
   No extension ID or commands are needed.
10. Return to the video site, refresh the page and start playback. Use **Download
    this video** when it appears.

### Which folder should I choose?

The app displays the exact path under **Included browser extension folder**. For a
normal install it looks like:

`/Users/YOUR-MAC-USERNAME/.mdm/BrowserIntegration/extension`

**Copy extension folder path** copies your real path. **Show extension folder**
reveals it in Finder. The folder contains `manifest.json` and `icons`; you select
the enclosing `extension` folder. Do not move or delete it after loading it.

### If setup does not work

- **“Manifest file is missing or unreadable”:** click **Show extension folder** in
  MDM, confirm the opened folder contains `manifest.json`, and load that exact
  folder — not the app bundle, Downloads, `manifest.json` itself or `icons`.
- **No connection message:** keep MDM running, confirm the extension is enabled in
  the same browser, click **Refresh browsers**, then reload the extension.
- **No video button:** refresh the page and start playback. Some sites and
  protected media are not supported.
- **No Developer mode:** a workplace or school profile may block unpacked
  extensions.

Only install the extension if you trust this project. Its permissions let it
detect media and hand the selected session to the desktop app.

## Download a file or video

- For a direct link, use **Add URL** in the app.
- For a supported video, play it briefly, click **Download this video**, and pick a
  quality. Only save content you are permitted to download.
- In **Download File Info**, choose name, folder and category, then **Start
  Download**, **Download Later**, or **Cancel**.
- Progress opens in its own window; on completion use **Open** or **Open folder**.
- Repeated clicks reuse the active download.

Closing the main window keeps MDM in the menu bar. Use **MDM → Quit** to exit.
Paused YouTube sessions can expire; reselect the video in the browser if resuming
fails later. DRM, private/sign-in-required video and live streams are not
supported.

## Updates and uninstall

Quit MDM before installing a newer release. After updating, reload the extension on
the browser's extensions page and refresh your video tabs.

On Windows, uninstall MDM from **Settings → Apps**.
On macOS, drag **MDM** from Applications to the Trash. Remove the browser
extension separately. Downloads and the `~/.mdm` folder are not deleted
automatically. There is no automatic updater yet.
