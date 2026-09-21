# Version 2.0 verification — PASSED

Tested source: a34be7b40c9bac96b464ad5f2a5e05a5334260d5
Workflow: https://github.com/Tyson1321/peppa-whack-a-mole-test/actions/runs/35586798151
APK SHA256: 25f7ac1e776a422710b766a85880ebb5777ee6116dd98d24e32246b306e7f42d

24 rules tests passed, including two geometrically different solutions for each chapter; span/support, boat clearance, ramp orientation, cart headroom, room/roof/walls, picnic goals, invalid placements and budgets.

Chromium: all five chapters solved with actual pointer clicks and rotations; animated trials, editing lock, improvement/replay, grab offset, return/undo, hints, save/reload and free workshop passed. Portrait 390x844 and landscape 844x390 control visibility passed. Screenshots reviewed.

Android 11/API 30 Pixel 2 emulator: installed the final APK; offline menu and navigation passed. Native adb taps selected, rotated and placed all blocks for all five solutions. All five animated trials passed; no captured JavaScript errors. Log marker: ANDROID_FIVE_CHAPTERS_OK.

APK ZIP integrity and asset equality with the tested source checked. APK uses a new debug signing certificate; an installed v1 needs uninstalling before v2 can be installed. Uninstalling removes v1 local progress.

Limitations: No physical-device or child playtest. Chinese narration requires an installed Chinese TTS voice. Structural checks model rigid click-connected assemblies; this is a 2.5D puzzle, not a free-camera 3D rigid-body simulation.
