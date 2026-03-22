import type { LinkedIcon } from '$lib/definitions';

type Project = {
	slug: string;
	title: string;
	description: string;
	flavor: string;
	types: string[];
	image: string;
	links: LinkedIcon[];
};

export const projects: Project[] = [
	{
		slug: 'lightkeepers',
		title: 'Lightkeepers',
		description: 'Web application for Genshin Impact team building',
		flavor:
			"Gives personalized team and character suggestions to users based on team usage rate data and the user's owned roster.",
		types: ['Svelte', 'FastAPI', 'Postgres'],
		image: 'https://lightkeepers.vercel.app/thumbnail.png',
		links: [
			{ link: 'https://lightkeepers.vercel.app', icon: 'weblink' },
			{ link: 'https://github.com/woopxwoop/lightkeepers', icon: 'github' }
		]
	},
	{
		slug: 'weather-huh',
		title: 'Weather, Huh?',
		description: 'Tomorrow.io powered weather app',
		flavor:
			'Fetches hyper-local forecast data and renders it through a clean React interface. Backed by Vercel serverless functions and Redis caching to keep API calls lean.',
		types: ['Nextjs', 'Redis'],
		image: 'https://cs571-f25.github.io/p72/icon.png',
		links: [
			{ link: 'https://cs571-f25.github.io/p72/', icon: 'weblink' },
			{ link: 'https://github.com/CS571-F25/p72', icon: 'github' }
		]
	}
];

export const contributions: Project[] = [
	{
		slug: 'genshin-optimizer',
		title: 'Genshin Optimizer',
		description: 'Web application to optimize damage',
		flavor:
			'Open-source React app that computes optimal artifact loadouts and weapon configurations. Contributed UI improvements and data pipeline fixes.',
		types: ['React', 'Open Source'],
		image:
			'https://upload-os-bbs.hoyolab.com/upload/2023/03/04/14638982/e7c6217ab8627233b34f0ef77471a174_9152906502062637065.jpeg',
		links: [
			{ link: 'https://frzyc.github.io/genshin-optimizer', icon: 'weblink' },
			{ link: 'https://github.com/frzyc/genshin-optimizer', icon: 'github' }
		]
	}
];

export const allProjects = [...projects, ...contributions];
