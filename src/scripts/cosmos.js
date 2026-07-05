/* ═══════════════════════════════════════════════════════════
   Kimberly Dumaine — living cosmos hero + page interactions
   Canvas layers: drifting nebula clouds → twinkling parallax
   starfield → rising spirit motes → rare shooting stars →
   soft cursor halo. Calm, slow, high-vibration motion.
   ═══════════════════════════════════════════════════════════ */

(() => {
	"use strict";

	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	/* ─────────── nav: scrolled state + mobile toggle ─────────── */

	const nav = document.getElementById("siteNav");
	const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	const toggle = document.getElementById("navToggle");
	toggle.addEventListener("click", () => {
		const open = nav.classList.toggle("open");
		toggle.setAttribute("aria-expanded", String(open));
	});
	// close mobile menu when a link is chosen
	nav.querySelectorAll("nav a").forEach((a) =>
		a.addEventListener("click", () => {
			nav.classList.remove("open");
			toggle.setAttribute("aria-expanded", "false");
		}),
	);

	/* ─────────── scroll-reveal ─────────── */

	const revealEls = document.querySelectorAll(".reveal");
	if (reduceMotion || !("IntersectionObserver" in window)) {
		revealEls.forEach((el) => el.classList.add("in"));
	} else {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add("in");
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12 },
		);
		revealEls.forEach((el) => io.observe(el));
	}

	/* ═══════════════ COSMOS CANVAS ═══════════════ */

	const canvas = document.getElementById("cosmos");
	if (!canvas) return;
	const ctx = canvas.getContext("2d");

	let W = 0,
		H = 0,
		dpr = 1;

	const rand = (min, max) => min + Math.random() * (max - min);
	const TAU = Math.PI * 2;

	/* palette used by particles (rgb triplets for alpha compositing) */
	const STAR_TINTS = [
		[245, 243, 255], // white
		[245, 243, 255],
		[245, 243, 255],
		[89, 217, 232], // cyan
		[167, 139, 250], // soft violet
	];
	const MOTE_TINTS = [
		[89, 217, 232], // cyan
		[45, 212, 191], // teal
		[245, 243, 255], // white
		[167, 139, 250], // violet
	];

	/* ── nebula clouds: huge soft radial blobs, drifting on sine paths ── */
	const NEBULA_HUES = [
		[69, 39, 160], // royal violet
		[27, 17, 80], // deep indigo
		[16, 42, 105], // deep blue
		[88, 48, 175], // brighter violet
		[10, 70, 90], // dark teal glow
		[46, 26, 120],
	];

	/* ── FM wave lines: stacked horizontal sine waves, frequency-modulated ──
     Two-stage cascade FM synthesis, like an FM synth patch:
       mod2 (slow) modulates mod1, mod1 modulates the carrier.
     Tweak live in the browser console via `WAVES.<knob> = value`. */
	// const WAVES = {
	// 	enabled: true,
	// 	count: 36, // number of stacked lines
	// 	bandTop: 0.04, // top of the stack (fraction of hero height)
	// 	bandBottom: 0.9, // bottom of the stack
	// 	alpha: 0.3, // line opacity — keep whisper-quiet
	// 	lineWidth: 0.5,
	// 	segments: 360, // horizontal sample resolution per line
	//
	// 	baseAmp: 22, // wave height in px
	//
	// 	carrierFreq: 9.0, // carrier cycles across the viewport width
	// 	mod1Ratio: 0.33, // mod1 frequency as a RATIO of the carrier (non-integer = inharmonic, organic)
	// 	mod1Index: 4.1, // ★ mod1 depth in radians — THE main complexity dial (0 = pure sine)
	// 	mod2Ratio: 0.11, // mod2 frequency ratio (slow undulation layered underneath)
	// 	mod2Index: 0.5, // ★ mod2 depth — how much the undulation warps mod1
	//
	// 	driftSpeed: 0.045, // carrier phase drift, cycles/sec
	// 	mod1Speed: 0.03, // mod1 phase drift — beats against driftSpeed to keep shapes evolving
	// 	mod2Speed: 0.012, // mod2 phase drift — very slow tectonic movement
	//
	// 	breatheSpeed: 0.3, // amplitude breathing, cycles/sec
	// 	breatheDepth: 0.1, // 0 = steady, 1 = lines swell to double / collapse to nothing
	//
	// 	/* per-line divergence — ALL default 0, so every line is the exact same
	//       function and the stack aligns perfectly. Nudge these up a hair at a
	//       time to let neighbors drift apart. */
	// 	phaseStep: 0, // carrier phase offset per distance-from-center (radians) — try 0.05–0.2
	// 	detuneStep: 0.04, // carrier freq offset per distance-from-center — try 0.01–0.04
	// 	mod1PhaseStep: 0.1, // mod1 phase offset per distance-from-center — try 0.05–0.15
	// 	ampStep: -0.04, // amplitude multiplier delta per distance-from-center — try ±0.01–0.03
	// 	stepCurve: 1.15, // falloff shape: distance^stepCurve. 1 = linear, 2 = gentle near center then steep, 0.5 = steep near center then flat
	//
	// 	edgeFade: 0.12, // fraction of width over which lines fade in from each edge (0 = hard edge-to-edge)
	// 	tintA: [138, 118, 250], // violet — left/right of the blend
	// 	tintB: [89, 217, 232], // cyan — center of the blend
	// };
	// const WAVES = {
	// 	enabled: true,
	// 	count: 32, // number of stacked lines
	// 	bandTop: 0.1, // top of the stack (fraction of hero height)
	// 	bandBottom: 0.9, // bottom of the stack
	// 	alpha: 0.3, // line opacity — keep whisper-quiet
	// 	lineWidth: 0.5,
	// 	segments: 360, // horizontal sample resolution per line
	//
	// 	baseAmp: 10, // wave height in px
	//
	// 	carrierFreq: 6.0, // carrier cycles across the viewport width
	// 	mod1Ratio: 0.13, // mod1 frequency as a RATIO of the carrier (non-integer = inharmonic, organic)
	// 	mod1Index: 0.1, // ★ mod1 depth in radians — THE main complexity dial (0 = pure sine)
	// 	mod2Ratio: 4.11, // mod2 frequency ratio (slow undulation layered underneath)
	// 	mod2Index: 0.5, // ★ mod2 depth — how much the undulation warps mod1
	//
	// 	driftSpeed: 0.05, // carrier phase drift, cycles/sec
	// 	mod1Speed: 0.03, // mod1 phase drift — beats against driftSpeed to keep shapes evolving
	// 	mod2Speed: 0.012, // mod2 phase drift — very slow tectonic movement
	//
	// 	breatheSpeed: 0.1, // amplitude breathing, cycles/sec
	// 	breatheDepth: 0.2, // 0 = steady, 1 = lines swell to double / collapse to nothing
	// 	breatheSquish: 1, // squish-aware breathing: 0 = every line breathes with full breatheDepth, 1 = depth scales with the line's LOCAL spacing (tightly squished lines breathe proportionally less, sparse lines more)
	//
	// 	/* per-line divergence — ALL default 0, so every line is the exact same
	//       function and the stack aligns perfectly. Nudge these up a hair at a
	//       time to let neighbors drift apart. */
	// 	phaseStep: 1.5, // carrier phase offset per distance-from-center (radians) — try 0.05–0.2
	// 	detuneStep: 0.0, // carrier freq offset per distance-from-center — try 0.01–0.04
	// 	mod1PhaseStep: 0.1, // mod1 phase offset per distance-from-center — try 0.05–0.15
	// 	ampStep: 0.2, // amplitude multiplier delta per distance-from-center — try ±0.01–0.03
	// 	ampCurve: 1.15, // falloff shape for ampStep ONLY: distance^ampCurve. <1 tames the edges (growth flattens out), >1 back-loads it. Other *Step knobs keep using stepCurve.
	// 	stepCurve: 1.15, // falloff shape: distance^stepCurve. 1 = linear, 2 = gentle near center then steep, 0.5 = steep near center then flat
	// 	alphaStep: 0, // alpha multiplier delta per distance-from-center (uses stepCurve) — try -0.02 to fade outer lines, clamped 0..1
	// 	squish: 1, // y-spacing STRENGTH: 0 = even spacing (squishCurve ignored), 1 = spacing fully follows squishCurve, in between = blend. >1 exaggerates, negative inverts the curve.
	// 	squishCurve: 0.55, // y-spacing SHAPE (exponent): <1 = outer lines bunch toward the band edges, >1 = lines cluster around the center line, 1 = even. Band top/bottom stay pinned.
	//
	// 	edgeFade: -0.35, // fraction of width over which lines fade in from each edge (0 = hard edge-to-edge)
	// 	tintA: [138, 118, 250], // violet — left/right of the blend
	// 	tintB: [89, 217, 232], // cyan — center of the blend
	// };
	const WAVES = {
		enabled: true,
		count: 50, // number of stacked lines
		bandTop: 0.1, // top of the stack (fraction of hero height)
		bandBottom: 0.9, // bottom of the stack
		alpha: 0.3, // line opacity — keep whisper-quiet
		lineWidth: 0.5,
		segments: 180, // horizontal sample resolution per line (halved: plenty smooth for these low frequencies, halves per-frame path cost)

		baseAmp: 10, // wave height in px

		carrierFreq: 6.0, // carrier cycles across the viewport width
		mod1Ratio: 0.13, // mod1 frequency as a RATIO of the carrier (non-integer = inharmonic, organic)
		mod1Index: 1.1, // ★ mod1 depth in radians — THE main complexity dial (0 = pure sine)
		mod2Ratio: 4.11, // mod2 frequency ratio (slow undulation layered underneath)
		mod2Index: 0.1, // ★ mod2 depth — how much the undulation warps mod1

		driftSpeed: 0.05, // carrier phase drift, cycles/sec
		mod1Speed: -0.05, // mod1 phase drift — beats against driftSpeed to keep shapes evolving
		mod2Speed: -0.012, // mod2 phase drift — very slow tectonic movement

		breatheSpeed: 0.1, // amplitude breathing, cycles/sec
		breatheDepth: 0.3, // 0 = steady, 1 = lines swell to double / collapse to nothing
		breatheSquish: -0.4, // squish-aware breathing: 0 = every line breathes with full breatheDepth, 1 = depth scales with the line's LOCAL spacing (tightly squished lines breathe proportionally less, sparse lines more)

		/* per-line divergence — ALL default 0, so every line is the exact same
       function and the stack aligns perfectly. Nudge these up a hair at a
       time to let neighbors drift apart. */
		phaseStep: 0.05, // carrier phase offset per distance-from-center (radians) — try 0.05–0.2
		detuneStep: 0.05, // carrier freq offset per distance-from-center — try 0.01–0.04
		mod1PhaseStep: 0.1, // mod1 phase offset per distance-from-center — try 0.05–0.15
		ampStep: 0.1, // amplitude multiplier delta per distance-from-center — try ±0.01–0.03
		ampCurve: 0.5,
		stepCurve: 1.15, // falloff shape: distance^stepCurve. 1 = linear, 2 = gentle near center then steep, 0.5 = steep near center then flat
		alphaStep: -0.01, // alpha multiplier delta per distance-from-center (uses stepCurve) — try -0.02 to fade outer lines, clamped 0..1
		squish: 0.65, // y-spacing STRENGTH: 0 = even spacing (squishCurve ignored), 1 = spacing fully follows squishCurve, in between = blend. >1 exaggerates, negative inverts the curve.
		squishCurve: 5.555, // y-spacing SHAPE (exponent): <1 = outer lines bunch toward the band edges, >1 = lines cluster around the center line, 1 = even. Band top/bottom stay pinned.

		edgeFade: -0.01, // fraction of width over which lines fade in from each edge (0 = hard edge-to-edge)
		tintA: [138, 118, 250], // violet — left/right of the blend
		tintB: [89, 217, 232], // cyan — center of the blend
	};
	window.WAVES = WAVES; // console-tweakable

	let clouds = [],
		stars = [],
		motes = [],
		shooting = null;

	/* ── offscreen glow sprites: bake radial gradients ONCE, blit with
	   drawImage per frame instead of createRadialGradient every frame.
	   Firefox's canvas2d gradient allocation is much slower than Chrome's,
	   so this is the single biggest win for cross-browser FPS parity. ── */
	function makeGlowSprite(rgb, stops) {
		const size = 512;
		const c = document.createElement("canvas");
		c.width = c.height = size;
		const g = c.getContext("2d");
		const grad = g.createRadialGradient(
			size / 2,
			size / 2,
			0,
			size / 2,
			size / 2,
			size / 2,
		);
		for (const [offset, a] of stops) {
			grad.addColorStop(offset, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`);
		}
		g.fillStyle = grad;
		g.fillRect(0, 0, size, size);
		return c;
	}

	const NEBULA_SPRITE_STOPS = [
		[0, 1],
		[0.55, 0.35],
		[1, 0],
	];
	const MOTE_GLOW_STOPS = [
		[0, 1],
		[0.4, 0.35],
		[1, 0],
	];
	const MOTE_SPRITE_SCALE = 16; // px per unit-radius in the baked sprite

	function makeMoteSprite(rgb) {
		const size = 5 * 2 * MOTE_SPRITE_SCALE; // glow radius 5 units, both sides
		const c = document.createElement("canvas");
		c.width = c.height = size;
		const g = c.getContext("2d");
		const center = size / 2;
		const glow = g.createRadialGradient(
			center,
			center,
			0,
			center,
			center,
			5 * MOTE_SPRITE_SCALE,
		);
		for (const [offset, a] of MOTE_GLOW_STOPS) {
			glow.addColorStop(offset, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`);
		}
		g.fillStyle = glow;
		g.beginPath();
		g.arc(center, center, 5 * MOTE_SPRITE_SCALE, 0, TAU);
		g.fill();
		g.fillStyle = "rgba(255,255,255,0.9)";
		g.beginPath();
		g.arc(center, center, 0.55 * MOTE_SPRITE_SCALE, 0, TAU);
		g.fill();
		return c;
	}

	const moteSprites = MOTE_TINTS.map(makeMoteSprite);

	function buildScene() {
		clouds = NEBULA_HUES.map((rgb, i) => ({
			rgb,
			sprite: makeGlowSprite(rgb, NEBULA_SPRITE_STOPS),
			// anchor position (fractions of viewport) + slow orbital drift
			ax: rand(0.05, 0.95),
			ay: rand(0.1, 0.95),
			orbitX: rand(0.04, 0.1),
			orbitY: rand(0.03, 0.08),
			speed: rand(0.02, 0.05) * (i % 2 ? 1 : -1),
			phase: rand(0, TAU),
			r: rand(0.28, 0.5), // radius as fraction of max viewport side
			alpha: rand(0.1, 0.2),
			pulse: rand(0.15, 0.4), // breathing speed
		}));

		const starCount = Math.min(240, Math.floor((W * H) / 6500));
		stars = Array.from({ length: starCount }, makeStar);

		motes = Array.from({ length: Math.min(42, Math.floor(W / 34)) }, () =>
			newMote(true),
		);
	}

	function makeStar() {
		return {
			x: Math.random(),
			y: Math.random(),
			size: rand(0.4, 1.7),
			tint: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
			base: rand(0.25, 0.9), // base brightness
			twinkle: rand(0.4, 1.6), // twinkle speed
			phase: rand(0, TAU),
			depth: rand(0.2, 1), // parallax layer
		};
	}

	/* keep existing particles in place across resize — only grow/shrink counts */
	function adjustSceneToViewport() {
		const starTarget = Math.min(240, Math.floor((W * H) / 6500));
		if (stars.length < starTarget) {
			stars.push(
				...Array.from({ length: starTarget - stars.length }, makeStar),
			);
		} else if (stars.length > starTarget) {
			stars.length = starTarget;
		}

		const moteTarget = Math.min(42, Math.floor(W / 34));
		if (motes.length < moteTarget) {
			motes.push(
				...Array.from({ length: moteTarget - motes.length }, () =>
					newMote(true),
				),
			);
		} else if (motes.length > moteTarget) {
			motes.length = moteTarget;
		}
	}

	/* rising spirit motes — glowing orbs ascending softly */
	function newMote(anywhere) {
		const tintIdx = (Math.random() * MOTE_TINTS.length) | 0;
		return {
			x: Math.random(),
			y: anywhere ? Math.random() : rand(1.02, 1.15),
			r: rand(1.2, 3.4),
			tint: MOTE_TINTS[tintIdx],
			sprite: moteSprites[tintIdx],
			vy: rand(0.008, 0.022), // fraction of height per second
			sway: rand(0.004, 0.014),
			swaySpeed: rand(0.2, 0.6),
			phase: rand(0, TAU),
			alpha: rand(0.25, 0.6),
		};
	}

	function maybeShootingStar(t) {
		// roughly one every ~14s, only when tab has focus
		if (!shooting && Math.random() < 0.0012 && document.hasFocus()) {
			const angle = rand(Math.PI * 0.72, Math.PI * 0.85); // gentle downward-left arc
			shooting = {
				x: rand(0.3, 0.95) * W,
				y: rand(0.05, 0.3) * H,
				vx: Math.cos(angle) * rand(500, 750),
				vy: Math.sin(angle) * rand(180, 260),
				life: 0,
				maxLife: rand(0.9, 1.4),
				born: t,
			};
		}
	}

	/* cursor halo — soft light that follows the visitor's attention */
	const cursor = { x: -1, y: -1, tx: -1, ty: -1 };
	window.addEventListener(
		"pointermove",
		(e) => {
			const rect = canvas.getBoundingClientRect();
			cursor.tx = e.clientX - rect.left;
			cursor.ty = e.clientY - rect.top;
			if (cursor.x < 0) {
				cursor.x = cursor.tx;
				cursor.y = cursor.ty;
			}
		},
		{ passive: true },
	);

	function resize() {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		W = canvas.clientWidth;
		H = canvas.clientHeight;
		canvas.width = Math.floor(W * dpr);
		canvas.height = Math.floor(H * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		if (clouds.length) adjustSceneToViewport();
		else buildScene();
	}

	function drawNebula(t) {
		ctx.globalCompositeOperation = "lighter";
		const maxSide = Math.max(W, H);
		for (const c of clouds) {
			const x = (c.ax + Math.sin(t * c.speed + c.phase) * c.orbitX) * W;
			const y = (c.ay + Math.cos(t * c.speed * 0.8 + c.phase) * c.orbitY) * H;
			const r = c.r * maxSide;
			const breath = 1 + 0.18 * Math.sin(t * c.pulse + c.phase);
			ctx.globalAlpha = c.alpha * breath;
			ctx.drawImage(c.sprite, x - r, y - r, r * 2, r * 2);
		}
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}

	/* the horizontal tint gradient only depends on W + tint knobs, not time —
	   cache it instead of rebuilding it every frame */
	let waveGradCache = null;
	function waveGradient(w) {
		const key = `${W}|${w.edgeFade}|${w.tintA}|${w.tintB}`;
		if (waveGradCache && waveGradCache.key === key) return waveGradCache.grad;

		const [ar, ag, ab] = w.tintA;
		const [br, bg, bb] = w.tintB;
		const grad = ctx.createLinearGradient(0, 0, W, 0);
		grad.addColorStop(0, `rgba(${ar},${ag},${ab},${w.edgeFade > 0 ? 0 : 1})`);
		if (w.edgeFade > 0) {
			grad.addColorStop(
				Math.min(0.49, w.edgeFade),
				`rgba(${ar},${ag},${ab},1)`,
			);
			grad.addColorStop(
				Math.max(0.51, 1 - w.edgeFade),
				`rgba(${ar},${ag},${ab},1)`,
			);
		}
		grad.addColorStop(0.5, `rgba(${br},${bg},${bb},1)`);
		grad.addColorStop(1, `rgba(${ar},${ag},${ab},${w.edgeFade > 0 ? 0 : 1})`);

		waveGradCache = { key, grad };
		return grad;
	}

	/* stacked FM wave lines — drawn above the nebula, beneath the stars */
	function drawWaves(t) {
		if (!WAVES.enabled) return;
		const w = WAVES;
		const band = w.bandBottom - w.bandTop;

		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.strokeStyle = waveGradient(w);
		ctx.lineWidth = w.lineWidth;

		const breatheOsc = Math.sin(TAU * w.breatheSpeed * t);

		const center = (w.count - 1) / 2;

		// squish remap: signed distance from center (-1..1) through a power
		// curve (squishCurve = shape), blended against even spacing (squish = strength)
		const shapeAt = (idx) => {
			const sd = center > 0 ? (idx - center) / center : 0;
			const lin = Math.abs(sd);
			const curved = Math.pow(lin, w.squishCurve);
			return Math.sign(sd) * (lin + (curved - lin) * w.squish);
		};

		for (let i = 0; i < w.count; i++) {
			const yBase = (w.bandTop + band * (0.5 + shapeAt(i) / 2)) * H;

			// local spacing vs. even spacing (1 = even, <1 = squished tighter,
			// >1 = stretched apart) — measured against this line's neighbors
			let localSpace = 1;
			if (center > 0) {
				const lo = Math.max(0, i - 1);
				const hi = Math.min(w.count - 1, i + 1);
				localSpace =
					(shapeAt(hi) - shapeAt(lo)) / ((hi - lo) * (2 / (w.count - 1)));
			}

			// squish-aware breathing: depth follows local spacing by breatheSquish
			const depth =
				w.breatheDepth * (1 - w.breatheSquish + w.breatheSquish * localSpace);
			const breathe = 1 + depth * breatheOsc;

			// every line is the same function; the *Step knobs (default 0)
			// introduce divergence mirrored around the CENTER line —
			// g grows with distance from center, shaped by stepCurve
			// (amp gets its own falloff shape via ampCurve)
			const dist = Math.abs(i - center);
			const g = Math.pow(dist, w.stepCurve);
			const gAmp = Math.pow(dist, w.ampCurve);
			ctx.globalAlpha = Math.min(
				1,
				Math.max(0, w.alpha * (1 + g * w.alphaStep)),
			);
			const carrier = w.carrierFreq + g * w.detuneStep;
			const phase0 = TAU * w.driftSpeed * t + g * w.phaseStep;
			const amp = Math.max(0, w.baseAmp * (1 + gAmp * w.ampStep)) * breathe;

			ctx.beginPath();
			for (let s = 0; s <= w.segments; s++) {
				const u = s / w.segments; // 0..1 across the width
				// cascade FM: mod2 → mod1 → carrier
				const m2 = Math.sin(
					TAU * w.mod2Ratio * carrier * u + TAU * w.mod2Speed * t,
				);
				const m1 = Math.sin(
					TAU * w.mod1Ratio * carrier * u +
						TAU * w.mod1Speed * t +
						w.mod2Index * m2 +
						g * w.mod1PhaseStep,
				);
				const y =
					yBase + amp * Math.sin(TAU * carrier * u + phase0 + w.mod1Index * m1);
				s === 0 ? ctx.moveTo(0, y) : ctx.lineTo(u * W, y);
			}
			ctx.stroke();
		}
		ctx.restore();
	}

	function drawStars(t) {
		// parallax offset from cursor, deeper stars move less
		const px = cursor.x >= 0 ? cursor.x / W - 0.5 : 0;
		const py = cursor.y >= 0 ? cursor.y / H - 0.5 : 0;
		for (const s of stars) {
			const tw = s.base * (0.65 + 0.35 * Math.sin(t * s.twinkle + s.phase));
			const x = s.x * W - px * 22 * s.depth;
			const y = s.y * H - py * 16 * s.depth;
			const [r, g, b] = s.tint;
			ctx.fillStyle = `rgba(${r},${g},${b},${tw})`;
			ctx.beginPath();
			ctx.arc(x, y, s.size, 0, TAU);
			ctx.fill();
			// bright stars get a faint cross-glint
			if (s.size > 1.35 && tw > 0.7) {
				ctx.strokeStyle = `rgba(${r},${g},${b},${(tw - 0.7) * 0.5})`;
				ctx.lineWidth = 0.6;
				const l = s.size * 5;
				ctx.beginPath();
				ctx.moveTo(x - l, y);
				ctx.lineTo(x + l, y);
				ctx.moveTo(x, y - l);
				ctx.lineTo(x, y + l);
				ctx.stroke();
			}
		}
	}

	function drawMotes(t, dt) {
		ctx.globalCompositeOperation = "lighter";
		for (let i = 0; i < motes.length; i++) {
			const m = motes[i];
			m.y -= m.vy * dt;
			const x = (m.x + Math.sin(t * m.swaySpeed + m.phase) * m.sway) * W;
			const y = m.y * H;
			if (m.y < -0.05) {
				motes[i] = newMote(false);
				continue;
			}
			// fade in near bottom, fade out near top
			const fade = Math.min(1, (1.05 - m.y) * 4, m.y * 4 + 0.15);
			const a = m.alpha * fade * (0.75 + 0.25 * Math.sin(t * 1.3 + m.phase));
			const d = m.r * 10; // glow diam = 2 * (m.r * 5), matches original arc radius
			ctx.globalAlpha = a;
			ctx.drawImage(m.sprite, x - d / 2, y - d / 2, d, d);
		}
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}

	function drawShooting(t, dt) {
		maybeShootingStar(t);
		if (!shooting) return;
		const s = shooting;
		s.life += dt;
		if (s.life > s.maxLife) {
			shooting = null;
			return;
		}
		s.x += s.vx * dt;
		s.y += s.vy * dt;
		const fade = Math.sin((s.life / s.maxLife) * Math.PI); // ease in & out
		const tailX = s.x - s.vx * 0.22;
		const tailY = s.y - s.vy * 0.22;
		const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
		grad.addColorStop(0, `rgba(245,243,255,${0.85 * fade})`);
		grad.addColorStop(0.3, `rgba(89,217,232,${0.4 * fade})`);
		grad.addColorStop(1, "rgba(0,0,0,0)");
		ctx.strokeStyle = grad;
		ctx.lineWidth = 1.4;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(s.x, s.y);
		ctx.lineTo(tailX, tailY);
		ctx.stroke();
	}

	function updateCursor() {
		if (cursor.x < 0) return;
		cursor.x += (cursor.tx - cursor.x) * 0.06;
		cursor.y += (cursor.ty - cursor.y) * 0.06;
	}

	let last = 0;
	let heroVisible = true;

	function frame(now) {
		const t = now / 1000;
		const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
		last = now;

		if (heroVisible) {
			ctx.clearRect(0, 0, W, H);
			drawNebula(t);
			drawWaves(t);
			drawStars(t);
			drawMotes(t, dt);
			drawShooting(t, dt);
			updateCursor();
		}
		requestAnimationFrame(frame);
	}

	/* pause rendering when the hero has scrolled away — battery kindness */
	if ("IntersectionObserver" in window) {
		new IntersectionObserver(
			([e]) => {
				heroVisible = e.isIntersecting;
			},
			{ threshold: 0 },
		).observe(canvas);
	}

	window.addEventListener("resize", resize);
	resize();

	if (reduceMotion) {
		// single serene static frame: nebula + stars, no animation loop
		ctx.clearRect(0, 0, W, H);
		drawNebula(0);
		drawWaves(0);
		drawStars(0);
	} else {
		requestAnimationFrame(frame);
	}
})();
