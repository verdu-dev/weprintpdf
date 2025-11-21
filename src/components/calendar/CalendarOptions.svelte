<script>
	import { onMount } from 'svelte';
	import { DocOrientation, DocSize } from '@/lib/enums';
	import { createPDF } from '@/lib/pdf/base';
	import { bloburi, calendarOptions } from '@/lib/stores';

	const allYears = Array.from({ length: 10000 }, (_, i) => i);

	onMount(createPDF);
	$: ($calendarOptions, createPDF());

	function downloadPDF() {
		const blobUrl = $bloburi;
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = `calendario-${$calendarOptions.year}.pdf`;
		link.click();
	}
</script>

<aside
	class="flex flex-col gap-4 overflow-y-auto rounded-2xl bg-neutral-800 p-4 text-neutral-300 scrollbar-thin squircle thumb-neutral-600 track-neutral-800"
>
	<form class="contents" on:submit|preventDefault={createPDF}>
		<label class="flex flex-col gap-1">
			<p>Año {$calendarOptions.year}</p>
			<input
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				type="text"
				list="years"
				bind:value={$calendarOptions.year}
			/>

			<datalist id="years">
				{#each allYears as year}
					<option value={year}>{year}</option>
				{/each}
			</datalist>
		</label>

		<label class="flex flex-col gap-1">
			<p>Tamaño</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.size}
			>
				{#each Object.values(DocSize) as value}
					<option class="bg-neutral-900" {value}>{value}</option>
				{/each}
			</select>
		</label>

		<label class="flex flex-col gap-1">
			<p>Orientación</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.orientation}
			>
				{#each Object.values(DocOrientation) as value}
					<option class="bg-neutral-900" {value}>{value}</option>
				{/each}
			</select>
		</label>

		<label class="flex flex-col gap-1">
			<p>Regilla</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.grid}
			>
				<option class="bg-neutral-900" value="4,3">4 / 3</option>
				<option class="bg-neutral-900" value="3,4">3 / 4</option>
			</select>
		</label>

		<label class="flex flex-col gap-1">
			<p>Tamaño texto</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.textSize}
			>
				<option class="bg-neutral-900" value="s">Pequeño</option>
				<option class="bg-neutral-900" value="m">Mediano</option>
				<option class="bg-neutral-900" value="l">Grande</option>
			</select>
		</label>

		<label class="flex flex-col gap-1">
			<p>Marcar domingos</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.sundays}
			>
				<option class="bg-neutral-900" value={true}>Si</option>
				<option class="bg-neutral-900" value={false}>No</option>
			</select>
		</label>

		<label class="flex flex-col gap-1">
			<p>Recuadro dias</p>

			<select
				class="w-full rounded-lg border border-neutral-600 p-2 outline-none"
				bind:value={$calendarOptions.dayBox}
			>
				<option class="bg-neutral-900" value={true}>Si</option>
				<option class="bg-neutral-900" value={false}>No</option>
			</select>
		</label>

		<button
			class="mt-4 cursor-pointer rounded-lg bg-neutral-50 px-4 py-2 text-neutral-900"
			type="button"
			on:click={downloadPDF}
		>
			Descargar PDF
		</button>
	</form>
</aside>
