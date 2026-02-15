type Project = {
	id: number;
	title: string;
	description: string;
	image: string;
	link: string;
};

export const projects: Project[] = [
	{
		id: 4,
		title: 'Lightkeepers',
		description: 'Simplify Genshin Impact team building',
		image: 'https://lightkeepers.vercel.app/flins.png',
		link: 'https://lightkeepers.vercel.app'
	},
	{
		id: 3,
		title: 'Flappy Bird NN',
		description: 'Feedforward neural network plays Flappy Bird',
		image: 'https://woopxwoop.github.io/flappy-bird/thumbnail.png',
		link: 'https://woopxwoop.github.io/flappy-bird'
	},
	{
		id: 2,
		title: 'Weather, Huh?',
		description: 'Tomorrow.io powered weather web app',
		image: 'https://cs571-f25.github.io/p72/icon.png',
		link: 'https://cs571-f25.github.io/p72/'
	},
	{
		id: 1,
		title: 'Pokedex',
		description: 'Pokedex made by a fifteen year old',
		image: 'https://cs571-f25.github.io/p72/wooper.png',
		link: 'https://studio.code.org/projects/applab/OyT0N4tNcVFDVQDuFIcrpLjZYe9oGXTZU0rUPMxwxvQ'
	}
];

export const contributions: Project[] = [
	{
		id: 1,
		title: 'Genshin Optimizer',
		description: 'Tool to optimize damage in Genshin Impact',
		image:
			'https://upload-os-bbs.hoyolab.com/upload/2023/03/04/14638982/e7c6217ab8627233b34f0ef77471a174_9152906502062637065.jpeg',
		link: 'https://frzyc.github.io/genshin-optimizer'
	}
];
