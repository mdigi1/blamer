# Blamer

A lightweight, no-build web app that picks a random winner from a list using a spinning wheel.

## What It Does

- Lets you add and remove participant names.
- Renders a colorful wheel on `<canvas>` with one segment per name.
- Spins with easing animation and selects a random winner.
- Highlights the winner in the list and result area.
- Shows celebration effects (confetti + fullscreen winner overlay).
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
- Winner appears in the result row and fullscreen celebration overlay.

## Project Structure

- `index.html`: app layout and UI elements
- `style.css`: theme, layout, responsive styles, and animations
- `script.js`: state management, wheel drawing, spin logic, and interactions

## Customization

Edit `script.js` to tune behavior:

- Default names: `let names = [...]`
- Wheel palette: `const sliceColors = [...]`
- Spin duration: `const duration = 7000` (milliseconds)
- Confetti amount: loop count in `showWinnerBurst()`

## Current Notes

- Names are stored in memory only (page refresh resets the list).
- Random selection uses `Math.random()` (not cryptographically secure).
