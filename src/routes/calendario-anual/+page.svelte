<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<section class="flex flex-col items-center px-6 pt-12 pb-6 text-center">
	<h1 class="text-4xl font-bold">Calendario anual</h1>
	<p>Calendario anual personalizable de una sola página para este año.</p>

	<a class="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-neutral-100" href="#crear"
		>Crear calendario</a
	>
</section>
