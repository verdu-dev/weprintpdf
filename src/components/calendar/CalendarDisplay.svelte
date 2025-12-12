<script>
	import { bloburi } from '@/lib/stores';

	function fadeLoad() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 800);
	}

	let isLoading = false;

	$: src = $bloburi + '#view=fit&toolbar=0';
	$: if ($bloburi) fadeLoad();
</script>

<article
	class="rounded-2xl border border-neutral-300 bg-brown-50 p-1.5 text-neutral-600 squircle dark:border-neutral-700 dark:bg-neutral-900"
>
	<div
		class="relative flex size-full items-center justify-center overflow-clip rounded-xl border border-neutral-300 bg-pdf squircle dark:border-neutral-700"
	>
		<p>Cargando pdf</p>

		{#if $bloburi}
			<iframe
				class="dark:border-pdf-dark dark:bg-pdf-dark absolute inset-0 size-full border-8 border-pdf"
				class:opacity-0={isLoading}
				title="Vista previa del calendario"
				{src}
			>
			</iframe>
		{/if}
	</div>
</article>
