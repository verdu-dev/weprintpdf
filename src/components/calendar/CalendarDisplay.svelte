<script lang="ts">
	import { onMount } from 'svelte';
	import { bloburi } from '@/lib/stores';

	let canvas: HTMLCanvasElement;
	let isLoading = false;
	let mounted = false;

	async function renderPdf() {
		if (!$bloburi) return;

		isLoading = true;

		window.pdfjsLib.GlobalWorkerOptions.workerSrc =
			'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

		const pdf = await window.pdfjsLib.getDocument($bloburi).promise;
		const page = await pdf.getPage(1);

		const viewport = page.getViewport({ scale: 1.2 });
		const ctx = canvas.getContext('2d');

		canvas.width = viewport.width;
		canvas.height = viewport.height;

		await page.render({ canvasContext: ctx, viewport }).promise;

		setTimeout(() => (isLoading = false), 300);
	}

	onMount(() => {
		mounted = true;
		if ($bloburi) renderPdf();
	});

	$: if (mounted && $bloburi) renderPdf();
</script>

<article class="relative border border-neutral-300 bg-brown-50">
	<p>Cargando PDF...</p>

	{#if $bloburi}
		<canvas
			bind:this={canvas}
			class="absolute inset-0 m-auto transition-opacity"
			class:opacity-0={isLoading}
		></canvas>
	{/if}
</article>
