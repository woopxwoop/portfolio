<script lang="ts">
	import { icons, DefaultIcon, type IconName } from '$lib/components/ui/icons';

	let { icon }: { icon: IconName } = $props();

	const SelectedIcon = $derived(icons[icon] ?? DefaultIcon);
</script>

<div aria-hidden="true" class="h-full w-full">
	<SelectedIcon />
</div>
