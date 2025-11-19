<script lang="ts">
	import type { PageProps } from './$types';
	import { createPDF } from '@/lib/pdf/base';
	import { bloburi } from '@/lib/stores';

	$bloburi = createPDF();
	let { data }: PageProps = $props();
</script>

<section class="flex flex-col items-center px-6 pt-12 pb-6 text-center">
	<h1 class="text-4xl font-bold">Calendario del año {data.year}</h1>
	<p>Calendario anual personalizable de una sola página para el año {data.year}.</p>

	<a class="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-neutral-100" href="#crear"
		>Crear calendario</a
	>
</section>
