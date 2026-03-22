<script lang="ts">
	import { onMount } from 'svelte';
	import { navTheme } from '$lib/stores/theme';
	import { current, archive } from '$lib/data/now';

	onMount(() => {
		navTheme.set({
			bg: 'rgba(247, 243, 240, 0.88)',
			fg: '#1a1118',
			border: '#646464',
			accent: '#c0321a'
		});
	});

	const formatted = (iso: string) => {
		const [y, m, d] = iso.split('-').map(Number);
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(y, m - 1, d));
	};
</script>

<div class="main-container flex w-full">
	<main>
		<time datetime={current.date}>{formatted(current.date)}</time>

		{#each current.sections as { heading, body } (heading)}
			<h2>{heading}</h2>
			<p>{body}</p>
		{/each}

		{#if archive.length > 0}
			<h1>Archive</h1>
			<ul>
				{#each archive as entry (entry.date)}
					<li>{formatted(entry.date)}</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<style>
	.main-container {
		background: #f7f3f0;
	}
	main {
		max-width: 640px;
		margin: 0 auto;
		padding: 8rem 2rem 6rem;
		font-family: Georgia, 'Times New Roman', serif;
	}

	time {
		display: block;
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 1.4rem;
		letter-spacing: 0.05em;
		color: var(--intermediate-color);
		margin-bottom: 2.5rem;
	}

	h2 {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.6rem;
		font-weight: bold;
		margin: 2.25rem 0 0.35rem;
	}

	p {
		font-size: 1.2rem;
		color: var(--intermediate-color);
		line-height: 1.75;
		margin: 0;
	}

	ul {
		padding-left: 1.1rem;
		margin: 0;
	}

	li {
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 1rem;
		color: var(--intermediate-color);
		line-height: 2;
	}
</style>
