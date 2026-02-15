<script lang="ts">
	import me from '$lib/assets/samui.jpg';
	import Card from '$lib/components/ui/Card.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import { projects, contributions } from '$lib/data/projects';
	import { courses } from '$lib/data/courses';
</script>

<main class="w-[80%]">
	<div class="grid w-full grid-cols-12 content-center items-center justify-center gap-8">
		<div class="h2-text col-span-8">
			Yahallo. I am <span class="secondary-color">Andrew Lou</span>, a 2nd year student in Computer
			Science and Computer Engineering at the University of Wisconsin-Madison interested in
			<span class="accent-font">Web Development </span>,
			<span class="accent-font">Machine Learning</span>, and
			<span class="accent-font">Human-Computer Interaction</span>.
		</div>
		<img
			src={me}
			alt="me"
			class="col-span-4 aspect-square max-h-64 max-w-full rounded-xl border-2 border-(--secondary-color) object-cover"
		/>
	</div>

	<div class="mt-10"></div>
	<h1 class="accent-font mb-8 border-b-8 border-(--secondary-color)">
		Personal and School Projects
	</h1>
	<div class="grid w-full grid-cols-12 content-center justify-center gap-8">
		{#each projects as project}
			<div class="col-span-6 sm:col-span-4 lg:col-span-3">
				<Card
					image={project.image}
					title={project.title}
					text={project.description}
					link={project.link}
				></Card>
			</div>
		{/each}
	</div>

	<div class="mt-10"></div>
	<h1 class="accent-font mb-8 border-b-8 border-(--secondary-color)">Open Source Contributions</h1>
	<div class="grid w-full grid-cols-12 content-center justify-center gap-8">
		{#each contributions as project}
			<div class="col-span-6 sm:col-span-4 lg:col-span-3">
				<Card
					image={project.image}
					title={project.title}
					text={project.description}
					link={project.link}
				></Card>
			</div>
		{/each}
	</div>

	<div class="mt-10"></div>
</main>
