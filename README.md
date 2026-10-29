# Bubble Bounce

A mobile-first bubble-breaker game, written in plain HTML, CSS and JavaScript. No packages, build step, external fonts or third-party assets are required.

## Play
Open `index.html` to play locally. Drag the paddle with your finger, move the mouse, or use the Left/Right arrow keys. Tap the play area (or press Space) to launch the ball. Space also pauses/resumes. Clear every bubble to advance; each bubble earns 10 points. You have three lives.

## Run the installable PWA
Upload **all files in this folder** to the same folder on an HTTPS static host. Keep the manifest, service worker and icons next to index.html. Open the hosted URL directly in a full browser tab, not inside an embedded file preview.

For desktop development only:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Open `http://localhost:8080`. Plain HTTP via a LAN IP is not a secure context and usually cannot install a PWA; use an HTTPS host when testing on a phone.

## Install behavior
- The Install App button appears at the top in a normal browser tab.
- On supporting browsers (commonly Chrome/Edge), it opens the native installation prompt when available.
- On iOS, it shows Safari Share → Add to Home Screen instructions. Other browsers get their menu instructions.
- It hides in standalone/fullscreen app mode, after the `appinstalled` event, or after an accepted native install prompt. Successful installation is remembered in that browser's local storage.
- Browsers do not provide a universal API to detect installation or uninstallation across all platforms. In iOS browser tabs, prior home-screen installation may not be detectable. The button always hides when the installed app itself is opened. If the browser offers a new native install prompt, the saved installed flag is reset.
- Offline play works after the service worker has successfully cached the app on its first online load. Installation can be delayed or unavailable if the browser's PWA requirements are not yet satisfied.

## Files
- `index.html`: game, UI, CSS, JavaScript and install handling
- `manifest.webmanifest`: PWA metadata
- `sw.js`: offline cache
- `icon.svg` and PNG icons: app artwork

High scores and sound preferences are saved on the device when local storage is available. Sound is ON by default (it starts on the first Play tap, as browsers require a tap); the speaker button mutes it and the choice is remembered. The game pauses when the tab loses focus.

When releasing changes, update the cache version in sw.js (for example v1 to v2).

## Version 2 — focused full-screen layout

Removed the introductory copy, personal-best card, pro-tip card, instructions sidebar and footer. Score/level/lives sit directly above the full-height playfield. Mobile layout fits the available viewport without page scrolling and respects safe-area insets. Removed backdrop blur and animated canvas shadow blur. Bubbles now use a tighter approximately 6px gap on a typical phone. The PWA offline cache has been bumped to v2. High scores remain saved internally.

## Version 3 — faster, mobile-first

- Fixed logical playfield (360 wide, height capped at 1.75x), so bubbles, ball and paddle are large and touchable on any screen; no more "cricket ground".
- Ball speed is relative to field height (about 1.7x faster than v2 on phones) and ramps up per level; rallies never go flat-horizontal.
- Relative touch control: drag anywhere with 1.5x sensitivity, so your finger never covers the paddle. Paddle follows almost instantly and has a forgiving hit zone. Paddle is raised above the bottom gesture bar.
- Speed: bubbles and background are pre-rendered sprites instead of per-frame gradients/dots; low-latency canvas.
- Phones: header/footer removed, edge-to-edge; bigger 44px buttons. Install button moved into the menu. Resizing (URL bar hide/show) no longer pauses the game. Light vibration on losing a life.
- Cache bumped to v3.

## Version 4 — MP3 sound effects
Drop MP3 files into `sounds/` (see `sounds/README.txt` for the 7 names). They load as Web Audio buffers for zero-latency playback and are cached for offline play. Any missing file falls back to the old synthesized beep. Cache bumped to v4.

v4: sound is on by default; users who muted it keep it muted.
