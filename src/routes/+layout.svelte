<script lang="ts">
	import '@fontsource/momo-signature';
	import '@/app.css';
	
	import Footer from '@/components/Footer.svelte';
	import Header from '@/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<Header />

<div class="flex items-center flex-1 flex-col">
	{@render children()}
</div>

<Footer />
