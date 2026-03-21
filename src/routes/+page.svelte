<script lang="ts">
	import { onMount } from 'svelte';
	import me from '$lib/assets/samui.jpg';
	import { resolve } from '$app/paths';

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

<!-- Full-bleed hero — no wrapper padding, sits edge to edge -->
<section bind:this={hero} class="relative w-full overflow-hidden" style="height: 100svh;">
	<canvas bind:this={canvas} class="pointer-events-none absolute inset-0" style="z-index: 20;"
	></canvas>

	<div class="grid h-full grid-cols-1 md:grid-cols-2">
		<!-- Left: text — centered on mobile, left-aligned on desktop -->
		<div
			class="relative z-10 flex flex-col items-center justify-center gap-5 px-10 pt-32 pb-16 text-center md:items-start md:px-16 md:text-left"
		>
			<!-- Mobile-only avatar -->
			<div class="hero-avatar block md:hidden">
				<img src={me} alt="Andrew Lou" class="h-full w-full object-cover object-top" />
			</div>

			<div class="hero-tag accent-font">CS + CE · UW–Madison · 28</div>

			<h2 class="hero-name accent-font m-0 leading-none">
				Andrew <span class="hero-accent">Lou</span>
			</h2>

			<p class="hero-desc">
				Building at the intersection of <strong>web development</strong>,
				<strong>machine learning</strong>, and
				<strong>human-computer interaction</strong>. Equally at home in x86 assembly and React.
				Sometimes in costume.
			</p>

			<div class="flex flex-wrap justify-center gap-4 md:justify-start">
				<a href={resolve('/projects')} class="btn-primary accent-font">View Projects</a>
				<a
					href="https://drive.google.com/file/d/1ApYbuI7CXlhGWDoBljST8vUn6hR7HXcq/view?usp=sharing"
					target="_blank"
					class="btn-ghost accent-font"
				>
					Resume
				</a>
			</div>
		</div>

		<!-- Right: photo panel — hidden on mobile -->
		<div class="hero-right relative hidden items-end justify-center overflow-hidden md:flex">
			<div class="photo-arch">
				<img src={me} alt="Andrew Lou" class="h-full w-full object-cover object-top" />
			</div>
			<div class="ticker-bar">
				<span class="ticker-text accent-font">
					Web Dev &nbsp;·&nbsp; Machine Learning &nbsp;·&nbsp; HCI &nbsp;·&nbsp; Operating Systems
					&nbsp;·&nbsp; Algorithms &nbsp;·&nbsp; SvelteKit &nbsp;·&nbsp; Python &nbsp;·&nbsp; C
					&nbsp;·&nbsp; Open Source &nbsp;·&nbsp; Web Dev &nbsp;·&nbsp; Machine Learning
					&nbsp;·&nbsp; HCI &nbsp;·&nbsp; Operating Systems &nbsp;·&nbsp; Algorithms &nbsp;·&nbsp;
					SvelteKit &nbsp;·&nbsp; Python &nbsp;·&nbsp; C &nbsp;·&nbsp; Open Source
					&nbsp;&nbsp;&nbsp;
				</span>
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Page theme ── */
	:global(:root) {
		--accent-color: #c0321a;
		--nav-bg: rgba(247, 243, 240, 0.88);
		--nav-fg: #1a1118;
		--nav-border: #1a1118;
	}

	section {
		background: #f7f3f0;
	}

	.hero-avatar {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		border: 2px solid var(--accent-color);
	}

	.hero-tag {
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent-color);
		font-weight: 600;
	}

	.hero-name {
		font-size: clamp(40px, 6vw, 80px);
		color: #1a1118;
	}

	.hero-accent {
		color: var(--accent-color);
	}

	.hero-desc {
		font-size: clamp(14px, 1.2vw, 16px);
		line-height: 1.75;
		color: #6b5a54;
		max-width: 380px;
		margin: 0;
	}

	.hero-desc strong {
		color: #1a1118;
		font-weight: 600;
	}

	.btn-primary {
		background: #1a1118;
		color: #f7f3f0;
		border: none;
		padding: 0.65rem 1.6rem;
		border-radius: 3px;
		font-size: 13px;
		text-decoration: none;
		letter-spacing: 0.04em;
		transition: opacity 0.15s;
	}
	.btn-primary:hover {
		opacity: 0.8;
	}

	.btn-ghost {
		background: none;
		color: #1a1118;
		border: 2px solid #1a1118;
		padding: 0.6rem 1.6rem;
		border-radius: 3px;
		font-size: 13px;
		text-decoration: none;
		letter-spacing: 0.04em;
		transition: opacity 0.15s;
	}
	.btn-ghost:hover {
		opacity: 0.55;
	}

	.hero-right {
		background: #ece5df;
		border-left: 1px solid rgba(26, 17, 24, 0.1);
		z-index: 1;
	}

	.photo-arch {
		width: 72%;
		height: 90%;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 120px 120px 0 0;
		overflow: hidden;
		z-index: 2;
	}

	.ticker-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 28px;
		background: var(--accent-color);
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
</style>
