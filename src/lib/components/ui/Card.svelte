<script lang="ts">
	let {
		image,
		title,
		text,
		link
	}: {
		image: string | undefined;
		title: string | undefined;
		text: string | undefined;
		link: string | undefined;
	} = $props();
</script>

<div
	class="flex h-full w-full flex-col justify-center overflow-hidden rounded-xl border-2 border-(--foreground-color) align-bottom duration-150 hover:-translate-y-2"
>
	<img src={image} alt={title} class="aspect-square h-full w-full object-cover" />
	<div class="h-full border-t-2 p-4">
		<div class="secondary-color italic">
			{#if typeof link == 'string'}
				<a href={link} target="_blank" class="h2-text block underline duration-150 hover:scale-105"
					>{title}</a
				>
			{:else}
				<h2>{title}</h2>
			{/if}
		</div>
		<p class="intermediate-color mt-5">{text}</p>
	</div>
</div>
