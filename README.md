# Blamer

A lightweight, no-build web app that picks a random target from a list using a spinning wheel.

## What It Does

- Lets you add and remove participant names.
- Renders a colorful wheel on `<canvas>` with one segment per name.
- Spins with easing animation and selects a random target.
- Shows rotating dev phrases under the wheel while it is spinning.
- Highlights the target in the list and result area.
- Shows celebration effects (confetti + fullscreen target overlay).
- Runs a continuous falling “bug rain” effect with common error messages and bug icons.
- Displays the current date and refreshes it every minute.

## Tech Stack

- HTML (`index.html`)
- CSS (`style.css`)
- Vanilla JavaScript (`script.js`)
- No framework, bundler, or external dependencies

## Run Locally

No install step is required.

1. Clone/download the repo.
2. Open `index.html` directly in a browser.

Recommended (avoids browser quirks with local files):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Usage

- Type a name and click `Add` (or press `Enter` in the input).
- Remove a name with the `×` button on its chip.
- Start a spin by:
  - clicking `Spin`,
  - clicking the wheel,
  - pressing `Space` (when input is not focused).
- Target appears in the result row and fullscreen celebration overlay.

## Project Structure

- `index.html`: app layout and accessible UI anchors
- `style.css`: theme, layout, responsive styles, and animation system
- `script.js`: app logic (`dom/config/state/helpers` organization)
- `bug-icon*.svg`: falling bug icon assets
- `favicon.svg`: tab icon

## Customization

Edit `script.js` to tune behavior:

- Default names: `state.names = [...]`
- Wheel palette: `SLICE_COLORS`
- Spin timing: `CONFIG.timing.spinDurationMs`
- Target fullscreen duration: `CONFIG.timing.targetBlastMs`
- Confetti intensity: `CONFIG.confetti.count`
- Spin phrases: `SPIN_PHRASES`
- Bug rain speed/intensity: `CONFIG.timing.bugRainIntervalMs`, `CONFIG.bugRain.dropsPerTick`
- Bug rain messages/icons: `CONFIG.bugRain.texts`, `CONFIG.bugRain.icons`

## Current Notes

- Names are stored in memory only (page refresh resets the list).
- Random selection uses `Math.random()` (not cryptographically secure).
