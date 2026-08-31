<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		void import(/* @vite-ignore */ asset('/recipe-ui/loader.js')).then(({ defineCustomElements }) => defineCustomElements());
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Find recipes, save favorites, and plan meals for the week." />
</svelte:head>

<header class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
	<a class="text-xl font-extrabold text-recipe-700 no-underline" href={resolve('/')}>Recipe planner</a>
	<nav class="flex flex-wrap items-center gap-4" aria-label="Main navigation">
		<a href={resolve('/')}>Discover</a>
		<a href={resolve('/favorites')}>Favorites</a>
		<a href={resolve('/planner')}>Planner</a>
		<a class="rounded-lg bg-recipe-600 px-3 py-2 font-bold text-white no-underline" href={resolve('/recipes/new')}>Add recipe</a>
	</nav>
</header>

<main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
	{@render children()}
</main>
