import type { LinkedIcon } from '$lib/definitions';

type Project = {
	id: number;
	title: string;
	description: string;
	image: string;
	links: LinkedIcon[];
};

export const projects: Project[] = [
	{
		id: 3,
		title: 'Lightkeepers',
		description: 'A full-stack web-app to simplify Genshin Impact team building',
		image: 'https://lightkeepers.vercel.app/flins.png',
		links: [
			{ link: 'https://lightkeepers.vercel.app', icon: 'weblink' },
			{ link: 'https://github.com/woopxwoop/lightkeepers', icon: 'github' }
		]
	},
	{
		id: 2,
		title: 'Weather, Huh?',
		description: `Tomorrow.io powered weather web application for CS571`,
		image: 'https://cs571-f25.github.io/p72/icon.png',
		links: [
			{ link: 'https://cs571-f25.github.io/p72/', icon: 'weblink' },
			{ link: 'https://github.com/CS571-F25/p72', icon: 'github' }
		]
	},
	{
		id: 1,
		title: 'Pokedex',
		description: 'Javascript project that earned a five in AP CSP',
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
		image:
			'https://upload-os-bbs.hoyolab.com/upload/2023/03/04/14638982/e7c6217ab8627233b34f0ef77471a174_9152906502062637065.jpeg',
		links: [
			{ link: 'https://frzyc.github.io/genshin-optimizer', icon: 'weblink' },
			{ link: 'https://github.com/frzyc/genshin-optimizer', icon: 'github' }
		]
	}
];
