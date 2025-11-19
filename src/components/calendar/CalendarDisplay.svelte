<script>
	import { bloburi } from '@/lib/stores';

	let { src } = $props();

	$effect(() => {
		src = $bloburi + "#view=fith";
	});
</script>

<article class="flex items-center justify-center overflow-clip rounded-3xl text-neutral-100">
	{#if $bloburi}
		<iframe class="size-full border-none" {src} title="Vista previa del calendario"></iframe>
	{/if}
</article>

<style>
	article {
		corner-shape: squircle;
	}
</style>
