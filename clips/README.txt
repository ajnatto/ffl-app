Drop your own exercise videos here, named EXACTLY by exercise id.

  goblet_squat.mp4
  lat_pulldown.mp4
  pelvic_tilt_lying.mp4

That is the whole procedure — there is no list to register them in and no mapping
table. The build scans this folder, checks each filename against the exercise catalog
in src/exercises.js, and wires the valid ones into the app automatically so they are
also cached for offline use.

Rules:
  - the filename (minus .mp4) must be an exercise id from src/exercises.js
  - files that are not exercise ids are ignored by the build and reported in its output
  - after adding clips, re-run the build:  node build.mjs
  - a raw download named v12044gd0000cgsavqrc77u2nc2v9r4g.mp4 does nothing until renamed

To find the id for an exercise, search src/exercises.js for its display name.
Keep this folder next to FitForLife.html.