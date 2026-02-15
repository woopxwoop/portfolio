<script lang="ts">
	export const prerender = true;
	import '@fontsource/source-sans-pro';
	import '@fontsource/bree-serif';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { ResolvedPathname } from '$app/types';

	let { children } = $props();

	type NavItem = {
		path: ResolvedPathname;
		text: string;
	};

	let navItems: NavItem[] = [
		{
			path: resolve('/'),
			text: 'Andrew'
		},
		{
			path: resolve('/interests'),
			text: 'Interests'
		},
		{
			path: resolve('/now'),
			text: 'Now'
		}
	];

	type footerSection = {
		sectionTitle: string;
		sectionItems: sectionItem[];
	};

	type sectionItem = {
		text: string;
		link?: string;
	};

	let footerSections: footerSection[] = [
		{
			sectionTitle: 'Contact',
			sectionItems: [
				{
					text: 'email',
					link: 'mailto:alou2@wisc.edu'
				},
				{
					text: 'linkedin',
					link: 'https://www.linkedin.com/in/andrew-lou-uw/'
				}
			]
		},
		{
			sectionTitle: 'Docs',
			sectionItems: [
				{
					text: 'github',
					link: 'https://github.com/woopxwoop'
				},
				{
					text: 'resume'
				}
			]
		}
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex w-full flex-col items-center">
	<nav
		class="accent-font fixed z-10 flex w-full flex-row justify-start gap-4 border-b-2 border-(--foreground-color) p-4 px-12 backdrop-blur-xs"
	>
		{#each navItems as navItem}
			<a
				href={navItem.path}
				aria-current={page.url.pathname === navItem.path}
				class="h2-text duration-150 hover:-translate-y-0.5 hover:text-(--secondary-color)"
				class:italic={page.url.pathname === navItem.path}
				class:text-(--secondary-color)={page.url.pathname === navItem.path}
			>
				{navItem.text}
			</a>
		{/each}
	</nav>
	<div class="mt-32"></div>

	{@render children()}
	<footer class="invert-theme flex h-48 w-full justify-center">
		<div class="grid w-[80%] grid-cols-12 px-8 py-6">
			{#each footerSections as section}
				<div class="col-span-3 flex flex-col">
					<div class="p-text mb-4">{section.sectionTitle}</div>
					{#each section.sectionItems as item}
						{#if item.link}
							<a class="p-text lighter-color" href={item.link} target="_blank"> {item.text}</a>
						{:else}
							<div class="p-text lighter-color">{item.text}</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</footer>
</div>
