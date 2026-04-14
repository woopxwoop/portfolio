<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.title} — Andrew Lou</title>
</svelte:head>

<main>
	<div class="inner">
		<!-- Back link -->
		<a href={resolve('/projects')} class="back accent-font p-text">← Projects</a>

		<!-- Header -->
		<header class="project-header">
			<div class="header-left">
				<h1 class="accent-font">{project.title}</h1>
				<p class="description">{project.description}</p>
			</div>
			<div class="header-right">
				<div class="tags">
					{#each project.types as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				<div class="links">
					{#each project.links as link (link.icon)}
						<a
							href={link.link}
							rel="external"
							target="_blank"
							aria-label="{project.title} {link.icon}"
							class="project-link"
						>
							<Icon icon={link.icon} />
						</a>
					{/each}
				</div>
			</div>
		</header>

		<hr class="divider" />

		<!-- Write your project content here -->
		<article class="project-body">
			<p>{project.flavor}</p>
			<!-- Add more content here as you write each project page -->
		</article>
	</div>
</main>

<style>
	main {
		width: 100%;
		padding-top: 4rem;
		min-height: 100svh;
	}

	/* ── Inner content ───────────────────────────────── */
	.inner {
		width: 90%;
		max-width: 860px;
		margin: 0 auto;
		padding: 2.5rem 0 6rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* ── Back link ───────────────────────────────────── */
	.back {
		color: var(--season-mid);
		text-decoration: none;
		transition: color 0.15s;
		align-self: flex-start;
	}

	.back:hover {
		color: var(--season-accent);
	}

	/* ── Header ──────────────────────────────────────── */
	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 2rem;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.project-header h1 {
		margin: 0;
		line-height: 1;
	}

	.description {
		color: var(--season-mid);
		margin: 0;
	}

	.header-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.tags {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.tag {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--season-mid);
		border: 1px solid var(--season-mid);
		padding: 0.2em 0.6em;
		border-radius: 999px;
	}

	.links {
		display: flex;
		gap: 0.875rem;
	}

	.project-link {
		width: 1.25rem;
		height: 1.25rem;
		color: #1a1118;
		display: block;
		transition:
			color 0.15s,
			transform 0.15s;
	}

	.project-link:hover {
		color: #c0321a;
		transform: translateY(-2px);
	}

	.divider {
		border: none;
		border-top: 1px solid var(--season-mid);
		margin: 0;
	}

	/* ── Article body ────────────────────────────────── */
	.project-body {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 680px;
	}

	.project-body p {
		margin: 0;
		line-height: 1.75;
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 600px) {
		.project-header {
			flex-direction: column;
			gap: 1.25rem;
		}

		.header-right {
			align-items: flex-start;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			gap: 1rem;
		}

		.tags {
			justify-content: flex-start;
		}
	}
</style>
