<script lang="ts">
	import '@/app.css';
	import Footer from '@/components/Footer.svelte';
	import Header from '@/components/Header.svelte';
	import favicon from '@/lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />
{@render children()}
<Footer />
