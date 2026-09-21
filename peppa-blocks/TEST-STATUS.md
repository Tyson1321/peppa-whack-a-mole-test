# Version 2.0 verification — PASSED

Tested source: 9b30370fe956f53c425f6774d3c6f5478c6939f6
Workflow: https://github.com/Tyson1321/peppa-whack-a-mole-test/actions/runs/35615068879
APK SHA256: 365909067ef8c2fc72afefafab8d4d59dabec2a13ca005bccdfa5a64ee90a208

24 rules tests passed, including two geometrically different solutions for each chapter; span/support, boat clearance, ramp orientation, cart headroom, room/roof/walls, picnic goals, invalid placements and budgets.

Chromium: all five chapters solved with actual pointer clicks and rotations; animated trials, editing lock, improvement/replay, grab offset, return/undo, hints, save/reload and free workshop passed. Portrait 390x844 and landscape 844x390 control visibility passed. Screenshots reviewed.

Android 11/API 30 Pixel 2 emulator: installed the final APK; offline menu and navigation passed. Native adb taps selected, rotated and placed all blocks for all five solutions. All five animated trials passed; no captured JavaScript errors. Each completion dialog was verified entirely inside the viewport. Fixed old-WebView incompatibility with CSS inset. Log marker: ANDROID_FIVE_CHAPTERS_OK.

APK ZIP integrity and asset equality with the tested source checked. APK uses a new debug signing certificate; an installed v1 needs uninstalling before v2 can be installed. Uninstalling removes v1 local progress.

Limitations: No physical-device or child playtest. Chinese narration requires an installed Chinese TTS voice. Structural checks model rigid click-connected assemblies; this is a 2.5D puzzle, not a free-camera 3D rigid-body simulation.
