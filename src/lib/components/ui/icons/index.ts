import GithubIcon from './GithubIcon.svelte';
import LinkedInIcon from './LinkedInIcon.svelte';
import MailIcon from './MailIcon.svelte';
import WebsiteIcon from './WebsiteIcon.svelte';
import DefaultIcon from './DefaultIcon.svelte';

export type IconName = 'github' | 'linkedin' | 'mail' | 'weblink';

export const icons = {
	github: GithubIcon,
	linkedin: LinkedInIcon,
	mail: MailIcon,
	weblink: WebsiteIcon
} as const;

export { DefaultIcon };
