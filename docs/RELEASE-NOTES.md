MDM now has installers for Windows x64, Apple Silicon Macs and Intel Macs.

Download the file for your computer:
- **Windows:** `Windows-x64-Setup.exe` — run the setup wizard. Node.js is not required.
- **Apple Silicon Mac:** `macOS-arm64.dmg` — drag MDM to Applications.
- **Intel Mac:** `macOS-x64.dmg` — drag MDM to Applications.

The extension is included in the app. Open **Browser Integration**, copy its folder path, then use **Load unpacked** on your browser's extensions page. Reload the extension and refresh video tabs after upgrading.

Changes:
- YouTube feed download buttons follow the thumbnail link so replacing the hover preview does not remove the button. The menu sends the selected video to MDM.
- The standalone Chromium extension now has a consistent ID across install folders. The desktop connector registers that ID automatically.
- Download buttons stay reachable across scrolling, partial visibility and disappearing hover previews. Open quality menus and keyboard focus are retained.
- Ranged video/audio downloads use parallel connections instead of one connection per track.
- Progress refreshes every 200 ms; speed uses measured bytes over a rolling two-second window. Server stalls still show zero; server-side limits and expiring video sessions still apply.
- Windows browser setup and bundled native messaging launcher; verified platform-specific yt-dlp.

These builds are unsigned/ad-hoc signed and are not notarised. macOS may require **Privacy & Security → Open Anyway**; Windows may show an unknown-publisher prompt. Browser store installation and automatic updates are not available yet. DRM and live streams are unsupported. SHA256SUMS.txt contains installer checksums.
