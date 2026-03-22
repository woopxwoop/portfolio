<script lang="ts">
	import { onMount } from 'svelte';
	import me from '$lib/assets/samui.jpg';
	import { navTheme } from '$lib/stores/theme';
	import Icon from '$lib/components/ui/Icon.svelte';

	let canvas: HTMLCanvasElement;
	let hero: HTMLElement;

	type WindStreak = {
		id: number;
		d: string;
		width: string;
		delay: string;
		dur: string;
		len: number;
	};
	let windStreaks: WindStreak[] = $state([]);
	let streakId = 0;

	type Season = {
		name: string;
		leafColors: string[];
		windColor: string;
		windEcho: string;
		gustInterval: [number, number];
		leafDecay: [number, number];
		available: boolean;
	};

	const seasons: Record<string, Season> = {
		fall: {
			name: 'Fall',
			leafColors: ['#b02a14', '#c0321a', '#a82010', '#cc3a1e', '#961e0e', '#d44422', '#8a1a0c'],
			windColor: 'rgba(80,215,160,0.75)',
			windEcho: 'rgba(160,245,210,0.35)',
			gustInterval: [240, 480],
			leafDecay: [0.003, 0.003],
			available: true
		},
		winter: {
			name: 'Winter',
			leafColors: ['#cce8f4', '#a8d4e8', '#85c0dc', '#dff0f8', '#b8dff0', '#6aaec8'],
			windColor: 'rgba(180,220,255,0.7)',
			windEcho: 'rgba(220,240,255,0.35)',
			gustInterval: [180, 360],
			leafDecay: [0.002, 0.002],
			available: false
		},
		spring: {
			name: 'Spring',
			leafColors: ['#f7c5d5', '#f4a7be', '#e8829e', '#fadadd', '#f0b8c8', '#d4688a'],
			windColor: 'rgba(200,160,220,0.7)',
			windEcho: 'rgba(230,200,240,0.35)',
			gustInterval: [300, 540],
			leafDecay: [0.002, 0.003],
			available: true
		},
		summer: {
			name: 'Summer',
			leafColors: ['#2d8a4e', '#3aad62', '#1f6e3a', '#4cc476', '#267a44', '#56d982'],
			windColor: 'rgba(100,210,120,0.7)',
			windEcho: 'rgba(160,240,180,0.35)',
			gustInterval: [360, 600],
			leafDecay: [0.002, 0.002],
			available: false
		}
	};

	function getSeasonByDate(): string {
		const m = new Date().getMonth();
		if (m >= 2 && m <= 4) return 'spring';
		if (m >= 5 && m <= 7) return 'fall'; // summer unavailable, fall back
		if (m >= 8 && m <= 10) return 'fall';
		return 'spring'; // winter unavailable, fall back
	}

	let activeSeason = $state(getSeasonByDate());
	let paused = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('hero-paused') === 'true' : false
	);

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('hero-paused', String(paused));
		}
	});

	const COLORS = $derived(seasons[activeSeason].leafColors);

	// exposed so onMount can call it
	let clearEffects: () => void = () => {};

	function togglePaused() {
		paused = !paused;
		if (paused) clearEffects();
	}

	type Leaf = {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		angle: number;
		spin: number;
		sway: number;
		swaySpeed: number;
		swayAmp: number;
		color: string;
		opacity: number;
		life: number;
		decay: number;
	};

	onMount(() => {
		navTheme.set({
			bg: 'rgba(247, 243, 240, 0.88)',
			fg: '#1a1118',
			border: '#646464',
			accent: '#c0321a'
		});

		const ctx = canvas.getContext('2d')!;
		const leaves: Leaf[] = [];
		let lastX = -999,
			lastY = -999;
		let spawnCooldown = 0;
		let raf: number;

		// ── Wind state ────────────────────────────────────
		let windStrength = 0;
		let windTarget = 0;
		let windTimer = 0;
		let gustSpawnCooldown = 0;

		function scheduleNextGust() {
			windTimer = 240 + Math.floor(Math.random() * 480);
		}
		scheduleNextGust();

		// wire up clear so the toggle button can call it
		clearEffects = () => {
			leaves.splice(0, leaves.length);
			windStreaks = [];
			windStrength = 0;
			windTarget = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			scheduleNextGust();
		};

		function resize() {
			canvas.width = hero.offsetWidth;
			canvas.height = hero.offsetHeight;
		}
		resize();
		window.addEventListener('resize', resize);

		function spawnLeaf(x: number, y: number, vx: number, vy: number) {
			leaves.push({
				x,
				y,
				vx: vx * 0.35 + (Math.random() - 0.5) * 0.8,
				vy: vy * 0.2 + 0.4 + Math.random() * 0.6,
				size: 9 + Math.random() * 11,
				angle: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * 0.018,
				sway: Math.random() * Math.PI * 2,
				swaySpeed: 0.025 + Math.random() * 0.02,
				swayAmp: 0.25 + Math.random() * 0.35,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				opacity: 0.7 + Math.random() * 0.3,
				life: 1.0,
				decay: 0.003 + Math.random() * 0.003
			});
		}

		function spawnWindLeaf() {
			const y = Math.random() * canvas.height;
			leaves.push({
				x: -20,
				y,
				vx: 2.5 + Math.random() * 2,
				vy: -0.3 + Math.random() * 0.8,
				size: 9 + Math.random() * 11,
				angle: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * 0.04,
				sway: Math.random() * Math.PI * 2,
				swaySpeed: 0.02 + Math.random() * 0.02,
				swayAmp: 0.15 + Math.random() * 0.2,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				opacity: 0.6 + Math.random() * 0.35,
				life: 1.0,
				decay: 0.002 + Math.random() * 0.002
			});
		}

		function drawLeaf(
			x: number,
			y: number,
			size: number,
			angle: number,
			color: string,
			opacity: number
		) {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(angle);
			ctx.scale(size, size);
			ctx.globalAlpha = opacity;
			ctx.fillStyle = color;

			const pts: [number, number][] = [
				[0, -1],
				[0.22, -0.78],
				[0.42, -0.82],
				[0.35, -0.58],
				[0.72, -0.5],
				[0.58, -0.22],
				[0.88, 0.02],
				[0.5, 0.1],
				[0.3, 0.45],
				[0.08, 0.22],
				[0, 0.5],
				[-0.08, 0.22],
				[-0.3, 0.45],
				[-0.5, 0.1],
				[-0.88, 0.02],
				[-0.58, -0.22],
				[-0.72, -0.5],
				[-0.35, -0.58],
				[-0.42, -0.82],
				[-0.22, -0.78]
			];

			ctx.beginPath();
			ctx.moveTo(pts[0][0], pts[0][1]);
			for (let i = 1; i < pts.length; i++) {
				const prev = pts[i - 1],
					curr = pts[i];
				ctx.quadraticCurveTo(prev[0], prev[1], (prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2);
			}
			ctx.closePath();
			ctx.fill();

			ctx.strokeStyle = 'rgba(0,0,0,0.1)';
			ctx.lineWidth = 0.04;
			ctx.beginPath();
			ctx.moveTo(0, -0.85);
			ctx.lineTo(0, 0.45);
			ctx.moveTo(0, -0.3);
			ctx.lineTo(0.45, -0.05);
			ctx.moveTo(0, -0.3);
			ctx.lineTo(-0.45, -0.05);
			ctx.moveTo(0, 0.0);
			ctx.lineTo(0.28, 0.3);
			ctx.moveTo(0, 0.0);
			ctx.lineTo(-0.28, 0.3);
			ctx.stroke();
			ctx.restore();
		}

		function spawnSvgGust(strength: number, duration: number) {
			const w = hero.offsetWidth;
			const h = hero.offsetHeight;
			const count = 3 + Math.floor(strength * 2);
			const dur = ((duration * 0.6) / 1000).toFixed(2);
			const newStreaks: WindStreak[] = [];

			for (let i = 0; i < count; i++) {
				const sy = 15 + Math.random() * (h - 30);
				const swing = Math.min(sy, h - sy, 55);
				const cp1x = w * (0.2 + Math.random() * 0.15);
				const cp1y = sy + (Math.random() - 0.5) * swing * 2;
				const cp2x = w * (0.55 + Math.random() * 0.2);
				const cp2y = sy + (Math.random() - 0.5) * swing * 2;
				const ex = w + 20;
				const ey = sy + (Math.random() - 0.5) * 20;
				const d = `M -20 ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;
				const len = w + 40;
				const delay = (i * 0.12 + Math.random() * 0.15).toFixed(2);
				const lw = (1.5 + Math.random() * 2 * strength).toFixed(1);
				newStreaks.push({ id: streakId++, d, width: lw, delay, dur, len });
			}

			windStreaks = [...windStreaks, ...newStreaks];

			const ids = newStreaks.map((s) => s.id);
			setTimeout(
				() => {
					windStreaks = windStreaks.filter((s) => !ids.includes(s.id));
				},
				duration + count * 280 + 500
			);
		}

		function onMouseMove(e: MouseEvent) {
			const rect = hero.getBoundingClientRect();
			const mx = e.clientX - rect.left;
			const my = e.clientY - rect.top;
			const dx = mx - lastX,
				dy = my - lastY;
			const speed = Math.sqrt(dx * dx + dy * dy);

			if (speed > 4 && spawnCooldown <= 0) {
				const count = Math.min(3, Math.floor(speed / 10) + 1);
				for (let i = 0; i < count; i++) {
					spawnLeaf(mx + (Math.random() - 0.5) * 16, my + (Math.random() - 0.5) * 16, dx, dy);
				}
				spawnCooldown = 3;
			}
			lastX = mx;
			lastY = my;
		}

		hero.addEventListener('mousemove', onMouseMove);

		function animate() {
			if (paused) {
				raf = requestAnimationFrame(animate);
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (spawnCooldown > 0) spawnCooldown--;

			windTimer--;
			if (windTimer <= 0) {
				windTarget = 1.2 + Math.random() * 1.8;
				const gustDuration = 2000 + Math.random() * 3000;
				spawnSvgGust(windTarget, gustDuration);
				setTimeout(() => {
					windTarget = 0;
				}, gustDuration);
				scheduleNextGust();
			}
			windStrength += (windTarget - windStrength) * 0.03;

			if (windStrength > 0.5 && gustSpawnCooldown <= 0) {
				spawnWindLeaf();
				gustSpawnCooldown = Math.max(20, Math.floor(35 - windStrength * 4));
			}
			if (gustSpawnCooldown > 0) gustSpawnCooldown--;

			for (let i = leaves.length - 1; i >= 0; i--) {
				const l = leaves[i];
				l.sway += l.swaySpeed;
				l.vx += windStrength * 0.18;
				l.vy -= windStrength * 0.02;
				l.x += l.vx + Math.sin(l.sway) * l.swayAmp;
				l.y += l.vy;
				l.vy += 0.018;
				l.vx *= 0.97;
				l.angle += l.spin + windStrength * 0.008;
				l.life -= l.decay;

				if (l.x > canvas.width + 40 || l.y > canvas.height + 30 || l.life <= 0) {
					leaves.splice(i, 1);
					continue;
				}

				const fade = l.life < 0.25 ? l.life / 0.25 : 1;
				drawLeaf(l.x, l.y, l.size, l.angle, l.color, l.opacity * fade);
			}
			raf = requestAnimationFrame(animate);
		}
		animate();

		return () => {
			cancelAnimationFrame(raf);
			hero.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0" style="z-index: 20;"
></canvas>
<svg
	class="pointer-events-none absolute inset-0"
	style="z-index: 19; width:100%; height:100%; overflow:visible;"
>
	{#each windStreaks as streak (streak.id)}
		<path
			d={streak.d}
			fill="none"
			stroke={seasons[activeSeason].windColor}
			stroke-width={streak.width}
			stroke-linecap="round"
			stroke-dasharray={streak.len}
			stroke-dashoffset={streak.len}
			style="animation-duration:{streak.dur}s; animation-delay:{streak.delay}s;"
			class="wind-streak"
		/>
		<path
			d={streak.d}
			fill="none"
			stroke={seasons[activeSeason].windEcho}
			stroke-width={parseFloat(streak.width) * 0.4}
			stroke-linecap="round"
			stroke-dasharray={streak.len}
			stroke-dashoffset={streak.len}
			style="animation-duration:{streak.dur}s; animation-delay:{streak.delay}s;"
			class="wind-streak"
		/>
	{/each}
</svg>
<section bind:this={hero} class="relative flex h-svh w-full flex-col items-center">
	<div class="hero-inner">
		<div class="hero-copy">
			<div class="hero-avatar-mobile">
				<img src={me} alt="Andrew Lou" class="h-full w-full object-cover" />
			</div>

			<div class="hero-tag accent-font">CS + CE · UW–Madison · 28</div>

			<h1 class="hero-name accent-font">
				Andrew <span class="hero-accent">Lou</span>
			</h1>

			<p class="hero-desc">
				Computer science and engineering student at the University of Wisconsin-Madison interested
				in <strong>web development, machine learning,</strong> and
				<strong>human-computer interaction</strong>.
			</p>

			<div class="hero-links">
				<a href="mailto:alou2@wisc.edu" aria-label="Email" class="hero-link">
					<Icon icon="mail" />
				</a>
				<a
					href="https://www.linkedin.com/in/andrew-lou-uw/"
					aria-label="LinkedIn"
					target="_blank"
					rel="noopener noreferrer"
					class="hero-link"
				>
					<Icon icon="linkedin" />
				</a>
				<a
					href="https://github.com/woopxwoop"
					aria-label="GitHub"
					target="_blank"
					rel="noopener noreferrer"
					class="hero-link"
				>
					<Icon icon="github" />
				</a>
			</div>

			<div class="hero-effects">
				<button
					class="effects-toggle"
					onclick={togglePaused}
					aria-label={paused ? 'Enable effects' : 'Disable effects'}
				>
					{paused ? '○' : '●'} effects
				</button>
				<div class="season-picker">
					{#each Object.keys(seasons) as s (s)}
						<button
							class="season-btn"
							class:active={activeSeason === s}
							disabled={!seasons[s].available}
							onclick={() => (activeSeason = s)}
							aria-label={seasons[s].name}
							style={activeSeason === s ? `--season-color: ${seasons[s].leafColors[0]}` : ''}
							>{seasons[s].name}</button
						>
					{/each}
				</div>
			</div>
		</div>

		<div class="hero-portrait">
			<img src={me} alt="Andrew Lou" class="portrait-img" />
		</div>
	</div>
</section>

<style>
	:global(.wind-streak) {
		animation-name: windSweep;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
	}

	@keyframes windSweep {
		0% {
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		80% {
			opacity: 0.85;
		}
		100% {
			stroke-dashoffset: 0;
			opacity: 0;
		}
	}

	section {
		background: #f7f3f0;
		min-height: 400px;
	}

	.hero-inner {
		width: 90%;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding-top: 8rem;
		height: 100%;
		padding-bottom: 28px;
	}

	.hero-portrait {
		position: relative;
		z-index: 10;
		flex: 0 0 auto;
		display: flex;
		align-items: flex-start;
		height: auto;
	}

	.portrait-img {
		display: block;
		width: auto;
		height: 55vh;
		min-height: 200px;
		min-width: 180px;
		object-fit: cover;
		object-position: top;
		border-radius: 140px 140px 0 0;
	}

	.hero-copy {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.25rem;
		max-width: 640px;
	}

	.hero-avatar-mobile {
		display: none;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		border: 2px solid #c0321a;
	}

	.hero-tag {
		font-size: var(--p-text);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #c0321a;
		font-weight: 600;
	}

	.hero-name {
		color: #1a1118;
		margin: 0;
		line-height: 1;
	}

	.hero-accent {
		color: #c0321a;
	}

	.hero-desc {
		line-height: 1.75;
		color: var(--intermediate-color);
		max-width: 640px;
		margin: 0;
	}

	.hero-desc strong {
		color: #1a1118;
		font-weight: 600;
	}

	.hero-links {
		display: flex;
		flex-direction: row;
		gap: 1.25rem;
		align-items: center;
	}

	.hero-link {
		display: block;
		width: 2rem;
		height: 2rem;
		color: #1a1118;
		transition:
			color 0.15s,
			transform 0.15s;
	}

	.hero-link:hover {
		color: #c0321a;
		transform: translateY(-2px);
	}

	.hero-effects {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.effects-toggle {
		font-size: 0.75rem;
		font-family: 'Source Sans Pro', sans-serif;
		color: var(--intermediate-color);
		background: none;
		border: 1px solid var(--slightlydarker-color);
		padding: 0.2em 0.65em;
		border-radius: 999px;
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
		letter-spacing: 0.04em;
	}

	.effects-toggle:hover {
		color: var(--foreground-color);
		border-color: var(--foreground-color);
	}

	.season-picker {
		display: flex;
		gap: 0.35rem;
	}

	.season-btn {
		font-size: 0.7rem;
		font-family: 'Source Sans Pro', sans-serif;
		color: var(--intermediate-color);
		background: none;
		border: 1px solid transparent;
		padding: 0.15em 0.5em;
		border-radius: 999px;
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
		letter-spacing: 0.04em;
	}

	.season-btn:hover:not(:disabled) {
		color: var(--foreground-color);
	}

	.season-btn.active {
		color: var(--season-color);
		border-color: var(--season-color);
	}

	.season-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 768px) {
		.hero-inner {
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 6rem 2rem 40px;
			gap: 2rem;
			text-align: center;
		}

		.hero-copy {
			align-items: center;
			max-width: 100%;
		}

		.hero-avatar-mobile {
			display: block;
		}

		.hero-portrait {
			display: none;
		}
	}
</style>
