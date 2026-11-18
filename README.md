# Divi’s Study Village

A personal, iPad-first CA study companion. An original Japanese-countryside theme, Mylo as the main study companion, and Deepansh’s mini-avatar. Character artwork and animation frames now use the Gemini-generated design sheets supplied by the user. The original camera photographs are **not** included in this repository or uploaded by the app.

## Run locally

Node.js 24+ and npm are recommended.

```sh
npm install
npm run dev
```

Open the displayed local URL. On an iPad on the same Wi-Fi, use your Mac’s LAN IP and port 5173. Allow the local network/firewall prompt if needed. HTTP LAN previews do not support all installation, offline, or native-sharing capabilities; use HTTPS hosting for normal iPad use.

## Build and host

```sh
npm run build
npm run preview
```

Deploy `dist/` to a static HTTPS host such as Netlify, Vercel, or Cloudflare Pages. No account system, API keys, database, or server functions are required. No deployment has been made automatically.

In Safari on the iPad, use **Share → Add to Home Screen**. Allow the first online visit to finish before going offline. The production build precaches the app, illustrations, and locally bundled fonts. A service worker is intentionally not registered by the development server.

## Features

- 50-day journey with date-based study records, configurable minimum/target, streaks and progress.
- Manual study hours, three editable intentions, practical/theory tags, subjects, moods, phone/sleep habits, and private reflections.
- Timestamp-based 25-minute focus / 5-minute break timer, pause/resume, reload recovery, optional sound, and idempotent session credit.
- Subject previous marks/goals; daily/chapter/mock test entry, editing, deletion, score histories, and filtered percentage trends.
- Weekly hours, study-type balance, seven companion levels, and eleven derived achievement badges.
- Private encouragement notes and target-completion celebrations from Deepansh and Mylo, using the supplied mini-avatar designs.
- Registered sprite animations: Mylo’s tail wag, playful pounce, sleepy nuzzle and ear scratch; mini-you’s cheer, reading/thinking, warm drink, heart kiss, laptop work and plant watering. Motion is deliberately infrequent, pauses during focus, respects Reduce Motion, and can be disabled with the sparkle button or Settings. The cheer plays once, then rests on a happy pose.
- A Ghibli visitors’ corner with 22 recognizable favorites. Fifteen use the supplied generated designs; the remaining seven use custom SVG fan art. Choose a visitor to stay nearby or allow a daily rotation. Mylo remains the main companion.
- PNG share cards, native file sharing where available, image download and WhatsApp text fallback. Private reflections, test scores, and romantic notes are excluded.
- Light/dark themes, responsive portrait/landscape/Split View layouts, native accessible dialogs, keyboard focus, and reduced-motion support.
- Validated JSON backup/restore, explicit destructive-action confirmations, and separate challenge restart/all-data reset.

## Personalize

- Mylo is Divi’s study companion. His name can still be changed in **Make it yours**. Existing saves with the original placeholder name are upgraded without changing study data or a custom name.
- Edit `NOTES` in `src/App.tsx` to replace the draft messages with your own words. These drafts are not represented as actual quotations.
- Private greetings rotate daily between **Divi**, **Babe**, and **Pyaari Pyaari**; encouragement notes and celebrations mix them naturally too. The profile and public share cards continue to use Divi. The rotation lives in `src/personalization.ts` and does not change on timer ticks.
- `src/Illustrations.tsx` uses the supplied raster artwork within accessible SVG frames, with the original vector illustrations retained as loading-error fallbacks. No image-generation credentials are needed.
- There are 13 mini-you poses, 15 supplied Ghibli designs, and ten animation atlases containing 50 registered frames. Transparent, lossless WebP assets occupy about 2.45 MiB in total. Shapes and tattoos are preserved from the supplied designs rather than redrawn.
- Background removal uses edge-connected near-white regions, so white shorts and pale character bodies stay intact. Each animation frame has an explicit ground line and horizontal registration anchor; printed row labels and neighboring figures are excluded.
- To regenerate assets locally, install Pillow and numpy in a Python environment, keep the supplied sheets in Downloads, and run `python scripts/prepare_character_assets.py`. Optional flags: `--source-dir`, `--output-dir`, `--contact-sheet`. This does not upload anything. The full sheets need not be deployed.
- Defaults: Divi; seven-hour target; two-hour streak minimum; challenge begins on first visit. Change these in Settings.
- CA subjects include common Intermediate/Final subjects, but no exam level or attempt was assumed.

## Data and timing rules

- Data is stored locally under `divi-study-village-v1` in `localStorage`, with a versioned schema. It is not synced or sent to a backend.
- Browser data can be cleared or evicted. **Export backups to iCloud Drive regularly.** Private browsing is not recommended.
- A completed focus session credits exactly **25 minutes**, not 30. Manual study time means **additional time outside the timer**; do not enter timer minutes again.
- Sessions are credited to the calendar date on which they started, even across midnight. A break does not credit time, and an unfinished timer does not credit partial time.
- Timers use timestamps rather than decrementing interval counters. On returning from background/reload, an overdue session completes once. The next mode waits for explicit Start; background time does not create multiple automatic sessions.
- The challenge timezone is captured on first visit and kept fixed. Calendar calculations are independent of daylight-saving 23/25-hour days.
- A day qualifies for a streak at the configured minimum; the larger daily target is separate. An uncompleted today does not break yesterday’s streak before the day ends.
- Hours, points, and achievements shown in the journey use the 50 challenge dates up to today. Subject tests remain available independently of challenge dates.
- Changing a start date does not move existing dated logs. Restart explicitly clears all daily logs and sessions, but retains subjects/tests/preferences. Erase all data removes everything.
- Points: 10 per study hour (rounded to nearest point), plus 10 per completed intention, phone-away habit, and protected-sleep habit on days with actual study time. Badges/levels recalculate from corrected data.
- Share sheets are not proof that an image/message was sent. The app does not claim delivery.
- iPadOS can suspend Safari or suppress sounds with screen lock. **The timer is not a guaranteed background alarm.**
- Avoid editing in multiple tabs simultaneously. Sequential changes are mirrored via storage events, but localStorage is not a transactional multi-writer database.

## Verification

```sh
npm test
npx playwright install chromium webkit
npm run test:e2e
npm run test:offline
npm run build
npm audit --omit=dev
```

The unit suite covers dates/timezones, streaks, points, actual timer minutes, idempotency, badge corrections, invalid backups, visitor selection, and asset-manifest checksums. Browser tests run on simulated iPad Chromium and WebKit for layouts, daily logging, celebrations, notes, progress-card export, reload recovery, test CRUD, backup/restore, visitor pinning/rotation, transparent image decoding, actual sprite-frame advancement, motion controls, accessibility, and unreadable-storage protection.

Testing uses iPad browser emulation in Chromium and WebKit, with portrait, landscape, touch interactions and Split View-sized layouts. No physical iPad is required for the development checks. This is browser/device emulation, not an Xcode iPadOS Simulator run: native share-sheet delivery, software keyboard behavior, home-screen installation, VoiceOver and locked-screen alarms remain outside the verified scope.

Runtime dependencies have no known npm audit advisories at verification time. The development-tool chain currently reports an upstream `picomatch` ReDoS advisory (also surfaced through Vite/globbing dependents); the latest published picomatch version is still affected. Do not expose the development server to the public internet. Deploy the static production build, and recheck toolchain updates before deployment.

## Files

- `src/App.tsx` — screens, interactions, forms, private notes and export/share controls.
- `src/model.ts` — typed state, validation, dates, progress, timer and reward calculations.
- `src/Illustrations.tsx` — supplied mini-you/Mylo art, sprite integration, vector fallbacks, and original village illustration.
- `src/GhibliVisitors.tsx`, `src/ghibli.ts` — character collection, supplied art, additional SVG visitors, pinning and daily rotation.
- `src/SpriteStrip.tsx`, `src/characterAssets.ts`, `src/characters.css` — accessible atlas playback, pose selection and discrete animation timing.
- `public/characters/` — transparent character assets, registered atlases and checksum manifest.
- `scripts/prepare_character_assets.py` — reproducible local cropping, white-background cleanup and sprite registration.
- `src/styles.css` — responsive visual system and themes.
- `public/sw.js` — production offline shell; cache ID is versioned per build.
- `public/fonts/` — self-hosted DM Sans and Lora variable fonts, with SIL Open Font License notices.
- `src/model.test.ts`, `e2e/village.spec.ts` — calculation and browser regression coverage.

The implementation independently reproduces useful feature concepts from the reference, not its source, branding, artwork, layout, or promotional links.
