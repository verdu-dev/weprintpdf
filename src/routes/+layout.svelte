<script lang="ts">
	import '@fontsource/momo-signature';
	import '@fontsource-variable/work-sans';
	import '@/app.css';

	import Footer from '@/components/Footer.svelte';
	import Header from '@/components/Header.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<Header />

<div class="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-[50px_1fr_50px]">
	<aside class="h-full border-x border-neutral-300 bg-circles dark:border-neutral-700"></aside>

	<div class="flex flex-col bg-diagonals">
		{@render children()}
	</div>

	<aside class="h-full border-x border-neutral-300 bg-circles dark:border-neutral-700"></aside>
</div>

<Footer />
