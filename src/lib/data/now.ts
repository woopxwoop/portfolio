type NowEntry = {
	date: string; // ISO, used as the archive label
	sections: { heading: string; body: string }[];
};

export const nowEntries: NowEntry[] = [
	{
		date: '2026-03-22',
		sections: [
			{
				heading: 'School',
				body: 'In my 4th semester at UW-Madison. Currently taking interaction design, foundation models, digital circuits, physics, and intro to electrical engineering.'
			},
			{
				heading: 'Building',
				body: 'Apart from this website and Lightkeepers, I am working on SteMy, an agent designed to facilitate stem cell differentiation, and Morgridge Calender, an event calendar for aggregating CS events at UW-Madison.'
			},
			{
				heading: 'Learning',
				body: 'I have been watching the old CS544 lectures to get a better idea of distributed systems and working with big data.'
			},
			{
				heading: 'Thinking about',
				body: 'Summer internship applications. Might pick up a book on system design too.'
			}
		]
	}
];

export const current = nowEntries[0];
export const archive = nowEntries.slice(1);
