import type { LinkedIcon } from '$lib/definitions';

type Project = {
	id: number;
	title: string;
	description: string;
	flavor: string;
	types: string[];
	image: string;
	links: LinkedIcon[];
};

export const projects: Project[] = [
	{
		id: 3,
		title: 'Lightkeepers',
		description: 'A full-stack web-app to simplify Genshin Impact team building',
		flavor:
			'Aggregates character data, weapons, and artifact sets into a single interface. Lets players theory-craft optimal team compositions without juggling a dozen spreadsheets.',
		types: ['SvelteKit', 'Full-Stack', 'Vercel'],
		image: 'https://lightkeepers.vercel.app/flins.png',
		links: [
			{ link: 'https://lightkeepers.vercel.app', icon: 'weblink' },
			{ link: 'https://github.com/woopxwoop/lightkeepers', icon: 'github' }
		]
	},
	{
		id: 2,
		title: 'Weather, Huh?',
		description: 'Tomorrow.io powered weather web application for CS571',
		flavor:
			'Fetches hyper-local forecast data and renders it through a clean React interface. Backed by a Vercel serverless function and Redis cache to keep API calls lean.',
		types: ['React', 'REST API', 'Redis'],
		image: 'https://cs571-f25.github.io/p72/icon.png',
		links: [
			{ link: 'https://cs571-f25.github.io/p72/', icon: 'weblink' },
			{ link: 'https://github.com/CS571-F25/p72', icon: 'github' }
		]
	},
	{
		id: 1,
		title: 'Pokédex',
		description: 'Javascript project that earned a five in AP CSP',
		flavor:
			'Built entirely in Code.org App Lab with vanilla JS. Pulls Pokémon data, renders stats and sprites, and lets users browse the full National Dex — all without a framework.',
		types: ['JavaScript', 'AP CSP', 'REST API'],
		image: 'https://cs571-f25.github.io/p72/pokedex.png',
		links: [
			{
				link: 'https://studio.code.org/projects/applab/OyT0N4tNcVFDVQDuFIcrpLjZYe9oGXTZU0rUPMxwxvQ',
				icon: 'weblink'
			}
		]
	}
];

export const contributions: Project[] = [
	{
		id: 1,
		title: 'Genshin Optimizer',
		description: 'Tool to optimize damage in Genshin Impact',
		flavor:
			'Open-source React app that computes optimal artifact loadouts using combinatorial search. Contributed UI improvements and data pipeline fixes.',
		types: ['React', 'Open Source', 'TypeScript'],
		image:
			'https://upload-os-bbs.hoyolab.com/upload/2023/03/04/14638982/e7c6217ab8627233b34f0ef77471a174_9152906502062637065.jpeg',
		links: [
			{ link: 'https://frzyc.github.io/genshin-optimizer', icon: 'weblink' },
			{ link: 'https://github.com/frzyc/genshin-optimizer', icon: 'github' }
		]
	}
];
