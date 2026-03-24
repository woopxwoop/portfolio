<script lang="ts">
	import { allProjects } from '$lib/data/projects';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Andrew's Projects!</title>
	<meta name="description" content="Andrew Lou's projects" />
</svelte:head>

<main class="pt-32">
	<section class="grid-section">
		<div class="masonry">
			{#each allProjects as project, i (project.slug)}
				<a
					href={resolve(`/projects/${project.slug}`)}
					class="brick"
					class:brick--tall={i === 0}
					class:brick--wide={i === 2}
					aria-label={project.title}
				>
					<div class="brick-image">
						<img src={project.image} alt="thumbnail of {project.title}" />
					</div>

					<div class="brick-footer">
						<div class="tags">
							{#each project.types as tag (tag)}
								<span class="tag">{tag}</span>
							{/each}
						</div>
						<h2 class="brick-title accent-font">{project.title}</h2>
						<p class="brick-desc">{project.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	main {
		width: 100%;
		min-height: 100svh;
	}

	/* ── Masonry grid ────────────────────────────────── */
	.grid-section {
		padding: 2rem 0 4rem;
		width: 90%;
		max-width: 1100px;
		margin: 0 auto;
	}

	.masonry {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-auto-rows: 80px;
		gap: 1rem;
	}

	/* ── Bricks ──────────────────────────────────────── */
	.brick {
		grid-column: span 4;
		grid-row: span 4;
		position: relative;
		border-radius: 6px;
		overflow: hidden;
		text-decoration: none;
		display: block;
	}

	.brick--tall {
		grid-column: span 7;
		grid-row: span 6;
	}

	.brick--wide {
		grid-column: span 5;
		grid-row: span 3;
	}

	/* ── Image: grayscale → color on hover ───────────── */
	.brick-image {
		position: absolute;
		inset: 0;
	}

	.brick-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		display: block;
		filter: grayscale(1);
		transition:
			filter 0.4s ease,
			transform 0.5s ease;
	}

	.brick:hover .brick-image img {
		filter: grayscale(0);
		transform: scale(1.04);
	}

	/* ── Footer: title + tags ────────────────────────── */
	.brick-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.875rem 1.25rem;
		background: rgb(from var(--season-accent) r g b / 0.82);
		color: var(--season-bg);
		backdrop-filter: blur(2px);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		transition: padding-bottom 0.3s ease;
	}

	.brick:hover .brick-footer {
		padding-bottom: 1.25rem;
	}

	.tags {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 1px solid rgb(from var(--season-bg) r g b / 0.3);
		padding: 0.2em 0.55em;
		border-radius: 999px;
	}

	.brick-title {
		margin: 0;
		line-height: 1.05;
	}

	.brick-desc {
		margin: 0;
		font-size: var(--p-text);
		line-height: 1.4;
		max-height: 0;
		overflow: hidden;
		transition:
			color 0.3s ease,
			max-height 0.3s ease;
	}

	.brick:hover .brick-desc {
		color: rgb(from var(--season-bg) r g b / 0.85);
		max-height: 4rem;
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 700px) {
		.masonry {
			grid-template-columns: 1fr 1fr;
			grid-auto-rows: auto;
		}

		.brick,
		.brick--tall,
		.brick--wide {
			grid-column: span 1;
			grid-row: span 1;
			height: 220px;
		}

		/* always show color on touch */
		.brick-image img {
			filter: grayscale(0);
		}

		.brick-desc {
			display: none;
		}
	}

	@media (max-width: 420px) {
		.masonry {
			grid-template-columns: 1fr;
		}
	}
</style>
