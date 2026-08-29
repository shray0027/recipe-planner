<script lang="ts">
	import { base } from '$app/paths';
	import { defineCustomElements } from '@shray0027/recipe-ui/loader';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		void defineCustomElements();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Find recipes, save favorites, and plan meals for the week." />
</svelte:head>

<header class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
	<a class="text-xl font-extrabold text-recipe-700 no-underline" href={`${base}/`}>Recipe planner</a>
	<nav class="flex flex-wrap items-center gap-4" aria-label="Main navigation">
		<a href={`${base}/`}>Discover</a>
		<a href={`${base}/favorites`}>Favorites</a>
		<a href={`${base}/planner`}>Planner</a>
		<a class="rounded-lg bg-recipe-600 px-3 py-2 font-bold text-white no-underline" href={`${base}/recipes/new`}>Add recipe</a>
	</nav>
</header>

<main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
	{@render children()}
</main>
