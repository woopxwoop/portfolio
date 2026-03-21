<script lang="ts">
	import '@fontsource/source-sans-pro';
	import '@fontsource/bree-serif';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	let { children } = $props();

	type NavItem = {
		path: Pathname;
		text: string;
	};

	let navItems: NavItem[] = [
		{ path: '/', text: 'Andrew' },
		{ path: '/projects', text: 'Projects' },
		{ path: '/interests', text: 'Interests' },
		{ path: '/blog', text: 'Blog' },
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

<div class="flex w-full flex-col items-center">
	<nav
		class="site-nav accent-font fixed z-30 flex w-full flex-row justify-start gap-4 p-4 px-16 backdrop-blur-sm"
	>
		{#each navItems as navItem (navItem.path)}
			<a
				href={resolve(navItem.path)}
				aria-current={page.url.pathname === navItem.path}
				class="nav-link h2-text duration-150 hover:-translate-y-0.5"
				class:nav-link--active={page.url.pathname === navItem.path}
			>
				{navItem.text}
			</a>
		{/each}
	</nav>

	<!-- No spacer here — full-bleed pages handle their own top offset -->
	{@render children()}

	<footer class="invert-theme flex w-full justify-center">
		<div class="grid w-[90%] grid-cols-12 px-8 py-6">
			{#each footerSections as section (section.sectionTitle)}
				<div class="col-span-3 flex flex-col">
					<div class="p-text mb-4">{section.sectionTitle}</div>
					{#each section.sectionItems as item (item.link)}
						{#if item.link}
							<a
								class="p-text lighter-color footer-link"
								href={item.link}
								rel="external"
								target="_blank"
							>
								{item.text}
							</a>
						{:else}
							<div class="p-text lighter-color">{item.text}</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</footer>
</div>

<style>
	/*
	  Nav reads --nav-bg, --nav-fg, --nav-border set per page via :global(:root).
	  Fallbacks keep it working on pages that haven't defined a theme yet.
	*/
	.site-nav {
		background: var(--nav-bg, rgba(234, 234, 234, 0.88));
		border-bottom: 2px solid var(--nav-border, var(--foreground-color));
		transition:
			background 0.4s,
			border-color 0.4s;
	}

	.nav-link {
		color: var(--nav-fg, var(--foreground-color));
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--accent-color, var(--nav-fg, var(--foreground-color)));
	}

	.nav-link--active {
		color: var(--accent-color, var(--foreground-color));
	}

	.footer-link {
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: var(--accent-color);
	}
</style>
