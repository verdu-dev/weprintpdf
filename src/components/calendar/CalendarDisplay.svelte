<script>
	import { bloburi } from '@/lib/stores';
	import { generateCalendar } from '@/lib/utils';

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
	class="relative flex items-center justify-center overflow-clip rounded-3xl border border-neutral-800 bg-neutral-800 text-neutral-600 squircle"
>
	<p>Cargando pdf</p>

	{#if $bloburi}
		<iframe
			class="absolute inset-0 size-full border-none"
			class:opacity-0={isLoading}
			title="Vista previa del calendario"
			{src}
		>
		</iframe>
	{/if}
</article>
