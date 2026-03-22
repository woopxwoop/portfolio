<script lang="ts">
	import { onMount } from 'svelte';
	import me from '$lib/assets/samui.jpg';
	import { navTheme } from '$lib/stores/theme';

	let canvas: HTMLCanvasElement;
	let hero: HTMLElement;

	const COLORS = ['#b02a14', '#c0321a', '#a82010', '#cc3a1e', '#961e0e', '#d44422', '#8a1a0c'];

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
			border: '#1a1118',
			accent: '#c0321a'
		});

		const ctx = canvas.getContext('2d')!;
		const leaves: Leaf[] = [];
		let lastX = -999,
			lastY = -999;
		let spawnCooldown = 0;
		let raf: number;

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
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (spawnCooldown > 0) spawnCooldown--;

			for (let i = leaves.length - 1; i >= 0; i--) {
				const l = leaves[i];
				l.sway += l.swaySpeed;
				l.x += l.vx + Math.sin(l.sway) * l.swayAmp;
				l.y += l.vy;
				l.vy += 0.018;
				l.vx *= 0.98;
				l.angle += l.spin;
				l.life -= l.decay;

				if (l.y > canvas.height + 30 || l.life <= 0) {
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

<section bind:this={hero} class="h-svh w-full overflow-hidden">
	<canvas bind:this={canvas} class="pointer-events-none absolute inset-0"></canvas>

	<!-- Single unified layout: text left, portrait right -->
	<div class="hero-inner">
		<!-- Text block -->
		<div class="hero-copy">
			<!-- Mobile avatar -->
			<div class="hero-avatar-mobile">
				<img src={me} alt="Andrew Lou" class="h-full w-full object-cover" />
			</div>

			<h1 class="hero-name accent-font">
				Andrew <span class="hero-accent">Lou</span>
			</h1>

			<p class="hero-desc">
				Computer Science and Engineering student at the University of <span class="hero-accent"
					>Wisconsin-Madison</span
				>
				interested in <strong>web development</strong>,
				<strong>machine learning</strong>, and
				<strong>human-computer interaction</strong>.
			</p>
		</div>

		<!-- Portrait — sits in the same background, no panel -->
		<div class="hero-portrait">
			<img src={me} alt="Andrew Lou" class="portrait-img" />
		</div>
	</div>
</section>

<style>
	section {
		background: #f7f3f0;
	}

	/* ── Layout ─────────────────────────────────────── */
	.hero-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0;
		padding-bottom: 28px; /* clear ticker */
	}

	/* ── Copy (left) ─────────────────────────────────── */
	.hero-copy {
		position: relative;
		z-index: 10;
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.25rem;
		padding: 0 4rem 0 10vw;
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

	/* h2 already inherits --h2-text from the global rule; only set layout/color here */
	.hero-name {
		color: #1a1118;
		margin: 0;
		line-height: 1;
	}

	.hero-accent {
		color: #c0321a;
	}

	/* p already inherits --p-text from the global rule; only set layout/color here */
	.hero-desc {
		line-height: 1.75;
		color: #6b5a54;
		max-width: 380px;
		margin: 0;
	}

	.hero-desc strong {
		color: #1a1118;
		font-weight: 600;
	}

	/* ── Portrait (right) ────────────────────────────── */
	.hero-portrait {
		position: relative;
		z-index: 10;
		flex: 0 0 auto;
		/* generous right padding so the photo doesn't hug the edge */
		padding-right: 10vw;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.portrait-img {
		display: block;
		/* tall crop: fills vertically, lets face show from roughly mid-torso up */
		height: 60%;
		width: auto;
		max-width: 340px;
		object-fit: cover;
		object-position: top;
		border-radius: 140px 140px 0 0;
	}

	/* ── Ticker ──────────────────────────────────────── */
	.ticker-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 28px;
		background: #c0321a;
		overflow: hidden;
		display: flex;
		align-items: center;
		z-index: 10;
	}

	.ticker-text {
		display: inline-block;
		white-space: nowrap;
		animation: ticker 26s linear infinite;
		font-size: 11px;
		color: rgba(247, 243, 240, 0.9);
		letter-spacing: 0.08em;
	}

	@keyframes ticker {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
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
			padding: 0;
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
