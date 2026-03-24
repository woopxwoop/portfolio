<script lang="ts">
	import { onMount } from 'svelte';
	import me from '$lib/assets/samui.jpg';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { activeSeason, currentSeason, seasons, type SeasonName } from '$lib/stores/season';

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

	let paused = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('hero-paused') === 'true' : false
	);

	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('hero-paused', String(paused));
		}
	});

	let clearEffects: () => void = () => {};

	function togglePaused() {
		paused = !paused;
		if (paused) clearEffects();
	}

	function setSeason(s: SeasonName) {
		activeSeason.set(s);
		clearEffects();
	}

	type Particle = {
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
		pulse: number;
		pulseSpeed: number;
	};

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		const particles: Particle[] = [];
		let lastX = -999,
			lastY = -999;
		let spawnCooldown = 0;
		let raf: number;

		let windStrength = 0;
		let windTarget = 0;
		let windTimer = 0;
		let gustSpawnCooldown = 0;
		let fireflyTimer = 0;

		function scheduleNextGust() {
			const s = $currentSeason;
			const [min, max] = s.gustInterval;
			windTimer = min + Math.floor(Math.random() * (max - min));
		}
		scheduleNextGust();

		clearEffects = () => {
			particles.splice(0, particles.length);
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

		function randomColor(): string {
			const colors = $currentSeason.particleColors;
			return colors[Math.floor(Math.random() * colors.length)];
		}

		function spawnParticle(x: number, y: number, vx: number, vy: number) {
			const { particleType, particleDecay } = $currentSeason;
			const [d0, d1] = particleDecay;

			if (particleType === 'firefly') {
				particles.push({
					x,
					y,
					vx: (Math.random() - 0.5) * 0.6,
					vy: (Math.random() - 0.5) * 0.6,
					size: 3 + Math.random() * 4,
					angle: 0,
					spin: 0,
					sway: 0,
					swaySpeed: 0,
					swayAmp: 0,
					color: randomColor(),
					opacity: 0.5 + Math.random() * 0.5,
					life: 1.0,
					decay: 0.005 + Math.random() * 0.005,
					pulse: Math.random() * Math.PI * 2,
					pulseSpeed: 0.04 + Math.random() * 0.05
				});
				return;
			}

			const isSnow = particleType === 'snowflake';
			const isSakura = particleType === 'sakura';
			particles.push({
				x,
				y,
				vx: vx * 0.35 + (Math.random() - 0.5) * 0.8,
				vy: vy * 0.2 + (isSnow ? 0.15 : 0.4) + Math.random() * 0.5,
				size: isSnow
					? 5 + Math.random() * 8
					: isSakura
						? 7 + Math.random() * 9
						: 9 + Math.random() * 11,
				angle: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * (isSnow ? 0.006 : 0.018),
				sway: Math.random() * Math.PI * 2,
				swaySpeed: isSnow ? 0.012 + Math.random() * 0.012 : 0.025 + Math.random() * 0.02,
				swayAmp: isSnow ? 0.4 + Math.random() * 0.5 : 0.25 + Math.random() * 0.35,
				color: randomColor(),
				opacity: 0.7 + Math.random() * 0.3,
				life: 1.0,
				decay: d0 + Math.random() * d1,
				pulse: 0,
				pulseSpeed: 0
			});
		}

		function spawnWindParticle() {
			const { particleType, particleDecay } = $currentSeason;
			if (particleType === 'firefly') return;
			const [d0, d1] = particleDecay;

			if (particleType === 'snowflake') {
				particles.push({
					x: Math.random() * canvas.width,
					y: -20,
					vx: windStrength * 0.2 + (Math.random() - 0.5) * 0.4,
					vy: 0.35 + Math.random() * 0.65,
					size: 5 + Math.random() * 10,
					angle: Math.random() * Math.PI * 2,
					spin: (Math.random() - 0.5) * 0.007,
					sway: Math.random() * Math.PI * 2,
					swaySpeed: 0.01 + Math.random() * 0.012,
					swayAmp: 0.38 + Math.random() * 0.45,
					color: randomColor(),
					opacity: 0.5 + Math.random() * 0.45,
					life: 1.0,
					decay: d0 + Math.random() * d1 * 0.5,
					pulse: 0,
					pulseSpeed: 0
				});
				return;
			}

			const isSakura = particleType === 'sakura';
			particles.push({
				x: -20,
				y: Math.random() * canvas.height,
				vx: 2.5 + Math.random() * 2,
				vy: -0.3 + Math.random() * 0.8,
				size: isSakura ? 7 + Math.random() * 9 : 9 + Math.random() * 11,
				angle: Math.random() * Math.PI * 2,
				spin: (Math.random() - 0.5) * 0.04,
				sway: Math.random() * Math.PI * 2,
				swaySpeed: 0.02 + Math.random() * 0.02,
				swayAmp: 0.15 + Math.random() * 0.2,
				color: randomColor(),
				opacity: 0.6 + Math.random() * 0.35,
				life: 1.0,
				decay: d0 * 0.5 + Math.random() * d1 * 0.3,
				pulse: 0,
				pulseSpeed: 0
			});
		}

		function spawnFireflyAmbient() {
			const colors = seasons.Summer.particleColors;
			particles.push({
				x: 30 + Math.random() * (canvas.width - 60),
				y: 20 + Math.random() * (canvas.height - 40),
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: 2.5 + Math.random() * 3,
				angle: 0,
				spin: 0,
				sway: 0,
				swaySpeed: 0,
				swayAmp: 0,
				color: colors[Math.floor(Math.random() * colors.length)],
				opacity: 0.25 + Math.random() * 0.5,
				life: 1.0,
				decay: 0.0012 + Math.random() * 0.0018,
				pulse: Math.random() * Math.PI * 2,
				pulseSpeed: 0.022 + Math.random() * 0.032
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
				const p = pts[i - 1],
					c = pts[i];
				ctx.quadraticCurveTo(p[0], p[1], (p[0] + c[0]) / 2, (p[1] + c[1]) / 2);
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
			ctx.moveTo(0, 0);
			ctx.lineTo(0.28, 0.3);
			ctx.moveTo(0, 0);
			ctx.lineTo(-0.28, 0.3);
			ctx.stroke();
			ctx.restore();
		}

		function drawSnowflake(
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
			ctx.globalAlpha = opacity;
			ctx.strokeStyle = color;
			ctx.lineWidth = Math.max(0.7, size * 0.09);
			ctx.lineCap = 'round';
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2;
				const ex = Math.cos(a) * size,
					ey = Math.sin(a) * size;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(ex, ey);
				ctx.stroke();
				for (const bp of [0.38, 0.65]) {
					const bx = Math.cos(a) * size * bp,
						by = Math.sin(a) * size * bp;
					const bl = size * 0.28 * (1.15 - bp);
					ctx.beginPath();
					ctx.moveTo(bx, by);
					ctx.lineTo(bx + Math.cos(a + Math.PI / 3) * bl, by + Math.sin(a + Math.PI / 3) * bl);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(bx, by);
					ctx.lineTo(bx + Math.cos(a - Math.PI / 3) * bl, by + Math.sin(a - Math.PI / 3) * bl);
					ctx.stroke();
				}
			}
			ctx.restore();
		}

		function drawSakura(
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
			ctx.globalAlpha = opacity;
			ctx.fillStyle = color;
			for (let i = 0; i < 5; i++) {
				ctx.save();
				ctx.rotate((i / 5) * Math.PI * 2);
				ctx.beginPath();
				ctx.ellipse(0, -size * 0.46, size * 0.26, size * 0.5, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}
			ctx.fillStyle = 'rgba(255,210,225,0.85)';
			ctx.beginPath();
			ctx.arc(0, 0, size * 0.19, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = 'rgba(200,80,120,0.5)';
			ctx.lineWidth = size * 0.04;
			ctx.lineCap = 'round';
			for (let i = 0; i < 5; i++) {
				const a = (i / 5) * Math.PI * 2;
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(Math.cos(a) * size * 0.28, Math.sin(a) * size * 0.28);
				ctx.stroke();
			}
			ctx.restore();
		}

		function drawFirefly(x: number, y: number, size: number, opacity: number, color: string) {
			ctx.save();
			ctx.translate(x, y);
			ctx.fillStyle = color;
			ctx.globalAlpha = opacity * 0.15;
			ctx.beginPath();
			ctx.arc(0, 0, size * 3.2, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = opacity * 0.38;
			ctx.beginPath();
			ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = opacity * 0.8;
			ctx.beginPath();
			ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = opacity;
			ctx.beginPath();
			ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}

		function spawnSvgGust(strength: number, duration: number) {
			if ($currentSeason.particleType === 'firefly') return;
			const w = hero.offsetWidth,
				h = hero.offsetHeight;
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
				const d = `M -20 ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${w + 20} ${sy + (Math.random() - 0.5) * 20}`;
				const delay = (i * 0.12 + Math.random() * 0.15).toFixed(2);
				newStreaks.push({
					id: streakId++,
					d,
					width: (1.5 + Math.random() * 2 * strength).toFixed(1),
					delay,
					dur,
					len: w + 40
				});
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
			const mx = e.clientX - rect.left,
				my = e.clientY - rect.top;
			const dx = mx - lastX,
				dy = my - lastY;
			const speed = Math.sqrt(dx * dx + dy * dy);
			if (speed > 4 && spawnCooldown <= 0) {
				const count = Math.min(3, Math.floor(speed / 10) + 1);
				for (let i = 0; i < count; i++) {
					spawnParticle(mx + (Math.random() - 0.5) * 16, my + (Math.random() - 0.5) * 16, dx, dy);
				}
				spawnCooldown = 3;
			}
			lastX = mx;
			lastY = my;
		}

		function animate() {
			if (paused) {
				raf = requestAnimationFrame(animate);
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (spawnCooldown > 0) spawnCooldown--;

			const pType = $currentSeason.particleType;

			if (pType === 'firefly') {
				fireflyTimer--;
				if (fireflyTimer <= 0 && particles.length < 60) {
					spawnFireflyAmbient();
					if (Math.random() < 0.45) spawnFireflyAmbient();
					fireflyTimer = 16 + Math.floor(Math.random() * 22);
				}
			}

			windTimer--;
			if (windTimer <= 0) {
				windTarget = 1.2 + Math.random() * 1.8;
				const dur = 2000 + Math.random() * 3000;
				spawnSvgGust(windTarget, dur);
				setTimeout(() => {
					windTarget = 0;
				}, dur);
				scheduleNextGust();
			}
			windStrength += (windTarget - windStrength) * 0.03;

			if (pType !== 'firefly' && windStrength > 0.5 && gustSpawnCooldown <= 0) {
				spawnWindParticle();
				gustSpawnCooldown = Math.max(20, Math.floor(35 - windStrength * 4));
			}
			if (gustSpawnCooldown > 0) gustSpawnCooldown--;

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				if (pType === 'firefly') {
					p.vx += (Math.random() - 0.5) * 0.045;
					p.vy += (Math.random() - 0.5) * 0.045;
					const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
					if (spd > 0.55) {
						p.vx *= 0.55 / spd;
						p.vy *= 0.55 / spd;
					}
					p.x += p.vx;
					p.y += p.vy;
					p.pulse += p.pulseSpeed;
					p.life -= p.decay;
					if (p.x < -30) p.x = canvas.width + 10;
					if (p.x > canvas.width + 30) p.x = -10;
					if (p.y < -30) p.y = canvas.height + 10;
					if (p.y > canvas.height + 30) p.y = -10;
				} else if (pType === 'snowflake') {
					p.sway += p.swaySpeed;
					p.vx += windStrength * 0.07;
					p.x += p.vx + Math.sin(p.sway) * p.swayAmp;
					p.y += p.vy;
					p.vy += 0.006;
					p.vx *= 0.993;
					p.angle += p.spin + windStrength * 0.003;
					p.life -= p.decay;
				} else {
					p.sway += p.swaySpeed;
					p.vx += windStrength * 0.18;
					p.vy -= windStrength * 0.02;
					p.x += p.vx + Math.sin(p.sway) * p.swayAmp;
					p.y += p.vy;
					p.vy += 0.018;
					p.vx *= 0.97;
					p.angle += p.spin + windStrength * 0.008;
					p.life -= p.decay;
				}

				const offscreen = p.x > canvas.width + 50 || p.y > canvas.height + 40;
				if (p.life <= 0 || (pType !== 'firefly' && offscreen)) {
					particles.splice(i, 1);
					continue;
				}
				const fade = p.life < 0.25 ? p.life / 0.25 : 1;
				if (pType === 'firefly') {
					const pulse = 0.35 + 0.65 * Math.abs(Math.sin(p.pulse));
					drawFirefly(p.x, p.y, p.size, p.opacity * fade * pulse, p.color);
				} else if (pType === 'snowflake') {
					drawSnowflake(p.x, p.y, p.size, p.angle, p.color, p.opacity * fade);
				} else if (pType === 'sakura') {
					drawSakura(p.x, p.y, p.size, p.angle, p.color, p.opacity * fade);
				} else {
					drawLeaf(p.x, p.y, p.size, p.angle, p.color, p.opacity * fade);
				}
			}
			raf = requestAnimationFrame(animate);
		}

		hero.addEventListener('mousemove', onMouseMove);
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
	style="z-index: 19; width: 100%; height: 100%; overflow: visible;"
>
	{#each windStreaks as streak (streak.id)}
		<path
			d={streak.d}
			fill="none"
			stroke={$currentSeason.windColor}
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
			stroke={$currentSeason.windEcho}
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
							class:active={$activeSeason === s}
							onclick={() => setSeason(s as SeasonName)}
							aria-label={seasons[s as keyof typeof seasons].name}
							style={$activeSeason === s ? `--season-color: var(--season-accent)` : ''}
							>{seasons[s as keyof typeof seasons].name}</button
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
		background: var(--season-bg, #f7f3f0);
		min-height: 400px;
		transition: background 0.5s ease;
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
		border: 2px solid var(--season-accent, #c0321a);
		transition: border-color 0.4s ease;
	}

	.hero-tag {
		font-size: var(--p-text);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--season-accent, #c0321a);
		font-weight: 600;
		transition: color 0.4s ease;
	}

	.hero-name {
		color: var(--season-fg, #1a1118);
		margin: 0;
		line-height: 1;
		transition: color 0.4s ease;
	}

	.hero-accent {
		color: var(--season-accent, #c0321a);
		transition: color 0.4s ease;
	}

	.hero-desc {
		line-height: 1.75;
		color: var(--season-mid, #646464);
		max-width: 640px;
		margin: 0;
		transition: color 0.4s ease;
	}

	.hero-desc strong {
		color: var(--season-fg, #1a1118);
		font-weight: 600;
		transition: color 0.4s ease;
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
		color: var(--season-fg, #1a1118);
		transition:
			color 0.15s,
			transform 0.15s;
	}

	.hero-link:hover {
		color: var(--season-accent, #c0321a);
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
		color: var(--season-fg);
		background: none;
		border: 1px solid var(--season-fg);
		padding: 0.2em 0.65em;
		border-radius: 999px;
		cursor: pointer;
		opacity: 0.8;
		letter-spacing: 0.04em;
		transition:
			color 0.15s,
			border-color 0.15s,
			opacity 0.15s;
	}

	.effects-toggle:hover {
		color: var(--season-fg, #1a1118);
		border-color: var(--season-fg, #1a1118);
		opacity: 1;
	}

	.season-picker {
		display: flex;
		gap: 0.35rem;
	}

	.season-btn {
		font-size: 0.7rem;
		font-family: 'Source Sans Pro', sans-serif;
		color: var(--season-fg);
		background: none;
		border: 1px solid transparent;
		padding: 0.15em 0.5em;
		border-radius: 999px;
		cursor: pointer;
		opacity: 0.8;
		letter-spacing: 0.04em;
		transition:
			color 0.15s,
			border-color 0.15s,
			opacity 0.15s;
	}

	.season-btn.active {
		color: var(--season-fg);
		border-color: var(--season-color);
		opacity: 1;
	}

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
