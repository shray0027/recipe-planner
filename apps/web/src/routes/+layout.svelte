<script lang="ts">
	import { base } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Find recipes, save favorites, and plan meals for the week." />
</svelte:head>

<header>
	<a class="brand" href={`${base}/`}>Recipe planner</a>
	<nav aria-label="Main navigation">
		<a href={`${base}/`}>Discover</a>
		<a href={`${base}/favorites`}>Favorites</a>
		<a href={`${base}/planner`}>Planner</a>
		<a class="add-recipe" href={`${base}/recipes/new`}>Add recipe</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		min-width: 320px;
		margin: 0;
		color: #20301f;
		background: #f6f8f3;
		font-family: Arial, sans-serif;
	}

	:global(a) {
		color: inherit;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px 24px;
	}

	.brand {
		color: #244c2a;
		font-size: 1.2rem;
		font-weight: 800;
		text-decoration: none;
	}

	nav {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	nav a {
		text-decoration: none;
	}

	.add-recipe {
		padding: 9px 12px;
		border-radius: 8px;
		color: #ffffff;
		background: #3f6b45;
		font-weight: 700;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px;
	}

	@media (max-width: 640px) {
		header {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}

		main {
			padding: 16px;
		}
	}
</style>
