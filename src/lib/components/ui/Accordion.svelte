<script>
	let open = false;
	import { slide } from 'svelte/transition';
	const handleClick = () => (open = !open);
</script>

<div class="w-full">
	<button on:click={handleClick} class="w-full">
		<div class="header flex">
			<slot name="head"></slot>
			{open ? '-' : '+'}
		</div>
	</button>
	{#if open}
		<div transition:slide>
			<slot name="details"></slot>
		</div>
	{/if}
</div>
