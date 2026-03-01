<script lang="ts">
	import type { LinkedIcon } from '$lib/definitions';
	import Icon from '$lib/components/ui/Icon.svelte';

	let {
		image,
		title,
		text,
		links
	}: {
		image: string | undefined;
		title: string | undefined;
		text: string | undefined;
		links: LinkedIcon[] | undefined;
	} = $props();
</script>

<div
	class="group transition-[transform, box-shadow] flex h-full flex-col justify-center overflow-hidden rounded-xl bg-(--lighter-color) align-bottom duration-200 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-black/25"
>
	<div class=" aspect-4/3 h-full w-full overflow-hidden">
		<img
			src={image}
			alt=""
			class=" h-full w-full object-cover duration-200 group-hover:scale-105"
		/>
	</div>
	<div class="flex h-full flex-col p-4">
		<h2 class="font-semibold">{title}</h2>
		<p class="intermediate-color mt-4">{text}</p>
		<div class="mt-auto flex h-6 w-full flex-row items-center justify-end gap-4">
			{#each links as link}
				<a
					href={link.link}
					class="h-full hover:text-(--secondary-color)"
					target="_blank"
					aria-label="link to project {link.icon}"
				>
					<Icon icon={link.icon}></Icon>
				</a>
			{/each}
		</div>
	</div>
</div>
