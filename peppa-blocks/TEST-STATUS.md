# Version 2.0 verification

Local rules: 24 tests passed, including two geometrically different solutions for all five levels; structural span/support, boat clearance, ramp orientation, cart headroom, house interior/roof/walls, picnic route/shelter, invalid placements and budget.

Browser suite: five chapters solved with actual pointer clicks and rotations, animated trial gating, retry and improvement, drag-grab offset, return/undo, progressive hints, save/reload, free-workshop persistence, mobile portrait/landscape visibility. Run by GitHub Actions; inspect latest workflow result.

Android suite: installs the generated APK on Android 11/API 30, checks offline menu and first-level navigation using native taps; uploads screenshots.

Limitations: No physical-device or child playtest yet. Spoken output depends on an installed Chinese TTS voice. Structural checks model rigid click-connected assemblies; this is 2.5D, not a free-camera 3D physics game.
