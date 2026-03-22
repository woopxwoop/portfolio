import { writable } from 'svelte/store';

export type NavTheme = {
	bg: string;
	fg: string;
	border: string;
	accent: string;
};

export const navTheme = writable<NavTheme>({
	bg: 'rgba(234, 234, 234, 0.88)',
	fg: '#1a1118',
	border: '#1a1118',
	accent: '#c0321a'
});
