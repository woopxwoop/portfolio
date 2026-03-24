import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type SeasonName = 'fall' | 'winter' | 'spring' | 'summer';

export type SeasonConfig = {
	name: string;
	bg: string;
	fg: string;
	mid: string;
	accent: string;
	navBg: string;
	navBorder: string;
	particleColors: string[];
	windColor: string;
	windEcho: string;
	gustInterval: [number, number];
	particleDecay: [number, number];
	particleType: 'leaf' | 'snowflake' | 'sakura' | 'firefly';
};

export const seasons: Record<SeasonName, SeasonConfig> = {
	fall: {
		name: 'Fall',
		bg: '#f7f3f0',
		fg: '#1a1118',
		mid: '#646464',
		accent: '#c0321a',
		navBg: 'rgba(247,243,240,0.88)',
		navBorder: '#646464',
		particleColors: ['#b02a14', '#c0321a', '#a82010', '#cc3a1e', '#961e0e', '#d44422', '#8a1a0c'],
		windColor: 'rgba(80,215,160,0.75)',
		windEcho: 'rgba(160,245,210,0.35)',
		gustInterval: [240, 480],
		particleDecay: [0.003, 0.003],
		particleType: 'leaf'
	},
	winter: {
		name: 'Winter',
		bg: '#090e18',
		fg: '#ccdcee',
		mid: '#7090aa',
		accent: '#5b9fd8',
		navBg: 'rgba(9,14,24,0.88)',
		navBorder: '#1a2a40',
		particleColors: ['#cce8f4', '#a8d4e8', '#e8f4fc', '#dff0f8', '#b8dff0', '#ffffff'],
		windColor: 'rgba(180,220,255,0.45)',
		windEcho: 'rgba(220,240,255,0.2)',
		gustInterval: [180, 360],
		particleDecay: [0.0007, 0.0008],
		particleType: 'snowflake'
	},
	spring: {
		name: 'Spring',
		bg: '#fdf4f7',
		fg: '#1a1118',
		mid: '#7a5060',
		accent: '#c4527a',
		navBg: 'rgba(253,244,247,0.88)',
		navBorder: '#d4a0b8',
		particleColors: ['#f7c5d5', '#f4a7be', '#e8829e', '#fadadd', '#f0b8c8', '#d4688a', '#fce4ec'],
		windColor: 'rgba(212,104,138,0.45)',
		windEcho: 'rgba(240,180,210,0.22)',
		gustInterval: [300, 540],
		particleDecay: [0.002, 0.003],
		particleType: 'sakura'
	},
	summer: {
		name: 'Summer',
		bg: '#110d02',
		fg: '#f5e8c0',
		mid: '#9a8050',
		accent: '#e8a820',
		navBg: 'rgba(17,13,2,0.88)',
		navBorder: '#2a2008',
		particleColors: ['#f0e040', '#e8d820', '#ffd840', '#f5e880', '#d4b018', '#ffe870'],
		windColor: 'rgba(232,200,32,0.12)',
		windEcho: 'rgba(240,220,80,0.06)',
		gustInterval: [900, 1800],
		particleDecay: [0.0015, 0.002],
		particleType: 'firefly'
	}
};

function getSeasonByDate(): SeasonName {
	const m = new Date().getMonth();
	if (m >= 2 && m <= 4) return 'spring';
	if (m >= 5 && m <= 7) return 'summer';
	if (m >= 8 && m <= 10) return 'fall';
	return 'winter';
}

const stored = browser ? (localStorage.getItem('active-season') as SeasonName | null) : null;

export const activeSeason = writable<SeasonName>(stored ?? getSeasonByDate());

if (browser) {
	activeSeason.subscribe((s) => localStorage.setItem('active-season', s));
}

export const currentSeason = derived(activeSeason, ($s) => seasons[$s]);
