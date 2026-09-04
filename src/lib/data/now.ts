type NowEntry = {
	date: string; // ISO, used as the archive label
	sections: { heading: string; body: string }[];
};

export const nowEntries: NowEntry[] = [
	{
		date: '2026-09-04',
		sections: [
			{
				heading: 'School',
				body: 'In my 5th semester at UW-Madison. Currently taking circuits, multivariable calculus, microprocessors, and signals.'
			},
			{
				heading: 'Building',
				body: 'Still working on the full-stack development of Lightkeepers (@lightkeepers.moe).'
			},
			{
				heading: 'Part Time',
				body: 'Working remotely as a SWE Intern @ Thomson Reuters. As part of the continuous operations team, I work with datadog for monitoring and logging.'
			}
		]
	}
];

export const current = nowEntries[0];
export const archive = nowEntries.slice(1);
