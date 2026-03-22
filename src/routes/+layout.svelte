<script lang="ts">
	import '@fontsource/source-sans-pro';
	import '@fontsource/bree-serif';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import { navTheme } from '$lib/stores/theme';
	import { resolve } from '$app/paths';

	let { children } = $props();

	type navItem = {
		path: Pathname;
		text: string;
	};
	const navItems: navItem[] = [
		{ path: '/', text: 'About' },
		{ path: '/projects', text: 'Projects' },
		{ path: '/now', text: 'Now' }
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
				{ text: 'email', link: 'mailto:alou2@wisc.edu' },
				{ text: 'linkedin', link: 'https://www.linkedin.com/in/andrew-lou-uw/' }
			]
		},
		{
			sectionTitle: 'Docs',
			sectionItems: [
				{ text: 'github', link: 'https://github.com/woopxwoop' },
				{
					text: 'resume',
					link: 'https://drive.google.com/file/d/1ApYbuI7CXlhGWDoBljST8vUn6hR7HXcq/view?usp=sharing'
				}
			]
		}
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex w-full grow flex-col items-center">
	<nav
		class="site-nav accent-font fixed z-30 flex w-full flex-row justify-start gap-8 p-4 px-8 backdrop-blur-sm"
		style="
			background: {$navTheme.bg};
			border-bottom-color: {$navTheme.border};
			--nav-fg: {$navTheme.fg};
			--accent-color: {$navTheme.accent};
		"
	>
		{#each navItems as navItem (navItem.path)}
			<a
				href={resolve(navItem.path)}
				aria-current={page.url.pathname === navItem.path ? 'page' : undefined}
				class="nav-link h2-text duration-150 hover:-translate-y-0.5"
				class:nav-link--active={page.url.pathname === navItem.path}
			>
				{navItem.text}
			</a>
		{/each}
	</nav>

	{@render children()}

	<footer class="flex w-full justify-center border-t-2 border-(--darker-color)">
		<div class="grid w-[90%] grid-cols-12 px-8 py-6">
			{#each footerSections as section (section.sectionTitle)}
				<div class="col-span-3 flex flex-col">
					<div class="p-text mb-4">{section.sectionTitle}</div>
					{#each section.sectionItems as item (item.link)}
						{#if item.link}
							<a
								class="p-text footer-link intermediate-color"
								href={item.link}
								rel="external"
								target="_blank"
							>
								{item.text}
							</a>
						{:else}
							<div class="p-text">{item.text}</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</footer>
</div>

<style>
	footer {
		background: #f7f3f0;
		color: var(--darker-color);
	}

	.site-nav {
		border-bottom: 2px solid;
		transition:
			background 0.4s,
			border-color 0.4s;
	}

	.nav-link {
		color: var(--nav-fg);
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--accent-color);
	}

	.nav-link--active {
		color: var(--accent-color);
	}

	.footer-link {
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: var(--accent-color);
	}
</style>
