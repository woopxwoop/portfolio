<script lang="ts">
	import '@fontsource/source-sans-pro';
	import '@fontsource/bree-serif';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import { navTheme } from '$lib/stores/theme';
	import { currentSeason } from '$lib/stores/season';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Apply season CSS vars to :root and keep navTheme in sync
	$effect(() => {
		if (!browser) return;
		const s = $currentSeason;
		const root = document.documentElement;
		root.style.setProperty('--season-bg', s.bg);
		root.style.setProperty('--season-fg', s.fg);
		root.style.setProperty('--season-mid', s.mid);
		root.style.setProperty('--season-accent', s.accent);
		root.style.setProperty('--season-nav-bg', s.bg);
		root.style.setProperty('--season-nav-border', s.navBorder);
		navTheme.set({
			bg: s.bg,
			fg: s.fg,
			border: s.navBorder,
			accent: s.accent
		});
	});

	type navItem = {
		path: Pathname;
		text: string;
	};
	const navItems: navItem[] = [
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
		class="site-nav accent-font fixed z-30 w-full backdrop-blur-sm"
		style="
			background: {$navTheme.bg};
			border-bottom-color: {$navTheme.border};
		"
	>
		<div class="nav-inner">
			<a href={resolve('/')} class="nav-name" class:nav-link--active={page.url.pathname === '/'}
				>Andrew Lou</a
			>
			<div class="nav-links">
				{#each navItems as navItem (navItem.path)}
					<a
						href={resolve(navItem.path)}
						aria-current={page.url.pathname === navItem.path ? 'page' : undefined}
						class="nav-link p-text duration-150 hover:-translate-y-0.5"
						class:nav-link--active={page.url.pathname === navItem.path}
					>
						{navItem.text}
					</a>
				{/each}
			</div>
		</div>
	</nav>

	{@render children()}

	<footer>
		<span>© {new Date().getFullYear()} Andrew Lou</span>
		{#each footerSections.flatMap((s) => s.sectionItems.filter((i) => i.link)) as item (item.link)}
			<span class="sep" aria-hidden="true">·</span>
			<a href={item.link} rel="external" target="_blank" class="footer-link">{item.text}</a>
		{/each}
	</footer>
</div>

<style>
	.site-nav {
		border-bottom: 2px solid;
		transition:
			background 0.5s ease,
			border-color 0.5s ease;
	}

	.nav-inner {
		width: 90%;
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-name {
		color: var(--nav-fg);
		text-decoration: none;
		font-size: var(--p-text);
		transition: color 0.15s;
	}

	.nav-name:hover {
		color: var(--season-accent);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-link {
		color: var(--nav-fg);
		text-decoration: none;
		transition: color 0.15s;
	}

	.nav-link:hover {
		color: var(--season-accent);
	}

	.nav-link--active {
		color: var(--season-accent);
	}

	footer {
		width: 100%;
		background: var(--season-bg, #f7f3f0);
		color: var(--season-fg, #646464);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.1rem 0.5rem;
		padding: 1.25rem 2rem;
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 0.85rem;
		border-top: 1px solid var(--season-nav-border, var(--slightlydarker-color));
		transition:
			background 0.5s ease,
			color 0.5s ease,
			border-color 0.5s ease;
	}

	footer span,
	footer a {
		font-size: 16px;
	}

	.sep {
		user-select: none;
	}

	.footer-link {
		text-decoration: none;
		transition: color 0.15s;
	}

	.footer-link:hover {
		color: var(--season-accent, #c0321a);

		text-decoration: underline;
	}
</style>
