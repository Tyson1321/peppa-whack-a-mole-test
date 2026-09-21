# 佩奇的积木乐园 2.0 — 小小工程师

Offline Android block-building puzzles for children aged 5–6. Five connected story challenges, ten selectable blocks, no time limit. Build bridges, stairs, a cart route, a room and a combined picnic camp. Chinese narration uses the device's Chinese TTS voice; music and interaction sounds are synthesized locally.

## What changed from 1.0
- No exact-cell solution mask: success depends on a traversable surface, slope, headroom, clear room and ground support.
- Real triangular slope geometry: four orientations provide gentle/steep ascending/descending ramps. Carts cannot climb vertical steps.
- Animated Peppa-family trial follows the validated path, stops at obstacles, and highlights the problem after repeated attempts.
- Click-connected rigid assemblies: centre-of-mass, support spans and overhang checks. This is a simplified 2.5D structural model, not a full 3D rigid-body simulator.
- Five levels have at least two tested geometrically different solutions. Room and shelter placement is flexible within the scene.
- Free workshop, draft autosave, undo, return to tray, best piece count and distinct-build records.
- First completion earns two stars; using the chapter's target block count or fewer earns a third. All chapters remain accessible.

## Controls
Drag a block from the tray, or select it and tap a location. Drag an existing block without changing the grab offset. Select and rotate; return a block with 收回. 请大家试一试 runs a visible trial. 继续改进 preserves the current build. 再搭一种 clears it with undo available. Drafts and progress save locally.

## Build and tests
`node tests/engine.test.js`
`npm install --no-save playwright@1.51.1 && npx playwright install --with-deps chromium`
`node tests/ui.test.js`
`gradle --no-daemon :app:assembleDebug`

GitHub Actions runs rules and interaction checks, builds the APK and installs/launches it in an API 30 emulator. UI test screenshots and Android smoke screenshots are uploaded as artifacts. A child's playtest is still needed to assess enjoyment and tune difficulty.

Family artwork is stylized fan artwork. No original animation or voice recordings are included. No ads, accounts, purchases or network permission.
