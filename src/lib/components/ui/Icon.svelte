<script lang="ts">
	import { icons, DefaultIcon, type IconName } from '$lib/components/ui/icons';

	let { icon }: { icon: IconName } = $props();

	const SelectedIcon = $derived(icons[icon] ?? DefaultIcon);
</script>

<div aria-hidden="true" class="icon-container h-full w-full">
	<SelectedIcon />
</div>

<style>
	.icon-container :global(svg) {
		color: var(--season-fg);
		background: var(--season-bg);
		transition:
			background-color 0.5s ease,
			color 0.5s ease;
	}

	.icon-container :global(svg:hover) {
		color: var(--season-accent);
	}
</style>
